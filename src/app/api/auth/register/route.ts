import { NextRequest, NextResponse } from 'next/server'
import { registerUser, createToken, setAuthCookie } from '@/lib/auth'
import { isValidEmail } from '@/lib/utils'
import { isDatabaseAvailable } from '@/lib/db'

// Force dynamic rendering - cette route utilise cookies()
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Vérifier si la base de données est configurée
    if (!isDatabaseAvailable) {
      return NextResponse.json(
        { error: 'Mode démo : La base de données n\'est pas configurée. Créez un fichier .env.local avec DATABASE_URL pour activer l\'inscription.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { email, password, firstName, lastName } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      )
    }

    // Créer l'utilisateur
    const user = await registerUser({
      email,
      password,
      firstName,
      lastName,
    })

    // Créer le token et définir le cookie
    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role as 'CLIENT' | 'VENDOR' | 'ADMIN',
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
    })

    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })
  } catch (error) {
    console.error('Erreur inscription:', error)
    
    if (error instanceof Error && error.message.includes('existe déjà')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    )
  }
}

