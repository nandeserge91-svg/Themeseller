import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Webhook Payfonte - reçoit les notifications de paiement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Webhook Payfonte reçu:', JSON.stringify(body, null, 2))

    const { 
      id,
      status,
      metadata,
      paid_at 
    } = body

    // Vérifier le statut du paiement
    if (status === 'successful' || status === 'completed') {
      const orderId = metadata?.order_id

      if (orderId) {
        // Mettre à jour la commande comme payée
        try {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'COMPLETED',
              stripePaymentId: `payfonte_${id}`, // Utiliser le champ existant pour stocker l'ID Payfonte
              paidAt: paid_at ? new Date(paid_at) : new Date(),
            }
          })
          console.log(`Commande ${orderId} mise à jour - Paiement Mobile Money réussi`)
        } catch (dbError) {
          console.error('Erreur mise à jour commande:', dbError)
        }
      }
    } else if (status === 'failed' || status === 'cancelled') {
      const orderId = metadata?.order_id
      
      if (orderId) {
        try {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'CANCELLED',
            }
          })
          console.log(`Commande ${orderId} - Paiement Mobile Money échoué`)
        } catch (dbError) {
          console.error('Erreur mise à jour commande:', dbError)
        }
      }
    }

    // Répondre OK à Payfonte
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Erreur webhook Payfonte:', error)
    // Toujours répondre 200 pour éviter les retries
    return NextResponse.json({ received: true, error: 'Processing error' })
  }
}

