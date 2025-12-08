import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️ STRIPE_SECRET_KEY non définie - Les paiements ne fonctionneront pas')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
  typescript: true,
})

/**
 * Crée une session de paiement Stripe
 */
export async function createCheckoutSession({
  items,
  userId,
  successUrl,
  cancelUrl,
}: {
  items: Array<{
    productId: string
    title: string
    price: number
    image?: string
  }>
  userId: string
  successUrl: string
  cancelUrl: string
}) {
  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.title,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.price * 100), // Stripe utilise les centimes
    },
    quantity: 1,
  }))

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      productIds: items.map((i) => i.productId).join(','),
    },
    customer_email: undefined, // Sera rempli si l'utilisateur est connecté
  })

  return session
}

/**
 * Récupère une session Stripe
 */
export async function getCheckoutSession(sessionId: string) {
  return stripe.checkout.sessions.retrieve(sessionId)
}

/**
 * Vérifie la signature d'un webhook Stripe
 */
export function constructWebhookEvent(
  body: string | Buffer,
  signature: string,
  webhookSecret: string
) {
  return stripe.webhooks.constructEvent(body, signature, webhookSecret)
}

/**
 * Crée un compte Stripe Connect pour un vendeur
 */
export async function createConnectAccount(email: string) {
  const account = await stripe.accounts.create({
    type: 'express',
    email,
    country: 'FR',
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  })

  return account
}

/**
 * Génère un lien d'onboarding Stripe Connect
 */
export async function createAccountLink(
  accountId: string,
  refreshUrl: string,
  returnUrl: string
) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  })

  return accountLink
}

/**
 * Transfert vers un vendeur
 */
export async function transferToVendor(
  amount: number,
  vendorStripeAccountId: string,
  description: string
) {
  const transfer = await stripe.transfers.create({
    amount: Math.round(amount * 100),
    currency: 'eur',
    destination: vendorStripeAccountId,
    description,
  })

  return transfer
}







