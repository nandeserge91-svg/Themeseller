import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Vérifier si l'utilisateur a déjà un profil vendeur
    const existingProfile = await prisma.vendorProfile.findUnique({
      where: { userId: user.id },
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Vous avez déjà un compte vendeur' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { storeName, bio, website } = body

    if (!storeName?.trim()) {
      return NextResponse.json(
        { error: 'Nom de boutique requis' },
        { status: 400 }
      )
    }

    // Générer un slug unique
    const baseSlug = slugify(storeName)
    let slug = baseSlug
    let counter = 1

    while (await prisma.vendorProfile.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Créer le profil vendeur
    const vendorProfile = await prisma.vendorProfile.create({
      data: {
        userId: user.id,
        storeName: storeName.trim(),
        slug,
        bio: bio?.trim() || null,
        website: website?.trim() || null,
      },
    })

    // Mettre à jour le rôle de l'utilisateur
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'VENDOR' },
    })

    return NextResponse.json({
      success: true,
      vendorProfile,
    })
  } catch (error) {
    console.error('Erreur inscription vendeur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    )
  }
}







