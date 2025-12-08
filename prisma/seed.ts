import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Créer les catégories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'wordpress' },
      update: {},
      create: {
        name: 'WordPress',
        slug: 'wordpress',
        description: 'Thèmes et plugins WordPress premium',
        icon: 'Palette',
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'shopify' },
      update: {},
      create: {
        name: 'Shopify',
        slug: 'shopify',
        description: 'Thèmes Shopify pour e-commerce',
        icon: 'ShoppingCart',
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'systeme-io' },
      update: {},
      create: {
        name: 'Systeme.io',
        slug: 'systeme-io',
        description: 'Templates et funnels pour Systeme.io',
        icon: 'Zap',
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'html' },
      update: {},
      create: {
        name: 'HTML',
        slug: 'html',
        description: 'Templates HTML5 et CSS3 responsive',
        icon: 'Code',
        order: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'figma' },
      update: {},
      create: {
        name: 'Figma',
        slug: 'figma',
        description: 'UI Kits et designs Figma',
        icon: 'Figma',
        order: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'funnels' },
      update: {},
      create: {
        name: 'Tunnels de Vente',
        slug: 'funnels',
        description: 'Funnels et pages de vente optimisées',
        icon: 'TrendingUp',
        order: 6,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'email' },
      update: {},
      create: {
        name: 'Email Templates',
        slug: 'email',
        description: 'Templates email responsive',
        icon: 'Mail',
        order: 7,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'landing' },
      update: {},
      create: {
        name: 'Landing Pages',
        slug: 'landing',
        description: 'Pages d\'atterrissage haute conversion',
        icon: 'Layout',
        order: 8,
      },
    }),
  ])

  console.log('✅ Categories créées')

  // Créer un admin
  const adminPassword = await bcrypt.hash('admin123456', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@themepro.fr' },
    update: {},
    create: {
      email: 'admin@themepro.fr',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'ThemePro',
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin créé:', admin.email)

  // Créer un vendeur démo
  const vendorPassword = await bcrypt.hash('vendeur123456', 12)
  const vendor = await prisma.user.upsert({
    where: { email: 'vendeur@themepro.fr' },
    update: {},
    create: {
      email: 'vendeur@themepro.fr',
      password: vendorPassword,
      firstName: 'Jean',
      lastName: 'Designer',
      role: 'VENDOR',
    },
  })

  const vendorProfile = await prisma.vendorProfile.upsert({
    where: { userId: vendor.id },
    update: {},
    create: {
      userId: vendor.id,
      storeName: 'PixelCraft Studio',
      slug: 'pixelcraft-studio',
      bio: 'Créateur de templates premium depuis 2020. Spécialisé en WordPress et React.',
      totalSales: 245,
      totalRevenue: 14455,
      isVerified: true,
    },
  })

  console.log('✅ Vendeur créé:', vendor.email)

  // Créer des produits démo
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'saasify-admin-dashboard' },
      update: {},
      create: {
        title: 'SaaSify - Template Admin Dashboard Premium',
        slug: 'saasify-admin-dashboard',
        shortDescription: 'Un dashboard admin moderne et complet pour vos applications SaaS.',
        description: '<h2>Présentation</h2><p>SaaSify est un template admin dashboard premium...</p>',
        price: 79,
        salePrice: 59,
        images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'],
        mainFile: '/uploads/saasify.zip',
        version: '2.5.0',
        filesIncluded: ['HTML', 'CSS', 'JavaScript', 'TypeScript'],
        features: ['100+ Composants', '50+ Pages', 'Mode Sombre', 'Responsive'],
        tags: ['Dashboard', 'Admin', 'SaaS', 'React'],
        downloads: 3420,
        views: 15680,
        salesCount: 245,
        averageRating: 4.9,
        reviewCount: 145,
        status: 'APPROVED',
        isFeatured: true,
        publishedAt: new Date(),
        vendorId: vendorProfile.id,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'shopmax-ecommerce' },
      update: {},
      create: {
        title: 'ShopMax - E-commerce WordPress Theme',
        slug: 'shopmax-ecommerce',
        shortDescription: 'Thème WordPress WooCommerce complet pour boutique en ligne.',
        description: '<h2>ShopMax</h2><p>Le thème e-commerce ultime...</p>',
        price: 69,
        salePrice: 49,
        images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'],
        mainFile: '/uploads/shopmax.zip',
        version: '3.1.0',
        filesIncluded: ['PHP', 'CSS', 'JavaScript'],
        features: ['WooCommerce', 'Elementor', 'Multi-vendeur', 'SEO optimisé'],
        tags: ['WordPress', 'E-commerce', 'WooCommerce', 'Shop'],
        downloads: 4560,
        views: 21000,
        salesCount: 312,
        averageRating: 4.8,
        reviewCount: 189,
        status: 'APPROVED',
        isFeatured: true,
        isNew: true,
        publishedAt: new Date(),
        vendorId: vendorProfile.id,
        categoryId: categories[0].id,
      },
    }),
  ])

  console.log('✅ Produits créés:', products.length)

  // Créer un client démo
  const clientPassword = await bcrypt.hash('client123456', 12)
  const client = await prisma.user.upsert({
    where: { email: 'client@themepro.fr' },
    update: {},
    create: {
      email: 'client@themepro.fr',
      password: clientPassword,
      firstName: 'Marie',
      lastName: 'Martin',
      role: 'CLIENT',
    },
  })

  console.log('✅ Client créé:', client.email)

  // Créer les paramètres de la plateforme
  await prisma.platformSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'ThemePro',
      siteDescription: 'La marketplace francophone #1 pour les thèmes et templates premium',
      defaultCommission: 15,
      stripeEnabled: true,
    },
  })

  console.log('✅ Paramètres créés')

  console.log('\n🎉 Seeding terminé !')
  console.log('\nComptes de test:')
  console.log('  Admin: admin@themepro.fr / admin123456')
  console.log('  Vendeur: vendeur@themepro.fr / vendeur123456')
  console.log('  Client: client@themepro.fr / client123456')
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

