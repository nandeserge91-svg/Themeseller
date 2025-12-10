import { NextRequest, NextResponse } from 'next/server'
import { prisma, isDatabaseAvailable } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Liste des vendeurs
export async function GET(request: NextRequest) {
  try {
    if (!isDatabaseAvailable || !prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const verified = searchParams.get('verified')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Construire la requête
    const where: any = {}

    // Note: isFeatured n'existe pas dans le schéma actuel
    // On peut l'ajouter plus tard si nécessaire
    if (featured === 'true') {
      where.isVerified = true // Pour l'instant, featured = verified
    }

    if (verified === 'true') {
      where.isVerified = true
    }

    if (search) {
      where.OR = [
        { storeName: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ]
    }

    const vendors = await prisma.vendorProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          }
        },
        products: {
          where: { status: 'APPROVED' },
          select: {
            id: true,
            salesCount: true,
            averageRating: true,
            reviewCount: true,
          }
        }
      },
      orderBy: [
        { isVerified: 'desc' },
        { totalSales: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
    })

    // Formater les vendeurs pour le frontend
    const formattedVendors = vendors.map(v => {
      const totalSales = v.products.reduce((acc, p) => acc + p.salesCount, 0)
      const totalReviews = v.products.reduce((acc, p) => acc + p.reviewCount, 0)
      const avgRating = v.products.length > 0
        ? v.products.reduce((acc, p) => acc + Number(p.averageRating), 0) / v.products.length
        : 0

      return {
        id: v.id,
        name: v.storeName,
        slug: v.slug,
        avatar: v.logo || v.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(v.storeName)}&background=6366f1&color=fff`,
        banner: v.banner || 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&h=300&fit=crop',
        bio: v.bio || 'Vendeur sur ThemePro',
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: totalReviews,
        totalSales: totalSales,
        productCount: v.products.length,
        isVerified: v.isVerified,
        featured: v.isVerified, // Pour l'instant, featured = verified
        createdAt: v.createdAt.toISOString(),
      }
    })

    return NextResponse.json({ vendors: formattedVendors })
  } catch (error) {
    console.error('Erreur GET /api/vendors:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

