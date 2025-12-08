import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { slugify } from '@/lib/utils'

// GET /api/categories - Liste des catégories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            products: {
              where: { status: 'APPROVED' },
            },
          },
        },
        children: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Erreur GET /api/categories:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Créer une catégorie (admin uniquement)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès réservé aux administrateurs' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, icon, image, parentId, order } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Nom de catégorie requis' },
        { status: 400 }
      )
    }

    const slug = slugify(name)

    // Vérifier l'unicité du slug
    const existing = await prisma.category.findUnique({
      where: { slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce nom existe déjà' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon,
        image,
        parentId,
        order: order || 0,
      },
    })

    return NextResponse.json({
      success: true,
      category,
    })
  } catch (error) {
    console.error('Erreur POST /api/categories:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    )
  }
}







