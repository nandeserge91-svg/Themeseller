import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

    // Récupérer le fichier
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Utilisez JPG, PNG, WEBP ou GIF.' },
        { status: 400 }
      )
    }

    // Vérifier la taille (max 4.5 MB pour Vercel Blob gratuit)
    const maxSize = 4.5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Maximum 4.5 MB.' },
        { status: 400 }
      )
    }

    // Générer un nom unique
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `products/${user.id}/${timestamp}.${extension}`

    // Upload vers Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: blob.pathname,
    })

  } catch (error) {
    console.error('Erreur upload:', error)
    
    // Vérifier si c'est une erreur de configuration Vercel Blob
    if (error instanceof Error && error.message.includes('BLOB_READ_WRITE_TOKEN')) {
      return NextResponse.json(
        { error: 'Service de stockage non configuré. Utilisez des URLs d\'images à la place.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de l\'upload' },
      { status: 500 }
    )
  }
}

