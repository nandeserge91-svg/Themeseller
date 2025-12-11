import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic'

const PAYFONTE_CLIENT_ID = process.env.PAYFONTE_CLIENT_ID
const PAYFONTE_CLIENT_SECRET = process.env.PAYFONTE_CLIENT_SECRET
// Payfonte uses different base URLs - check their documentation
const PAYFONTE_BASE_URL = process.env.PAYFONTE_BASE_URL || 'https://api.payfonte.com'

// Initier un paiement Mobile Money
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

    const body = await request.json()
    const { 
      amount, 
      currency = 'XOF', 
      phoneNumber, 
      provider, // orange_money, mtn_money, moov_money, wave
      orderId,
      description 
    } = body

    // Validation
    if (!amount || !phoneNumber || !provider) {
      return NextResponse.json(
        { error: 'Montant, numéro de téléphone et opérateur requis' },
        { status: 400 }
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

    // Formater le numéro de téléphone (ajouter indicatif CI si nécessaire)
    let formattedPhone = phoneNumber.replace(/\s+/g, '').replace(/^0/, '')
    if (!formattedPhone.startsWith('225')) {
      formattedPhone = '225' + formattedPhone
    }

    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.themeseller.com'}/api/payment/payfonte/webhook`
    const reference = `TS-${nanoid(10)}`

    console.log('Payfonte Request:', {
      url: `${PAYFONTE_BASE_URL}/v1/collect`,
      amount: Math.round(amount),
      currency,
      phone: formattedPhone,
      provider,
      callback: callbackUrl,
      reference
    })

    // Créer la transaction Payfonte - Try /v1/collect endpoint
    const payfonteResponse = await fetch(`${PAYFONTE_BASE_URL}/v1/collect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Client-Id': PAYFONTE_CLIENT_ID,
        'X-Client-Secret': PAYFONTE_CLIENT_SECRET,
      },
      body: JSON.stringify({
        amount: Math.round(amount),
        currency: currency,
        msisdn: formattedPhone,
        operator: provider.toUpperCase().replace('_MONEY', '').replace('_', ''),
        reference: reference,
        reason: description || `Achat Themeseller`,
        callback_url: callbackUrl,
        metadata: {
          order_id: orderId || reference,
          user_id: user.id,
        }
      }),
    })

    let payfonteData
    const responseText = await payfonteResponse.text()
    
    try {
      payfonteData = JSON.parse(responseText)
    } catch {
      console.error('Payfonte response not JSON:', responseText)
      payfonteData = { message: responseText }
    }

    console.log('Payfonte Response:', {
      status: payfonteResponse.status,
      ok: payfonteResponse.ok,
      data: payfonteData
    })

    if (!payfonteResponse.ok) {
      console.error('Erreur Payfonte:', payfonteData)
      return NextResponse.json(
        { 
          error: payfonteData.message || payfonteData.error || 'Erreur lors de l\'initiation du paiement',
          details: payfonteData
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      transaction: {
        id: payfonteData.id || payfonteData.transaction_id || reference,
        status: payfonteData.status || 'pending',
        amount: payfonteData.amount || amount,
        currency: payfonteData.currency || currency,
        provider: provider,
        reference: payfonteData.reference || reference,
      },
      message: 'Veuillez valider le paiement sur votre téléphone',
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
    const transactionId = searchParams.get('transactionId')

    if (!transactionId) {
      return NextResponse.json(
        { error: 'ID de transaction requis' },
        { status: 400 }
      )
    }

    if (!PAYFONTE_CLIENT_ID || !PAYFONTE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'Service de paiement non configuré' },
        { status: 500 }
      )
    }

    const payfonteResponse = await fetch(`${PAYFONTE_BASE_URL}/payments/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${PAYFONTE_CLIENT_ID}:${PAYFONTE_CLIENT_SECRET}`).toString('base64')}`,
      },
    })

    const payfonteData = await payfonteResponse.json()

    if (!payfonteResponse.ok) {
      return NextResponse.json(
        { error: 'Transaction non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      transaction: {
        id: payfonteData.id,
        status: payfonteData.status,
        amount: payfonteData.amount,
        currency: payfonteData.currency,
        provider: payfonteData.provider,
        paid_at: payfonteData.paid_at,
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

