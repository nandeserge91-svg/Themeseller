import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

// GET /api/orders/[id]/download - Télécharger les fichiers d'une commande
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    // Récupérer la commande avec les items
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier que la commande appartient à l'utilisateur
    if (order.userId !== user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Vérifier que la commande est payée
    if (order.status !== 'PAID' && order.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Commande non payée' },
        { status: 400 }
      )
    }

    // Trouver l'item à télécharger
    const item = order.items.find((i) => 
      productId ? i.productId === productId : true
    )

    if (!item) {
      return NextResponse.json(
        { error: 'Produit non trouvé dans la commande' },
        { status: 404 }
      )
    }

    // Vérifier le nombre de téléchargements
    if (item.downloadCount >= item.maxDownloads) {
      return NextResponse.json(
        { error: 'Nombre maximum de téléchargements atteint' },
        { status: 400 }
      )
    }

    // Incrémenter le compteur de téléchargements
    await prisma.orderItem.update({
      where: { id: item.id },
      data: { downloadCount: { increment: 1 } },
    })

    // Incrémenter les téléchargements du produit
    await prisma.product.update({
      where: { id: item.productId },
      data: { downloads: { increment: 1 } },
    })

    // Dans un vrai système, on retournerait une URL signée vers le fichier
    // Pour l'exemple, on retourne juste le chemin
    return NextResponse.json({
      success: true,
      downloadUrl: item.product.mainFile,
      remainingDownloads: item.maxDownloads - item.downloadCount - 1,
    })
  } catch (error) {
    console.error('Erreur GET /api/orders/[id]/download:', error)
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement' },
      { status: 500 }
    )
  }
}







