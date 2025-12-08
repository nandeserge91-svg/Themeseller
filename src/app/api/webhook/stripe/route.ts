import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/db'
import { constructWebhookEvent, transferToVendor } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Signature manquante' },
      { status: 400 }
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET non défini')
    return NextResponse.json(
      { error: 'Configuration manquante' },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    event = constructWebhookEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Erreur vérification webhook:', err)
    return NextResponse.json(
      { error: 'Signature invalide' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Récupérer la commande
        const order = await prisma.order.findFirst({
          where: { stripeSessionId: session.id },
          include: {
            items: {
              include: {
                product: {
                  include: { vendor: true },
                },
              },
            },
          },
        })

        if (!order) {
          console.error('Commande non trouvée pour la session:', session.id)
          break
        }

        // Mettre à jour le statut de la commande
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'PAID',
            paidAt: new Date(),
            stripePaymentId: session.payment_intent as string,
          },
        })

        // Mettre à jour les statistiques des produits et vendeurs
        for (const item of order.items) {
          // Incrémenter les ventes du produit
          await prisma.product.update({
            where: { id: item.productId },
            data: { salesCount: { increment: 1 } },
          })

          // Mettre à jour les stats du vendeur
          await prisma.vendorProfile.update({
            where: { id: item.product.vendorId },
            data: {
              totalSales: { increment: 1 },
              totalRevenue: { increment: item.vendorShare },
            },
          })

          // Transférer au vendeur si Stripe Connect est configuré
          if (item.product.vendor.stripeAccountId) {
            try {
              await transferToVendor(
                Number(item.vendorShare),
                item.product.vendor.stripeAccountId,
                `Vente: ${item.product.title} (Commande: ${order.orderNumber})`
              )
            } catch (transferError) {
              console.error('Erreur transfert vendeur:', transferError)
              // Continuer même si le transfert échoue
            }
          }
        }

        // Vider le panier de l'utilisateur
        await prisma.cartItem.deleteMany({
          where: {
            userId: order.userId,
            productId: { in: order.items.map((i) => i.productId) },
          },
        })

        console.log(`Commande ${order.orderNumber} payée avec succès`)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session

        // Annuler la commande si le paiement a expiré
        await prisma.order.updateMany({
          where: { stripeSessionId: session.id },
          data: { status: 'CANCELLED' },
        })

        console.log('Session de paiement expirée:', session.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Paiement échoué:', paymentIntent.id)
        break
      }

      default:
        console.log(`Événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erreur traitement webhook:', error)
    return NextResponse.json(
      { error: 'Erreur traitement webhook' },
      { status: 500 }
    )
  }
}







