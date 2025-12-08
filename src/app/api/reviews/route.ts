import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// GET /api/reviews - Liste des avis pour un produit
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    if (!productId) {
      return NextResponse.json(
        { error: 'ID produit requis' },
        { status: 400 }
      )
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          productId,
          isVisible: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.review.count({
        where: {
          productId,
          isVisible: true,
        },
      }),
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Erreur GET /api/reviews:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des avis' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Créer un avis
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
    const { productId, rating, title, comment } = body

    // Validation
    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'La note doit être entre 1 et 5' },
        { status: 400 }
      )
    }

    // Vérifier que le produit existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur a acheté ce produit
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: user.id,
          status: { in: ['PAID', 'COMPLETED'] },
        },
      },
    })

    if (!hasPurchased) {
      return NextResponse.json(
        { error: 'Vous devez acheter ce produit pour laisser un avis' },
        { status: 403 }
      )
    }

    // Vérifier qu'il n'y a pas déjà un avis
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'Vous avez déjà laissé un avis pour ce produit' },
        { status: 400 }
      )
    }

    // Créer l'avis
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId,
        rating,
        title,
        comment,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    })

    // Recalculer la note moyenne du produit
    const reviews = await prisma.review.findMany({
      where: { productId, isVisible: true },
      select: { rating: true },
    })

    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating,
        reviewCount: reviews.length,
      },
    })

    return NextResponse.json({
      success: true,
      review,
    })
  } catch (error) {
    console.error('Erreur POST /api/reviews:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'avis' },
      { status: 500 }
    )
  }
}







