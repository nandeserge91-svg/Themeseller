import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'
import { isDatabaseAvailable } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Vérifier si la base de données est configurée
    if (!isDatabaseAvailable) {
      return NextResponse.json(
        { error: 'Mode démo : La base de données n\'est pas configurée. Créez un fichier .env.local avec DATABASE_URL pour activer la connexion.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Connexion
    const { user, token } = await loginUser(email, password)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
      token,
    })
  } catch (error) {
    console.error('Erreur connexion:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
}

