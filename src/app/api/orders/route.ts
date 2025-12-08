import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { generateOrderNumber } from '@/lib/utils'
import { createCheckoutSession } from '@/lib/stripe'

// GET /api/orders - Liste des commandes de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  images: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where: { userId: user.id } }),
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Erreur GET /api/orders:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Créer une commande et initier le paiement
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productIds } = body

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Produits requis' },
        { status: 400 }
      )
    }

    // Récupérer les produits
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        status: 'APPROVED',
      },
      include: {
        vendor: true,
      },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Certains produits ne sont pas disponibles' },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur n'a pas déjà acheté ces produits
    const existingPurchases = await prisma.orderItem.findMany({
      where: {
        productId: { in: productIds },
        order: {
          userId: user.id,
          status: { in: ['PAID', 'COMPLETED'] },
        },
      },
    })

    if (existingPurchases.length > 0) {
      return NextResponse.json(
        { error: 'Vous avez déjà acheté certains de ces produits' },
        { status: 400 }
      )
    }

    // Calculer les totaux
    const subtotal = products.reduce((sum, p) => {
      const price = p.salePrice ? Number(p.salePrice) : Number(p.price)
      return sum + price
    }, 0)

    const platformCommission = parseFloat(process.env.PLATFORM_COMMISSION || '15')
    const platformFee = subtotal * (platformCommission / 100)
    const total = subtotal

    // Créer la commande
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: user.id,
        subtotal,
        platformFee,
        total,
        status: 'PENDING',
        items: {
          create: products.map((product) => {
            const price = product.salePrice ? Number(product.salePrice) : Number(product.price)
            const vendorShare = price * (1 - platformCommission / 100)
            const platformShare = price * (platformCommission / 100)

            return {
              productId: product.id,
              vendorId: product.vendorId,
              price,
              vendorShare,
              platformShare,
            }
          }),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Créer la session Stripe
    const successUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/panier`

    const stripeSession = await createCheckoutSession({
      items: products.map((p) => ({
        productId: p.id,
        title: p.title,
        price: p.salePrice ? Number(p.salePrice) : Number(p.price),
        image: (p.images as string[])[0],
      })),
      userId: user.id,
      successUrl,
      cancelUrl,
    })

    // Sauvegarder l'ID de session Stripe
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id },
    })

    return NextResponse.json({
      success: true,
      order,
      checkoutUrl: stripeSession.url,
    })
  } catch (error) {
    console.error('Erreur POST /api/orders:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    )
  }
}







