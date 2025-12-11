import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma, isDatabaseAvailable } from '@/lib/db'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic'

const PAYFONTE_CLIENT_ID = process.env.PAYFONTE_CLIENT_ID
const PAYFONTE_CLIENT_SECRET = process.env.PAYFONTE_CLIENT_SECRET
const PAYFONTE_ENV = process.env.PAYFONTE_ENV || 'production'

// URL API selon l'environnement
const PAYFONTE_API_URL = PAYFONTE_ENV === 'sandbox' 
  ? 'https://sandbox-api.payfonte.com/payments/v1/checkouts'
  : 'https://api.payfonte.com/payments/v1/checkouts'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.themeseller.com'

// Créer un checkout Payfonte (Standard Checkout)
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour effectuer un paiement' },
        { status: 401 }
      )
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Session invalide' },
        { status: 401 }
      )
    }

    // Vérifier la configuration Payfonte
    if (!PAYFONTE_CLIENT_ID || !PAYFONTE_CLIENT_SECRET) {
      console.error('Payfonte non configuré - CLIENT_ID:', !!PAYFONTE_CLIENT_ID, 'SECRET:', !!PAYFONTE_CLIENT_SECRET)
      return NextResponse.json(
        { error: 'Service de paiement non configuré. Contactez l\'administrateur.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { 
      amount, 
      currency = 'XOF',
      country = 'CI',
      productIds = [],
      customerName,
      customerEmail,
      customerPhone,
      narration
    } = body

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Montant invalide' },
        { status: 400 }
      )
    }

    // Générer une référence unique
    const reference = `TS-${Date.now()}-${nanoid(6).toUpperCase()}`

    // Créer la commande en base de données si disponible
    let orderId = reference
    if (isDatabaseAvailable) {
      try {
        // Récupérer les produits
        const products = productIds.length > 0 ? await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, price: true, salePrice: true, vendorId: true, title: true },
        }) : []

        const subtotal = products.length > 0 
          ? products.reduce((sum, p) => sum + Number(p.salePrice || p.price), 0)
          : amount

        const platformFeeRate = 0.15
        const platformFee = subtotal * platformFeeRate

        const order = await prisma.order.create({
          data: {
            userId: user.id,
            orderNumber: reference,
            status: 'PENDING',
            subtotal: subtotal,
            platformFee: platformFee,
            total: subtotal,
            items: products.length > 0 ? {
              create: products.map(p => ({
                productId: p.id,
                price: Number(p.salePrice || p.price),
                vendorId: p.vendorId,
                vendorShare: Number(p.salePrice || p.price) * (1 - platformFeeRate),
                platformShare: Number(p.salePrice || p.price) * platformFeeRate,
              })),
            } : undefined,
          },
        })
        orderId = order.id
      } catch (dbError) {
        console.error('Erreur création commande:', dbError)
        // Continue sans base de données
      }
    }

    // Formater le numéro de téléphone
    let formattedPhone = customerPhone?.replace(/\s+/g, '').replace(/^0/, '') || ''
    if (formattedPhone && !formattedPhone.startsWith('+')) {
      formattedPhone = '+225' + formattedPhone
    }

    // Préparer la requête Payfonte Standard Checkout
    const checkoutPayload = {
      reference: reference,
      amount: Math.round(amount),
      currency: currency,
      country: country,
      redirectURL: `${APP_URL}/api/payment/payfonte/callback`,
      webhook: `${APP_URL}/api/payment/payfonte/webhook`,
      customerBearsCharge: false,
      user: {
        email: customerEmail || user.email || 'client@themeseller.com',
        phoneNumber: formattedPhone || '+22500000000',
        name: customerName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Client Themeseller',
      },
      narration: narration || `Achat Themeseller - ${reference}`,
    }

    console.log('Payfonte Checkout Request:', {
      url: PAYFONTE_API_URL,
      payload: checkoutPayload
    })

    // Appeler l'API Payfonte
    const payfonteResponse = await fetch(PAYFONTE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'client-id': PAYFONTE_CLIENT_ID,
        'client-secret': PAYFONTE_CLIENT_SECRET,
      },
      body: JSON.stringify(checkoutPayload),
    })

    let payfonteData
    const responseText = await payfonteResponse.text()
    
    try {
      payfonteData = JSON.parse(responseText)
    } catch {
      console.error('Payfonte response not JSON:', responseText)
      return NextResponse.json(
        { error: 'Réponse invalide de Payfonte' },
        { status: 500 }
      )
    }

    console.log('Payfonte Response:', {
      status: payfonteResponse.status,
      data: payfonteData
    })

    if (!payfonteResponse.ok) {
      console.error('Erreur Payfonte:', payfonteData)
      return NextResponse.json(
        { 
          error: payfonteData.message || payfonteData.error || 'Erreur lors de la création du checkout',
          details: payfonteData
        },
        { status: 400 }
      )
    }

    // Mettre à jour la commande avec l'ID Payfonte
    if (isDatabaseAvailable && orderId !== reference) {
      try {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            stripePaymentId: `payfonte_${payfonteData.data?.id || reference}`,
          },
        })
      } catch (dbError) {
        console.error('Erreur mise à jour commande:', dbError)
      }
    }

    // Retourner l'URL de checkout
    return NextResponse.json({
      success: true,
      checkoutUrl: payfonteData.data?.shortURL || payfonteData.data?.url,
      reference: reference,
      orderId: orderId,
      payfonteId: payfonteData.data?.id,
    })

  } catch (error) {
    console.error('Erreur paiement Payfonte:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur lors du paiement' },
      { status: 500 }
    )
  }
}

// Vérifier le statut d'un paiement
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { error: 'Référence de transaction requise' },
        { status: 400 }
      )
    }

    if (!PAYFONTE_CLIENT_ID || !PAYFONTE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'Service de paiement non configuré' },
        { status: 500 }
      )
    }

    // URL de vérification Payfonte
    const verifyUrl = PAYFONTE_ENV === 'sandbox'
      ? `https://sandbox-api.payfonte.com/payments/v1/verify/${reference}`
      : `https://api.payfonte.com/payments/v1/verify/${reference}`

    const payfonteResponse = await fetch(verifyUrl, {
      method: 'GET',
      headers: {
        'client-id': PAYFONTE_CLIENT_ID,
        'client-secret': PAYFONTE_CLIENT_SECRET,
      },
    })

    let payfonteData
    try {
      payfonteData = await payfonteResponse.json()
    } catch {
      return NextResponse.json(
        { error: 'Réponse invalide de Payfonte' },
        { status: 500 }
      )
    }

    if (!payfonteResponse.ok) {
      return NextResponse.json(
        { error: 'Transaction non trouvée', details: payfonteData },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      transaction: {
        id: payfonteData.data?.id,
        reference: payfonteData.data?.reference,
        status: payfonteData.data?.status,
        amount: payfonteData.data?.amount,
        currency: payfonteData.data?.currency,
        paidAt: payfonteData.data?.paidAt,
      }
    })

  } catch (error) {
    console.error('Erreur vérification paiement:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

