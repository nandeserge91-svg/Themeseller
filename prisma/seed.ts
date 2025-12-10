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

  // Créer des produits démo avec descriptions complètes
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'saasify-admin-dashboard' },
      update: {
        shortDescription: 'Un dashboard admin moderne et complet pour vos applications SaaS, avec plus de 100 composants et 50 pages prêtes à l\'emploi.',
        description: `<h2>Présentation</h2>
<p>SaaSify est un template admin dashboard premium conçu pour les applications SaaS modernes. Avec son design épuré et ses nombreuses fonctionnalités, il vous permettra de créer rapidement des interfaces d'administration professionnelles.</p>

<h2>Caractéristiques principales</h2>
<ul>
  <li>Plus de 100 composants UI personnalisables</li>
  <li>50+ pages prêtes à l'emploi</li>
  <li>Design responsive adapté à tous les écrans</li>
  <li>Mode sombre inclus</li>
  <li>Graphiques et visualisations de données</li>
  <li>Système d'authentification complet</li>
  <li>Tables de données avancées</li>
  <li>Formulaires avec validation</li>
</ul>

<h2>Technologies utilisées</h2>
<p>Ce template utilise les dernières technologies web pour garantir des performances optimales :</p>
<ul>
  <li>React 18 avec TypeScript</li>
  <li>Next.js 14 (App Router)</li>
  <li>Tailwind CSS</li>
  <li>Framer Motion pour les animations</li>
  <li>Chart.js pour les graphiques</li>
</ul>

<h2>Support et mises à jour</h2>
<p>Vous bénéficiez de 6 mois de support technique et de mises à jour gratuites. Notre équipe est disponible pour répondre à toutes vos questions.</p>`,
        images: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=800&fit=crop',
        ],
        features: ['100+ Composants UI', '50+ Pages prêtes', 'Mode Sombre', 'Responsive Design', 'Documentation complète', 'Support 6 mois'],
      },
      create: {
        title: 'SaaSify - Template Admin Dashboard Premium',
        slug: 'saasify-admin-dashboard',
        shortDescription: 'Un dashboard admin moderne et complet pour vos applications SaaS, avec plus de 100 composants et 50 pages prêtes à l\'emploi.',
        description: `<h2>Présentation</h2>
<p>SaaSify est un template admin dashboard premium conçu pour les applications SaaS modernes. Avec son design épuré et ses nombreuses fonctionnalités, il vous permettra de créer rapidement des interfaces d'administration professionnelles.</p>

<h2>Caractéristiques principales</h2>
<ul>
  <li>Plus de 100 composants UI personnalisables</li>
  <li>50+ pages prêtes à l'emploi</li>
  <li>Design responsive adapté à tous les écrans</li>
  <li>Mode sombre inclus</li>
  <li>Graphiques et visualisations de données</li>
  <li>Système d'authentification complet</li>
  <li>Tables de données avancées</li>
  <li>Formulaires avec validation</li>
</ul>

<h2>Technologies utilisées</h2>
<p>Ce template utilise les dernières technologies web pour garantir des performances optimales :</p>
<ul>
  <li>React 18 avec TypeScript</li>
  <li>Next.js 14 (App Router)</li>
  <li>Tailwind CSS</li>
  <li>Framer Motion pour les animations</li>
  <li>Chart.js pour les graphiques</li>
</ul>

<h2>Support et mises à jour</h2>
<p>Vous bénéficiez de 6 mois de support technique et de mises à jour gratuites. Notre équipe est disponible pour répondre à toutes vos questions.</p>`,
        price: 79,
        salePrice: 59,
        images: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=800&fit=crop',
        ],
        mainFile: '/uploads/saasify.zip',
        version: '2.5.0',
        filesIncluded: ['HTML', 'CSS', 'JavaScript', 'TypeScript'],
        features: ['100+ Composants UI', '50+ Pages prêtes', 'Mode Sombre', 'Responsive Design', 'Documentation complète', 'Support 6 mois'],
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
      update: {
        shortDescription: 'Thème WordPress WooCommerce complet pour boutique en ligne avec des fonctionnalités e-commerce avancées.',
        description: `<h2>ShopMax - Le thème e-commerce ultime</h2>
<p>ShopMax est un thème WordPress premium spécialement conçu pour WooCommerce. Il offre une expérience d'achat fluide et professionnelle pour vos clients.</p>

<h2>Fonctionnalités e-commerce</h2>
<ul>
  <li>Intégration WooCommerce complète</li>
  <li>Pages produits optimisées pour la conversion</li>
  <li>Panier et checkout personnalisables</li>
  <li>Support multi-devises</li>
  <li>Gestion des stocks avancée</li>
  <li>Wishlist et comparaison de produits</li>
</ul>

<h2>Design et personnalisation</h2>
<ul>
  <li>Compatible Elementor Pro</li>
  <li>30+ templates de pages prédéfinis</li>
  <li>Options de personnalisation illimitées</li>
  <li>Design responsive mobile-first</li>
</ul>

<h2>Performance et SEO</h2>
<p>ShopMax est optimisé pour la vitesse et le référencement, vous aidant à atteindre de meilleures positions dans les résultats de recherche.</p>`,
        images: [
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=800&fit=crop',
        ],
        features: ['WooCommerce Ready', 'Elementor Pro', 'Multi-vendeur', 'SEO optimisé', 'Support 1 an', 'Mises à jour gratuites'],
      },
      create: {
        title: 'ShopMax - E-commerce WordPress Theme',
        slug: 'shopmax-ecommerce',
        shortDescription: 'Thème WordPress WooCommerce complet pour boutique en ligne avec des fonctionnalités e-commerce avancées.',
        description: `<h2>ShopMax - Le thème e-commerce ultime</h2>
<p>ShopMax est un thème WordPress premium spécialement conçu pour WooCommerce. Il offre une expérience d'achat fluide et professionnelle pour vos clients.</p>

<h2>Fonctionnalités e-commerce</h2>
<ul>
  <li>Intégration WooCommerce complète</li>
  <li>Pages produits optimisées pour la conversion</li>
  <li>Panier et checkout personnalisables</li>
  <li>Support multi-devises</li>
  <li>Gestion des stocks avancée</li>
  <li>Wishlist et comparaison de produits</li>
</ul>

<h2>Design et personnalisation</h2>
<ul>
  <li>Compatible Elementor Pro</li>
  <li>30+ templates de pages prédéfinis</li>
  <li>Options de personnalisation illimitées</li>
  <li>Design responsive mobile-first</li>
</ul>

<h2>Performance et SEO</h2>
<p>ShopMax est optimisé pour la vitesse et le référencement, vous aidant à atteindre de meilleures positions dans les résultats de recherche.</p>`,
        price: 69,
        salePrice: 49,
        images: [
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=800&fit=crop',
        ],
        mainFile: '/uploads/shopmax.zip',
        version: '3.1.0',
        filesIncluded: ['PHP', 'CSS', 'JavaScript'],
        features: ['WooCommerce Ready', 'Elementor Pro', 'Multi-vendeur', 'SEO optimisé', 'Support 1 an', 'Mises à jour gratuites'],
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

