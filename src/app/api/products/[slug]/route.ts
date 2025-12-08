import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// GET /api/products/[slug] - Détail d'un produit
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        vendor: {
          select: {
            id: true,
            storeName: true,
            slug: true,
            logo: true,
            bio: true,
            totalSales: true,
            user: {
              select: {
                avatar: true,
                createdAt: true,
              },
            },
          },
        },
        reviews: {
          where: { isVisible: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    // Incrémenter les vues
    await prisma.product.update({
      where: { id: product.id },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Erreur GET /api/products/[slug]:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du produit' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[slug] - Mettre à jour un produit
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: { vendor: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur est le propriétaire ou admin
    if (product.vendor.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
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
      status,
    } = body

    // Seul un admin peut changer le statut
    const updateData: any = {
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
    }

    if (user.role === 'ADMIN' && status) {
      updateData.status = status
      if (status === 'APPROVED') {
        updateData.publishedAt = new Date()
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    })
  } catch (error) {
    console.error('Erreur PUT /api/products/[slug]:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[slug] - Supprimer un produit
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: { vendor: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur est le propriétaire ou admin
    if (product.vendor.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Archiver plutôt que supprimer
    await prisma.product.update({
      where: { id: product.id },
      data: { status: 'ARCHIVED' },
    })

    return NextResponse.json({
      success: true,
      message: 'Produit archivé avec succès',
    })
  } catch (error) {
    console.error('Erreur DELETE /api/products/[slug]:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    )
  }
}







