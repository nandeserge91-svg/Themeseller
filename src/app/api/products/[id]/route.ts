import { NextRequest, NextResponse } from 'next/server'
import { prisma, isDatabaseAvailable } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// GET - Obtenir un produit par ID ou slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isDatabaseAvailable || !prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const { id } = await params

    // Chercher par ID ou par slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      },
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
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 })
    }

    // Vérifier les permissions pour les produits non approuvés
    if (product.status !== 'APPROVED') {
      const cookieStore = await cookies()
      const token = cookieStore.get('auth-token')?.value

      if (!token) {
        return NextResponse.json({ error: 'Produit non disponible' }, { status: 403 })
      }

      const user = await verifyToken(token)
      if (!user) {
        return NextResponse.json({ error: 'Produit non disponible' }, { status: 403 })
      }

      // Seuls l'admin et le propriétaire peuvent voir
      const isAdmin = user.role === 'ADMIN'
      const isOwner = product.vendor.userId === user.id

      if (!isAdmin && !isOwner) {
        return NextResponse.json({ error: 'Produit non disponible' }, { status: 403 })
      }
    }

    // Incrémenter les vues
    await prisma.product.update({
      where: { id: product.id },
      data: { views: { increment: 1 } }
    })

    // Formater le produit
    const formattedProduct = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      shortDescription: product.shortDescription,
      description: product.description,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      images: product.images as string[],
      image: (product.images as string[])[0] || '',
      previewUrl: product.previewUrl,
      mainFile: product.mainFile,
      version: product.version,
      features: product.features as string[],
      tags: product.tags as string[],
      filesIncluded: product.filesIncluded as string[],
      downloads: product.downloads,
      views: product.views + 1,
      sales: product.salesCount,
      rating: Number(product.averageRating),
      reviewCount: product.reviewCount,
      status: product.status.toLowerCase().replace('_', '-'),
      isFeatured: product.isFeatured,
      isNew: product.isNew,
      rejectionReason: product.rejectionReason,
      createdAt: product.createdAt.toISOString(),
      publishedAt: product.publishedAt?.toISOString(),
      category: product.category.name,
      categoryId: product.categoryId,
      categorySlug: product.category.slug,
      vendor: {
        id: product.vendorId,
        name: product.vendor.storeName,
        slug: product.vendor.slug,
        email: product.vendor.user.email,
        userId: product.vendor.userId,
      },
      reviews: product.reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        createdAt: r.createdAt.toISOString(),
        user: {
          name: `${r.user.firstName || ''} ${r.user.lastName || ''}`.trim() || 'Anonyme',
          avatar: r.user.avatar,
        }
      }))
    }

    return NextResponse.json({ product: formattedProduct, apiVersion: '2.0' })
  } catch (error) {
    console.error('Erreur GET /api/products/[id]:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PATCH - Mettre à jour un produit (admin ou propriétaire)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isDatabaseAvailable || !prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const { id } = await params

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

    // Trouver le produit
    const product = await prisma.product.findUnique({
      where: { id },
      include: { vendor: true }
    })

    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 })
    }

    // Vérifier les permissions
    const isAdmin = user.role === 'ADMIN'
    const isOwner = product.vendor.userId === user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    const body = await request.json()
    const updateData: any = {}

    // Actions admin
    if (isAdmin) {
      if (body.action === 'approve') {
        updateData.status = 'APPROVED'
        updateData.publishedAt = new Date()
        updateData.rejectionReason = null
      } else if (body.action === 'reject') {
        updateData.status = 'REJECTED'
        updateData.rejectionReason = body.reason || 'Non conforme aux standards'
      } else if (body.action === 'suspend') {
        updateData.status = 'ARCHIVED'
        updateData.rejectionReason = body.reason || 'Produit suspendu'
      } else if (body.action === 'reactivate') {
        updateData.status = 'APPROVED'
        updateData.rejectionReason = null
      } else if (body.action === 'feature') {
        updateData.isFeatured = true
      } else if (body.action === 'unfeature') {
        updateData.isFeatured = false
      }
    }

    // Actions propriétaire (et admin)
    if (body.title) updateData.title = body.title
    if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription
    if (body.description) updateData.description = body.description
    if (body.price) updateData.price = body.price
    if (body.salePrice !== undefined) updateData.salePrice = body.salePrice
    if (body.images) updateData.images = body.images
    if (body.previewUrl !== undefined) updateData.previewUrl = body.previewUrl
    if (body.version) updateData.version = body.version
    if (body.features) updateData.features = body.features
    if (body.tags) updateData.tags = body.tags
    if (body.filesIncluded) updateData.filesIncluded = body.filesIncluded

    // Resoumettre un produit rejeté ou suspendu
    if (body.action === 'resubmit' && isOwner) {
      if (product.status === 'REJECTED' || product.status === 'ARCHIVED' || product.status === 'DRAFT') {
        updateData.status = 'PENDING_REVIEW'
        updateData.rejectionReason = null
      }
    }

    // Soumettre un brouillon
    if (body.action === 'submit' && isOwner) {
      if (product.status === 'DRAFT') {
        updateData.status = 'PENDING_REVIEW'
      }
    }
    
    // Mettre à jour le statut en pending si le produit approuvé est modifié significativement
    if (body.action === 'update_and_resubmit' && isOwner) {
      if (product.status === 'APPROVED') {
        updateData.status = 'PENDING_REVIEW'
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        vendor: {
          include: { user: { select: { email: true } } }
        },
        category: true,
      }
    })

    return NextResponse.json({
      success: true,
      product: {
        id: updatedProduct.id,
        title: updatedProduct.title,
        status: updatedProduct.status.toLowerCase().replace('_', '-'),
      }
    })

  } catch (error) {
    console.error('Erreur PATCH /api/products/[id]:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un produit (admin ou propriétaire)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isDatabaseAvailable || !prisma) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const { id } = await params

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

    // Trouver le produit
    const product = await prisma.product.findUnique({
      where: { id },
      include: { vendor: true }
    })

    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 })
    }

    // Vérifier les permissions
    const isAdmin = user.role === 'ADMIN'
    const isOwner = product.vendor.userId === user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    await prisma.product.delete({ where: { id } })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erreur DELETE /api/products/[id]:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

