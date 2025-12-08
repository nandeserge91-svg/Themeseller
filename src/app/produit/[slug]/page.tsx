'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Star, 
  Download, 
  Eye,
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronLeft,
  ChevronRight,
  Check,
  Calendar,
  FileCode,
  Layers,
  Monitor,
  RefreshCw,
  Shield,
  MessageSquare,
  ThumbsUp
} from 'lucide-react'
import { useCartStore, CartProduct } from '@/store/cartStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { formatPrice, formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'
import StarRating from '@/components/ui/StarRating'
import ShareModal from '@/components/ui/ShareModal'

// Données de démonstration
const product = {
  id: '1',
  title: 'SaaSify - Template Admin Dashboard Premium',
  slug: 'saasify-admin-dashboard',
  shortDescription: 'Un dashboard admin moderne et complet pour vos applications SaaS, avec plus de 100 composants et 50 pages prêtes à l\'emploi.',
  description: `
    <h2>Présentation</h2>
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
    <p>Vous bénéficiez de 6 mois de support technique et de mises à jour gratuites. Notre équipe est disponible pour répondre à toutes vos questions.</p>
  `,
  price: 79,
  salePrice: 59,
  images: [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop',
  ],
  previewUrl: 'https://preview.example.com/saasify',
  averageRating: 4.9,
  reviewCount: 245,
  downloads: 3420,
  views: 15680,
  version: '2.5.0',
  lastUpdate: '2024-01-15',
  created: '2023-06-20',
  compatibility: {
    browsers: ['Chrome', 'Firefox', 'Safari', 'Edge'],
    frameworks: ['React', 'Next.js'],
  },
  filesIncluded: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Figma'],
  features: [
    '100+ Composants UI',
    '50+ Pages prêtes',
    'Mode Sombre',
    'Responsive Design',
    'Documentation complète',
    'Support 6 mois',
  ],
  tags: ['Dashboard', 'Admin', 'SaaS', 'React', 'Tailwind'],
  vendor: {
    id: 'v1',
    name: 'PixelCraft Studio',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    rating: 4.8,
    totalSales: 12500,
    memberSince: '2021-03-15',
  },
  categoryName: 'WordPress',
  categorySlug: 'wordpress',
  isNew: false,
  isFeatured: true,
}

const reviews = [
  {
    id: '1',
    user: {
      name: 'Jean-Pierre Martin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    rating: 5,
    title: 'Excellent template, très professionnel',
    comment: 'J\'ai utilisé ce template pour mon projet SaaS et je suis vraiment impressionné par la qualité. Le code est propre, bien organisé et la documentation est excellente. Le support a été très réactif pour répondre à mes questions.',
    date: '2024-01-10',
    helpful: 24,
  },
  {
    id: '2',
    user: {
      name: 'Sophie Bernard',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    rating: 5,
    title: 'Parfait pour mon projet',
    comment: 'Tout ce dont j\'avais besoin était inclus. Les composants sont modulaires et faciles à personnaliser. Je recommande vivement !',
    date: '2024-01-05',
    helpful: 18,
  },
  {
    id: '3',
    user: {
      name: 'Michel Dupont',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    rating: 4,
    title: 'Très bon mais quelques améliorations possibles',
    comment: 'Le template est globalement excellent. J\'aurais aimé avoir plus d\'exemples de pages e-commerce, mais le vendeur m\'a indiqué que c\'est prévu dans la prochaine mise à jour.',
    date: '2023-12-28',
    helpful: 12,
  },
]

const relatedProducts = [
  {
    id: '9',
    title: 'CreativeAgency - Modern Agency Theme',
    slug: 'creative-agency-theme',
    price: 59,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'],
    averageRating: 4.6,
    reviewCount: 178,
    downloads: 2100,
    vendorName: 'ThemeWizards',
    vendorId: 'v2',
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
  },
  {
    id: '12',
    title: 'DashUI - Admin Dashboard Figma Kit',
    slug: 'dashui-admin-figma',
    price: 79,
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'],
    averageRating: 4.9,
    reviewCount: 167,
    downloads: 1450,
    vendorName: 'DesignMasters',
    vendorId: 'v3',
  },
]

export default function ProductPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [currentImage, setCurrentImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'support'>('description')
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { addItem, removeItem, isInCart, clearCart } = useCartStore()
  const { currency } = useCurrencyStore()
  const inCart = isInCart(product.id)
  const currentCurrency = mounted ? currency : 'EUR'
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const cartProduct: CartProduct = {
    id: product.id,
    title: product.title,
    slug: product.slug,
    price: product.price,
    salePrice: product.salePrice,
    image: product.images[0],
    vendorName: product.vendor.name,
    vendorId: product.vendor.id,
  }

  const handleCartAction = () => {
    if (inCart) {
      removeItem(product.id)
    } else {
      addItem(cartProduct)
    }
  }

  const handleBuyNow = () => {
    // Vider le panier et ajouter uniquement ce produit
    clearCart()
    addItem(cartProduct)
    // Rediriger vers la page de checkout
    router.push('/checkout')
  }

  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary-600">
              Accueil
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/produits" className="text-gray-500 hover:text-primary-600">
              Produits
            </Link>
            <span className="text-gray-300">/</span>
            <Link href={`/categorie/${product.categorySlug}`} className="text-gray-500 hover:text-primary-600">
              {product.categoryName}
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="card overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={product.images[currentImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.isFeatured && (
                    <span className="px-3 py-1 bg-warning-500 text-white text-sm font-semibold rounded-full">
                      Populaire
                    </span>
                  )}
                  {discountPercentage > 0 && (
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                      -{discountPercentage}%
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                        currentImage === index
                          ? 'ring-2 ring-primary-500'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={image} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="card">
              <div className="border-b">
                <div className="flex gap-8 px-6">
                  {[
                    { id: 'description', label: 'Description' },
                    { id: 'reviews', label: `Avis (${product.reviewCount})` },
                    { id: 'support', label: 'Support' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`py-4 border-b-2 font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary-600 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'description' && (
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {/* Reviews Summary */}
                    <div className="flex items-center gap-8 p-6 bg-gray-50 rounded-xl">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-gray-900">{product.averageRating}</div>
                        <StarRating rating={product.averageRating} size="lg" className="mt-2" />
                        <p className="text-sm text-gray-500 mt-1">{product.reviewCount} avis</p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 w-6">{stars}</span>
                            <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-warning-500 rounded-full"
                                style={{ width: `${stars === 5 ? 75 : stars === 4 ? 20 : 5}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                          <div className="flex items-start gap-4">
                            <Image
                              src={review.user.avatar}
                              alt={review.user.name}
                              width={48}
                              height={48}
                              className="rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">{review.user.name}</span>
                                <StarRating rating={review.rating} size="sm" />
                              </div>
                              <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                              <p className="text-gray-600">{review.comment}</p>
                              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                <span>{formatDate(review.date)}</span>
                                <button className="flex items-center gap-1 hover:text-primary-600">
                                  <ThumbsUp className="w-4 h-4" />
                                  Utile ({review.helpful})
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'support' && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-xl">
                      <MessageSquare className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Support vendeur</h4>
                        <p className="text-gray-600">
                          Ce produit inclut 6 mois de support technique par le vendeur. 
                          Pour toute question, contactez directement {product.vendor.name}.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-accent-50 rounded-xl">
                      <RefreshCw className="w-6 h-6 text-accent-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Mises à jour gratuites</h4>
                        <p className="text-gray-600">
                          Vous recevrez automatiquement toutes les futures mises à jour du produit 
                          sans frais supplémentaires.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-warning-50 rounded-xl">
                      <Shield className="w-6 h-6 text-warning-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Garantie de qualité</h4>
                        <p className="text-gray-600">
                          Tous nos produits sont vérifiés par notre équipe avant publication. 
                          Remboursement possible sous 30 jours en cas de problème.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Info */}
          <div className="space-y-6">
            {/* Main Info Card */}
            <div className="card p-6 sticky top-24">
              <div className="mb-4">
                <span className="text-sm text-primary-600 font-medium uppercase tracking-wider">
                  {product.categoryName}
                </span>
                <h1 className="text-2xl font-bold text-gray-900 mt-1">
                  {product.title}
                </h1>
              </div>

              {/* Rating & Stats */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <StarRating rating={product.averageRating} size="sm" showValue />
                  <span className="text-sm text-gray-500">({product.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Download className="w-4 h-4" />
                  {product.downloads} ventes
                </div>
              </div>

              <p className="text-gray-600 mb-6">{product.shortDescription}</p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                {product.salePrice ? (
                  <>
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(product.salePrice, currentCurrency)}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product.price, currentCurrency)}
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(product.price, currentCurrency)}
                  </span>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleCartAction}
                  variant={inCart ? 'secondary' : 'primary'}
                  className="w-full"
                  size="lg"
                  leftIcon={inCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                >
                  {inCart ? 'Dans le panier' : 'Ajouter au panier'}
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  variant="accent" 
                  className="w-full" 
                  size="lg"
                >
                  Acheter maintenant
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t">
                <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">Favoris</span>
                </button>
                <button 
                  onClick={() => setIsShareOpen(true)}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">Partager</span>
                </button>
                {product.previewUrl && (
                  <a 
                    href={product.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                    <span className="text-sm">Aperçu</span>
                  </a>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Dernière MAJ:</span>
                  <span className="font-medium">{formatDate(product.lastUpdate)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileCode className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Version:</span>
                  <span className="font-medium">{product.version}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Fichiers:</span>
                  <span className="font-medium">{product.filesIncluded.join(', ')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Monitor className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Navigateurs:</span>
                  <span className="font-medium">{product.compatibility.browsers.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Fonctionnalités</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600">
                    <Check className="w-4 h-4 text-accent-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Vendor Card */}
            <div className="card p-6">
              <Link href={`/vendeur/${product.vendor.id}`} className="flex items-center gap-4 mb-4">
                <Image
                  src={product.vendor.avatar}
                  alt={product.vendor.name}
                  width={56}
                  height={56}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 hover:text-primary-600">
                    {product.vendor.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                    {product.vendor.rating} · {product.vendor.totalSales.toLocaleString()} ventes
                  </div>
                </div>
              </Link>
              <Link href={`/vendeur/${product.vendor.id}`}>
                <Button variant="ghost" className="w-full">
                  Voir le profil
                </Button>
              </Link>
            </div>

            {/* Tags */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/produits?q=${tag}`}
                    className="px-3 py-1 bg-gray-100 hover:bg-primary-50 hover:text-primary-600 
                             rounded-full text-sm text-gray-600 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Produits similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relProduct, index) => (
              <motion.div
                key={relProduct.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/produit/${relProduct.slug}`}>
                  <div className="card-product">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={relProduct.images[0]}
                        alt={relProduct.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {relProduct.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        par {relProduct.vendorName}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                          <span className="text-sm font-medium">{relProduct.averageRating}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {relProduct.salePrice ? (
                            <>
                              <span className="font-bold text-gray-900">
                                {formatPrice(relProduct.salePrice, currentCurrency)}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                {formatPrice(relProduct.price, currentCurrency)}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold text-gray-900">
                              {formatPrice(relProduct.price, currentCurrency)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={`/produit/${product.slug}`}
        title={product.title}
        description={product.shortDescription}
        image={product.images[0]}
      />
    </div>
  )
}

