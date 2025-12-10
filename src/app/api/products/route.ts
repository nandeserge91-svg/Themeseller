import { NextRequest, NextResponse } from 'next/server'
import { prisma, isDatabaseAvailable } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// GET - Liste des produits (publique pour les approuvés, tous pour admin)
export async function GET(request: NextRequest) {
  try {
    if (!isDatabaseAvailable || !prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const vendorId = searchParams.get('vendorId')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Vérifier si c'est un admin qui demande tous les produits
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    let isAdmin = false
    let currentUserId: string | null = null

    if (token) {
      const user = await verifyToken(token)
      if (user) {
        isAdmin = user.role === 'ADMIN'
        currentUserId = user.id
      }
    }

    // Construire la requête
    const where: any = {}

    // Vérifier si le vendeur appartient à l'utilisateur actuel
    let isOwnVendor = false
    if (vendorId && currentUserId) {
      const vendor = await prisma.vendorProfile.findUnique({
        where: { id: vendorId },
        select: { userId: true }
      })
      isOwnVendor = vendor?.userId === currentUserId
    }

    // Filtrer par vendeur
    if (vendorId) {
      where.vendorId = vendorId
    }

    // Filtrer par statut
    if (status) {
      where.status = status
    } else if (!isAdmin && !isOwnVendor) {
      // Par défaut, les non-admins et non-propriétaires ne voient que les approuvés
      where.status = 'APPROVED'
    }
    // Admins et propriétaires de vendeur voient tous les statuts

    // Filtrer par catégorie
    if (category) {
      where.category = { slug: category }
    }

    // Filtrer les featured
    if (featured === 'true') {
      where.isFeatured = true
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        vendor: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    // Formater les produits pour le frontend
    const formattedProducts = products.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      shortDescription: p.shortDescription,
      description: p.description,
      price: Number(p.price),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
      images: p.images as string[],
      image: (p.images as string[])[0] || '',
      previewUrl: p.previewUrl,
      version: p.version,
      features: p.features as string[],
      tags: p.tags as string[],
      filesIncluded: p.filesIncluded as string[],
      downloads: p.downloads,
      views: p.views,
      sales: p.salesCount,
      rating: Number(p.averageRating),
      reviewCount: p.reviewCount,
      status: p.status.toLowerCase().replace('_', '-'),
      isFeatured: p.isFeatured,
      isNew: p.isNew,
      rejectionReason: p.rejectionReason,
      createdAt: p.createdAt.toISOString(),
      publishedAt: p.publishedAt?.toISOString(),
      category: p.category.name,
      categoryId: p.categoryId,
      categorySlug: p.category.slug,
      vendor: {
        id: p.vendorId,
        name: p.vendor.storeName,
        slug: p.vendor.slug,
        email: p.vendor.user.email,
        userId: p.vendor.userId,
      }
    }))

    return NextResponse.json({ products: formattedProducts })
  } catch (error) {
    console.error('Erreur GET /api/products:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST - Créer un produit (vendeurs authentifiés)
export async function POST(request: NextRequest) {
  try {
    if (!isDatabaseAvailable || !prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    // Vérifier l'authentification
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

    // Vérifier que l'utilisateur est un vendeur
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: user.id }
    })

    if (!vendorProfile) {
      return NextResponse.json({ error: 'Profil vendeur requis' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      shortDescription,
      description,
      price,
      salePrice,
      images,
      previewUrl,
      mainFile,
      version,
      features,
      tags,
      filesIncluded,
      categoryId,
      status: productStatus
    } = body

    // Validation basique
    if (!title || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: `Champs requis manquants: ${!title ? 'title, ' : ''}${!description ? 'description, ' : ''}${!price ? 'price, ' : ''}${!categoryId ? 'categoryId' : ''}` },
        { status: 400 }
      )
    }

    // Vérifier que la catégorie existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { error: `Catégorie non trouvée avec l'ID: ${categoryId}` },
        { status: 400 }
      )
    }

    // Générer le slug
    const baseSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    // S'assurer que le slug est unique
    let slug = baseSlug
    let counter = 1
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Créer le produit
    const product = await prisma.product.create({
      data: {
        title,
        slug,
        shortDescription: shortDescription || '',
        description,
        price,
        salePrice: salePrice || null,
        images: images || [],
        previewUrl: previewUrl || null,
        mainFile: mainFile || '',
        version: version || '1.0.0',
        features: features || [],
        tags: tags || [],
        filesIncluded: filesIncluded || [],
        status: productStatus === 'draft' ? 'DRAFT' : 'PENDING_REVIEW',
        vendorId: vendorProfile.id,
        categoryId,
      },
      include: {
        vendor: {
          include: {
            user: {
              select: { email: true }
            }
          }
        },
        category: true,
      }
    })

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        title: product.title,
        slug: product.slug,
        status: product.status.toLowerCase().replace('_', '-'),
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur POST /api/products:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erreur serveur inconnue'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
