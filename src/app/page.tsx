'use client'

import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  HeadphonesIcon,
  TrendingUp,
  Star,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import ProductCard from '@/components/ui/ProductCard'
import CategoryCard from '@/components/ui/CategoryCard'
import HeroSearch from '@/components/ui/HeroSearch'

// Données de démonstration
const categories = [
  { name: 'WordPress', slug: 'wordpress', icon: '🎨', productCount: 2450, gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
  { name: 'Shopify', slug: 'shopify', icon: '🛒', productCount: 1560, gradient: 'bg-gradient-to-br from-green-500 to-emerald-600' },
  { name: 'Systeme.io', slug: 'systeme-io', icon: '⚡', productCount: 890, gradient: 'bg-gradient-to-br from-violet-500 to-purple-600' },
  { name: 'HTML/CSS', slug: 'html', icon: '🌐', productCount: 1890, gradient: 'bg-gradient-to-br from-orange-500 to-red-500' },
  { name: 'Figma', slug: 'figma', icon: '✨', productCount: 856, gradient: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  { name: 'Tunnels de Vente', slug: 'funnels', icon: '🚀', productCount: 423, gradient: 'bg-gradient-to-br from-teal-500 to-cyan-500' },
  { name: 'Email Templates', slug: 'email', icon: '📧', productCount: 678, gradient: 'bg-gradient-to-br from-cyan-500 to-blue-500' },
  { name: 'Landing Pages', slug: 'landing', icon: '📄', productCount: 1245, gradient: 'bg-gradient-to-br from-amber-500 to-orange-500' },
]

const featuredProducts = [
  {
    id: '1',
    title: 'SaaSify - Template Admin Dashboard Premium',
    slug: 'saasify-admin-dashboard',
    price: 79,
    salePrice: 59,
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'],
    averageRating: 4.9,
    reviewCount: 245,
    downloads: 3420,
    vendorName: 'PixelCraft Studio',
    vendorId: 'v1',
    categoryName: 'WordPress',
    isNew: false,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Flavor - Restaurant & Food Delivery Theme',
    slug: 'flavor-restaurant-theme',
    price: 49,
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'],
    averageRating: 4.7,
    reviewCount: 189,
    downloads: 2890,
    vendorName: 'ThemeWizards',
    vendorId: 'v2',
    categoryName: 'HTML',
    isNew: true,
    isFeatured: false,
  },
  {
    id: '3',
    title: 'CryptoTrade - Trading Platform UI Kit Figma',
    slug: 'cryptotrade-trading-ui',
    price: 89,
    salePrice: 69,
    images: ['https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=600&fit=crop'],
    averageRating: 4.8,
    reviewCount: 156,
    downloads: 1560,
    vendorName: 'DesignMasters',
    vendorId: 'v3',
    categoryName: 'Figma',
    isNew: false,
    isFeatured: true,
  },
  {
    id: '4',
    title: 'FunnelPro - Complete Sales Funnel System',
    slug: 'funnelpro-sales-funnel',
    price: 149,
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'],
    averageRating: 4.9,
    reviewCount: 98,
    downloads: 890,
    vendorName: 'ConvertLab',
    vendorId: 'v4',
    categoryName: 'Funnels',
    isNew: true,
    isFeatured: true,
  },
]

const newProducts = [
  {
    id: '5',
    title: 'Elegance - Portfolio Theme Minimaliste',
    slug: 'elegance-portfolio',
    price: 39,
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop'],
    averageRating: 4.6,
    reviewCount: 67,
    downloads: 780,
    vendorName: 'MinimalStudio',
    vendorId: 'v5',
    categoryName: 'HTML',
    isNew: true,
    isFeatured: false,
  },
  {
    id: '6',
    title: 'ShopMax - E-commerce WordPress Theme',
    slug: 'shopmax-ecommerce',
    price: 69,
    salePrice: 49,
    images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'],
    averageRating: 4.8,
    reviewCount: 312,
    downloads: 4560,
    vendorName: 'PixelCraft Studio',
    vendorId: 'v1',
    categoryName: 'WordPress',
    isNew: true,
    isFeatured: false,
  },
  {
    id: '7',
    title: 'MailFlow - Email Templates Collection',
    slug: 'mailflow-email-templates',
    price: 29,
    images: ['https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&h=600&fit=crop'],
    averageRating: 4.5,
    reviewCount: 145,
    downloads: 2340,
    vendorName: 'EmailPro',
    vendorId: 'v6',
    categoryName: 'Email',
    isNew: true,
    isFeatured: false,
  },
  {
    id: '8',
    title: 'Jeunesse - Coaching Business Funnel',
    slug: 'jeunesse-coaching-funnel',
    price: 99,
    images: ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'],
    averageRating: 4.7,
    reviewCount: 89,
    downloads: 560,
    vendorName: 'ConvertLab',
    vendorId: 'v4',
    categoryName: 'Funnels',
    isNew: true,
    isFeatured: false,
  },
]

const advantages = [
  {
    icon: Shield,
    title: 'Paiement Sécurisé',
    description: 'Transactions protégées par Stripe avec cryptage SSL 256 bits',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Zap,
    title: 'Téléchargement Instantané',
    description: 'Accédez immédiatement à vos fichiers après votre achat',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: HeadphonesIcon,
    title: 'Support Vendeur',
    description: 'Chaque vendeur offre un support dédié pour ses produits',
    gradient: 'from-green-500 to-teal-500',
  },
  {
    icon: TrendingUp,
    title: 'Mises à jour Gratuites',
    description: 'Recevez les nouvelles versions sans frais supplémentaires',
    gradient: 'from-purple-500 to-pink-500',
  },
]

const stats = [
  { value: '50K+', label: 'Templates' },
  { value: '12K+', label: 'Vendeurs' },
  { value: '500K+', label: 'Clients' },
  { value: '4.8', label: 'Note moyenne', icon: Star },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-bg overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-48 h-48 bg-accent-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                <Star className="w-4 h-4 fill-primary-500 text-primary-500" />
                Plus de 50 000 templates premium
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 mb-6 leading-tight"
            >
              Trouvez le template
              <span className="block gradient-text">parfait pour votre projet</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            >
              Des milliers de thèmes WordPress, templates HTML, designs Figma et tunnels de vente 
              créés par des designers talentueux du monde entier.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <HeroSearch />
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-display font-bold text-gray-900">
                  {stat.value}
                  {stat.icon && <stat.icon className="w-6 h-6 text-warning-500 fill-warning-500" />}
                </div>
                <p className="text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">
              Explorez par catégorie
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Trouvez exactement ce dont vous avez besoin parmi nos catégories populaires
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <CategoryCard key={category.slug} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="inline-block px-3 py-1 bg-warning-100 text-warning-700 text-sm font-medium rounded-full mb-4">
                ⭐ Les plus populaires
              </span>
              <h2 className="section-title">
                Templates en vedette
              </h2>
            </div>
            <Link
              href="/produits?featured=true"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold mt-4 md:mt-0 group"
            >
              Voir tout
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-700 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 top-0 w-96 h-96 rounded-full bg-white" />
          <div className="absolute -right-20 bottom-0 w-96 h-96 rounded-full bg-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Devenez vendeur et monétisez vos créations
              </h2>
              <p className="text-xl text-white/80 max-w-xl">
                Rejoignez plus de 12 000 designers et développeurs qui vendent leurs templates sur Themeseller
              </p>
              <ul className="flex flex-wrap justify-center lg:justify-start gap-6 mt-6 text-white/90">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent-400" />
                  Commission attractive
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent-400" />
                  Paiements mensuels
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent-400" />
                  Audience mondiale
                </li>
              </ul>
            </div>
            <Link href="/devenir-vendeur" className="btn-accent text-lg px-8 py-4">
              Commencer à vendre
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="inline-block px-3 py-1 bg-accent-100 text-accent-700 text-sm font-medium rounded-full mb-4">
                🆕 Fraîchement ajoutés
              </span>
              <h2 className="section-title">
                Nouveaux templates
              </h2>
            </div>
            <Link
              href="/produits?sort=newest"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold mt-4 md:mt-0 group"
            >
              Voir tout
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 mesh-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">
              Pourquoi choisir Themeseller ?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Une expérience d'achat premium avec des garanties qui font la différence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-8 text-center group hover:shadow-glow"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${advantage.gradient} 
                              flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                  <advantage.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {advantage.title}
                </h3>
                <p className="text-gray-600">
                  {advantage.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Rejoignez des milliers de clients satisfaits qui ont transformé leurs projets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "J'ai trouvé le template parfait pour mon agence en quelques minutes. La qualité est exceptionnelle et le support vendeur très réactif !",
                author: 'Marie Dupont',
                role: 'CEO, AgenceWeb',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
              },
              {
                quote: "En tant que vendeur, Themeseller m'a permis de multiplier mes revenus par 3. L'audience francophone est vraiment au rendez-vous.",
                author: 'Pierre Martin',
                role: 'Designer Freelance',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
              },
              {
                quote: "Les tunnels de vente disponibles sur Themeseller m'ont fait gagner des semaines de travail. ROI instantané !",
                author: 'Sophie Bernard',
                role: 'Marketing Manager',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800 rounded-2xl p-8 relative"
              >
                <div className="absolute -top-4 left-8 text-6xl text-primary-500 opacity-50">"</div>
                <p className="text-gray-300 mb-6 relative z-10">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card p-12 bg-gradient-to-br from-white to-primary-50 border border-primary-100"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Prêt à créer quelque chose d'extraordinaire ?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Parcourez notre collection de plus de 50 000 templates premium et trouvez 
              l'inspiration pour votre prochain projet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/produits" className="btn-primary text-lg px-8">
                Explorer les templates
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/devenir-vendeur" className="btn-secondary text-lg px-8">
                Devenir vendeur
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

