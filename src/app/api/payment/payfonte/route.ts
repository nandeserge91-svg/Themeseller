import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const PAYFONTE_CLIENT_ID = process.env.PAYFONTE_CLIENT_ID
const PAYFONTE_CLIENT_SECRET = process.env.PAYFONTE_CLIENT_SECRET
const PAYFONTE_BASE_URL = 'https://api.payfonte.com/v1'

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
      console.error('Payfonte non configuré')
      return NextResponse.json(
        { error: 'Service de paiement non configuré' },
        { status: 500 }
      )
    }

    // Formater le numéro de téléphone (ajouter indicatif CI si nécessaire)
    let formattedPhone = phoneNumber.replace(/\s+/g, '').replace(/^0/, '')
    if (!formattedPhone.startsWith('225')) {
      formattedPhone = '225' + formattedPhone
    }

    // Créer la transaction Payfonte
    const payfonteResponse = await fetch(`${PAYFONTE_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${PAYFONTE_CLIENT_ID}:${PAYFONTE_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount),
        currency,
        phone_number: formattedPhone,
        provider,
        description: description || `Achat Themeseller #${orderId || 'N/A'}`,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.themeseller.com'}/api/payment/payfonte/webhook`,
        metadata: {
          order_id: orderId,
          user_id: user.id,
        }
      }),
    })

    const payfonteData = await payfonteResponse.json()

    if (!payfonteResponse.ok) {
      console.error('Erreur Payfonte:', payfonteData)
      return NextResponse.json(
        { error: payfonteData.message || 'Erreur lors de l\'initiation du paiement' },
        { status: 400 }
      )
    }

    // Sauvegarder la transaction dans la base de données
    // On peut créer un modèle Payment si nécessaire

    return NextResponse.json({
      success: true,
      transaction: {
        id: payfonteData.id,
        status: payfonteData.status,
        amount: payfonteData.amount,
        currency: payfonteData.currency,
        provider: payfonteData.provider,
        reference: payfonteData.reference,
      },
      message: 'Veuillez valider le paiement sur votre téléphone',
    })

  } catch (error) {
    console.error('Erreur paiement Payfonte:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors du paiement' },
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

