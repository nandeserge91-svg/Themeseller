import { NextRequest, NextResponse } from 'next/server'
import { prisma, isDatabaseAvailable } from '@/lib/db'

export const dynamic = 'force-dynamic'

const PAYFONTE_CLIENT_ID = process.env.PAYFONTE_CLIENT_ID
const PAYFONTE_CLIENT_SECRET = process.env.PAYFONTE_CLIENT_SECRET
const PAYFONTE_ENV = process.env.PAYFONTE_ENV || 'production'

// Webhook Payfonte - reçoit les notifications de paiement
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    let payload

    try {
      payload = JSON.parse(rawBody)
    } catch {
      console.error('Webhook body invalide:', rawBody)
      return NextResponse.json({ received: true, error: 'Body invalide' })
    }

    console.log('Webhook Payfonte reçu:', JSON.stringify(payload, null, 2))

    // Extraire les données du webhook (format Payfonte)
    const data = payload.data || payload
    const { 
      reference,
      status,
      id: transactionId,
      paidAt,
      metadata,
    } = data

    // Support des deux formats (référence dans data ou dans metadata)
    const orderReference = reference || metadata?.order_id || metadata?.reference

    if (!orderReference) {
      console.error('Référence manquante dans le webhook')
      return NextResponse.json({ received: true, error: 'Référence manquante' })
    }

    // Vérifier le paiement via l'API Payfonte pour plus de sécurité
    let verifiedStatus = status
    if (PAYFONTE_CLIENT_ID && PAYFONTE_CLIENT_SECRET && orderReference) {
      try {
        const verifyUrl = PAYFONTE_ENV === 'sandbox'
          ? `https://sandbox-api.payfonte.com/payments/v1/verify/${orderReference}`
          : `https://api.payfonte.com/payments/v1/verify/${orderReference}`

        const verifyResponse = await fetch(verifyUrl, {
          method: 'GET',
          headers: {
            'client-id': PAYFONTE_CLIENT_ID,
            'client-secret': PAYFONTE_CLIENT_SECRET,
          },
        })

        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json()
          verifiedStatus = verifyData.data?.status || status
          console.log('Statut vérifié via API:', verifiedStatus)
        }
      } catch (verifyError) {
        console.error('Erreur vérification API:', verifyError)
      }
    }

    if (!isDatabaseAvailable) {
      console.log('Base de données non disponible')
      return NextResponse.json({ received: true })
    }

    // Trouver la commande par référence
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: orderReference },
          { stripePaymentId: `payfonte_${orderReference}` },
          { stripePaymentId: `payfonte_${transactionId}` },
        ]
      },
      include: {
        items: true,
      }
    })

    if (!order) {
      console.error('Commande non trouvée pour référence:', orderReference)
      return NextResponse.json({ received: true, error: 'Commande non trouvée' })
    }

    // Mapper le statut Payfonte vers notre statut
    const normalizedStatus = String(verifiedStatus).toLowerCase()
    let newStatus: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED' = order.status as any
    
    if (normalizedStatus === 'success' || normalizedStatus === 'successful' || normalizedStatus === 'completed') {
      newStatus = 'PAID'
    } else if (normalizedStatus === 'failed' || normalizedStatus === 'cancelled' || normalizedStatus === 'expired') {
      newStatus = 'CANCELLED'
    } else if (normalizedStatus === 'refunded') {
      newStatus = 'REFUNDED'
    }

    // Mettre à jour la commande
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: newStatus,
        stripePaymentId: transactionId ? `payfonte_${transactionId}` : order.stripePaymentId,
        paidAt: newStatus === 'PAID' ? (paidAt ? new Date(paidAt) : new Date()) : undefined,
        completedAt: newStatus === 'PAID' ? new Date() : undefined,
      },
    })

    // Si le paiement est réussi, incrémenter les ventes
    if (newStatus === 'PAID' && order.status !== 'PAID' && order.items.length > 0) {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { salesCount: { increment: 1 } },
        })
      }
      console.log(`✅ Paiement réussi - Commande ${order.orderNumber}`)
    } else if (newStatus === 'CANCELLED') {
      console.log(`❌ Paiement annulé - Commande ${order.orderNumber}`)
    }

    return NextResponse.json({ 
      received: true,
      success: true,
      orderId: order.id,
      newStatus,
    })

  } catch (error) {
    console.error('Erreur webhook Payfonte:', error)
    // Toujours répondre 200 pour éviter les retries
    return NextResponse.json({ received: true, error: 'Processing error' })
  }
}
