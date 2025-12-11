import { NextRequest, NextResponse } from 'next/server'
import { prisma, isDatabaseAvailable } from '@/lib/db'

export const dynamic = 'force-dynamic'

const PAYFONTE_CLIENT_ID = process.env.PAYFONTE_CLIENT_ID
const PAYFONTE_CLIENT_SECRET = process.env.PAYFONTE_CLIENT_SECRET
const PAYFONTE_ENV = process.env.PAYFONTE_ENV || 'production'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.themeseller.com'

// Callback après paiement Payfonte - redirige l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const reference = searchParams.get('reference')
    const transactionId = searchParams.get('transactionId')

    console.log('Payfonte Callback:', { status, reference, transactionId })

    if (!reference) {
      return NextResponse.redirect(`${APP_URL}/checkout?error=reference_manquante`)
    }

    // Vérifier le paiement via l'API Payfonte
    let paymentVerified = false
    let paymentStatus = status

    if (PAYFONTE_CLIENT_ID && PAYFONTE_CLIENT_SECRET) {
      try {
        const verifyUrl = PAYFONTE_ENV === 'sandbox'
          ? `https://sandbox-api.payfonte.com/payments/v1/verify/${reference}`
          : `https://api.payfonte.com/payments/v1/verify/${reference}`

        const verifyResponse = await fetch(verifyUrl, {
          method: 'GET',
          headers: {
            'client-id': PAYFONTE_CLIENT_ID,
            'client-secret': PAYFONTE_CLIENT_SECRET,
          },
        })

        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json()
          console.log('Payfonte Verify Response:', verifyData)
          
          paymentStatus = verifyData.data?.status
          paymentVerified = paymentStatus === 'success' || paymentStatus === 'completed'
        }
      } catch (verifyError) {
        console.error('Erreur vérification Payfonte:', verifyError)
      }
    }

    // Mettre à jour la commande en base de données
    if (isDatabaseAvailable) {
      try {
        const order = await prisma.order.findFirst({
          where: { orderNumber: reference },
        })

        if (order) {
          const newStatus = paymentVerified ? 'PAID' : 
                           (paymentStatus === 'failed' ? 'CANCELLED' : 'PENDING')

          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: newStatus,
              paidAt: paymentVerified ? new Date() : undefined,
              completedAt: paymentVerified ? new Date() : undefined,
            },
          })

          // Si payé, incrémenter les ventes des produits
          if (paymentVerified) {
            const orderItems = await prisma.orderItem.findMany({
              where: { orderId: order.id },
              select: { productId: true },
            })

            for (const item of orderItems) {
              await prisma.product.update({
                where: { id: item.productId },
                data: { salesCount: { increment: 1 } },
              })
            }
          }

          console.log(`Commande ${reference} mise à jour: ${newStatus}`)
        }
      } catch (dbError) {
        console.error('Erreur mise à jour commande:', dbError)
      }
    }

    // Rediriger vers la page appropriée
    if (paymentVerified || status === 'success') {
      return NextResponse.redirect(`${APP_URL}/checkout/success?reference=${reference}`)
    } else if (status === 'failed' || status === 'cancelled') {
      return NextResponse.redirect(`${APP_URL}/checkout?error=paiement_echoue&reference=${reference}`)
    } else {
      // Statut en attente ou inconnu
      return NextResponse.redirect(`${APP_URL}/checkout/success?reference=${reference}&pending=true`)
    }

  } catch (error) {
    console.error('Erreur callback Payfonte:', error)
    return NextResponse.redirect(`${APP_URL}/checkout?error=erreur_serveur`)
  }
}

