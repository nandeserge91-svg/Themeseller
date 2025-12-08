import { NextResponse } from 'next/server'
import { removeAuthCookie } from '@/lib/auth'

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







