import { NextResponse } from 'next/server'
import { removeAuthCookie } from '@/lib/auth'

// Force dynamic rendering - cette route utilise cookies()
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    await removeAuthCookie()
    
    return NextResponse.json({
      success: true,
      message: 'Déconnexion réussie',
    })
  } catch (error) {
    console.error('Erreur déconnexion:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    )
  }
}







