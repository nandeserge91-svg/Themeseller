import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { slugify } from '@/lib/utils'

// GET /api/products - Liste des produits
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Paramètres de pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Filtres
    const category = searchParams.get('category')
    const search = searchParams.get('q')
    const sort = searchParams.get('sort') || 'popular'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minRating = searchParams.get('minRating')
    const featured = searchParams.get('featured')
    const vendorId = searchParams.get('vendorId')

    // Construction de la requête
    const where: any = {
      status: 'APPROVED',
    }

    if (category && category !== 'all') {
      where.category = { slug: category }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { tags: { array_contains: [search] } },
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (minRating) {
      where.averageRating = { gte: parseFloat(minRating) }
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    if (vendorId) {
      where.vendorId = vendorId
    }

    // Tri
    let orderBy: any = {}
    switch (sort) {
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'popular':
        orderBy = { downloads: 'desc' }
        break
      case 'rating':
        orderBy = { averageRating: 'desc' }
        break
      case 'price-asc':
        orderBy = { price: 'asc' }
        break
      case 'price-desc':
        orderBy = { price: 'desc' }
        break
      default:
        orderBy = { downloads: 'desc' }
    }

    // Exécution des requêtes
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          shortDescription: true,
          price: true,
          salePrice: true,
          images: true,
          averageRating: true,
          reviewCount: true,
          downloads: true,
          isNew: true,
          isFeatured: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          vendor: {
            select: {
              id: true,
              storeName: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Erreur GET /api/products:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    )
  }
}

// POST /api/products - Créer un produit (vendeur uniquement)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    if (user.role !== 'VENDOR' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès réservé aux vendeurs' },
        { status: 403 }
      )
    }

    // Récupérer le profil vendeur
    const vendorProfile = await prisma.vendorProfile.findUnique({
      where: { userId: user.id },
    })

    if (!vendorProfile) {
      return NextResponse.json(
        { error: 'Profil vendeur non trouvé' },
        { status: 404 }
      )
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
      categoryId,
      version,
      compatibility,
      filesIncluded,
      features,
      tags,
    } = body

    // Validation
    if (!title || !description || !price || !categoryId || !mainFile) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    // Générer le slug
    const baseSlug = slugify(title)
    let slug = baseSlug
    let counter = 1

    // Vérifier l'unicité du slug
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Créer le produit
    const product = await prisma.product.create({
      data: {
        title,
        slug,
        shortDescription,
        description,
        price,
        salePrice,
        images: images || [],
        previewUrl,
        mainFile,
        categoryId,
        vendorId: vendorProfile.id,
        version,
        compatibility,
        filesIncluded,
        features,
        tags,
        status: 'PENDING_REVIEW', // En attente d'approbation admin
      },
    })

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error('Erreur POST /api/products:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    )
  }
}







