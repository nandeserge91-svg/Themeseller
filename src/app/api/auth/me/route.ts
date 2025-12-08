import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma, isDatabaseAvailable } from '@/lib/db'

// Force dynamic rendering - cette route utilise cookies()
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Si la base de données n'est pas configurée, retourner non authentifié
    if (!isDatabaseAvailable) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const payload = await getCurrentUser()

    if (!payload) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer les infos complètes de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        createdAt: true,
        vendorProfile: {
          select: {
            id: true,
            storeName: true,
            slug: true,
            isVerified: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Erreur auth/me:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

