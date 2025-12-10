'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
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
  ThumbsUp,
  ArrowLeft
} from 'lucide-react'
import { useCartStore, CartProduct } from '@/store/cartStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { useProductsStore, Product } from '@/store/productsStore'
import { formatPrice, formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'
import StarRating from '@/components/ui/StarRating'
import ShareModal from '@/components/ui/ShareModal'
import ProductCard from '@/components/ui/ProductCard'

// Données de reviews par défaut
const defaultReviews = [
  {
    id: '1',
    user: {
      name: 'Jean-Pierre Martin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    rating: 5,
    title: 'Excellent template, très professionnel',
    comment: 'J\'ai utilisé ce template pour mon projet et je suis vraiment impressionné par la qualité. Le code est propre et bien organisé.',
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
    comment: 'Tout ce dont j\'avais besoin était inclus. Les composants sont modulaires et faciles à personnaliser.',
    date: '2024-01-05',
    helpful: 18,
  },
]

export default function ProductPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImage, setCurrentImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'support'>('description')
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  
  const { addItem, removeItem, isInCart, clearCart } = useCartStore()
  const { currency } = useCurrencyStore()
  const { fetchProduct, products, fetchProducts } = useProductsStore()

  // Charger le produit depuis l'API
  useEffect(() => {
    setMounted(true)
    
    const loadProduct = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/products/${slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Produit non trouvé')
          } else {
            setError('Erreur lors du chargement du produit')
          }
          setIsLoading(false)
          return
        }
        
        const data = await response.json()
        setProduct(data.product)
        
        // Charger les produits similaires
        if (data.product.categorySlug) {
          const relatedResponse = await fetch(`/api/products?category=${data.product.categorySlug}&limit=3`)
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json()
            // Exclure le produit actuel
            setRelatedProducts(
              relatedData.products
                .filter((p: Product) => p.id !== data.product.id)
                .slice(0, 3)
            )
          }
        }
      } catch (err) {
        setError('Erreur de connexion')
      }
      
      setIsLoading(false)
    }
    
    loadProduct()
  }, [slug])

  const inCart = product ? isInCart(product.id) : false
  const currentCurrency = mounted ? currency : 'EUR'

  const handleAddToCart = () => {
    if (!product) return
    
    const cartProduct: CartProduct = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice || undefined,
      image: product.image || product.images?.[0] || '',
      vendorName: product.vendor.name,
      vendorId: product.vendor.id,
    }

    if (inCart) {
      removeItem(product.id)
    } else {
      addItem(cartProduct)
    }
  }

  const handleBuyNow = () => {
    if (!product) return
    
    const cartProduct: CartProduct = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice || undefined,
      image: product.image || product.images?.[0] || '',
      vendorName: product.vendor.name,
      vendorId: product.vendor.id,
    }
    
    clearCart()
    addItem(cartProduct)
    router.push('/checkout')
  }

  const nextImage = () => {
    if (product?.images) {
      setCurrentImage((prev) => (prev + 1) % product.images!.length)
    }
  }

  const prevImage = () => {
    if (product?.images) {
      setCurrentImage((prev) => (prev - 1 + product.images!.length) % product.images!.length)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Produit non trouvé'}</h1>
          <p className="text-gray-600 mb-6">Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
          <Link href="/produits">
            <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Retour aux produits
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const images = product.images || [product.image]
  const reviews = product.reviews || defaultReviews
  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Accueil</Link>
            <span className="text-gray-300">/</span>
            <Link href="/produits" className="text-gray-500 hover:text-gray-700">Produits</Link>
            <span className="text-gray-300">/</span>
            {product.categorySlug && (
              <>
                <Link href={`/categorie/${product.categorySlug}`} className="text-gray-500 hover:text-gray-700">
                  {product.category}
                </Link>
                <span className="text-gray-300">/</span>
              </>
            )}
            <span className="text-gray-900 font-medium truncate">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Main Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src={images[currentImage]}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {product.isNew && (
                  <span className="px-3 py-1 bg-accent-500 text-white text-sm font-semibold rounded-full">
                    Nouveau
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
            {images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden transition-all ${
                      currentImage === index
                        ? 'ring-2 ring-primary-500 ring-offset-2'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Vue ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Category */}
            <Link
              href={`/categorie/${product.categorySlug}`}
              className="inline-block px-3 py-1 bg-primary-50 text-primary-600 text-sm font-medium rounded-full hover:bg-primary-100 transition-colors"
            >
              {product.category}
            </Link>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-4">
              {product.title}
            </h1>

            {/* Vendor */}
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                {product.vendor.name.charAt(0)}
              </div>
              <div>
                <Link
                  href={`/vendeur/${product.vendor.slug || product.vendor.id}`}
                  className="font-medium text-gray-900 hover:text-primary-600"
                >
                  {product.vendor.name}
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 mt-6 py-4 border-y border-gray-100">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-warning-500 fill-warning-500" />
                <span className="font-semibold text-gray-900">{product.rating}</span>
                <span className="text-gray-500">({product.reviewCount || 0} avis)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Download className="w-5 h-5" />
                <span>{product.sales} ventes</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="w-5 h-5" />
                <span>{product.views} vues</span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-gray-600 mt-6 text-lg leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Price */}
            <div className="mt-8">
              <div className="flex items-baseline gap-3">
                {product.salePrice ? (
                  <>
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(product.salePrice, currentCurrency)}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(product.price, currentCurrency)}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
                      Économisez {formatPrice(product.price - product.salePrice, currentCurrency)}
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(product.price, currentCurrency)}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
              <Button
                onClick={handleAddToCart}
                variant={inCart ? 'secondary' : 'primary'}
                size="lg"
                leftIcon={inCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                className="flex-1"
              >
                {inCart ? 'Ajouté au panier' : 'Ajouter au panier'}
              </Button>
              <Button
                onClick={handleBuyNow}
                variant="gradient"
                size="lg"
                className="flex-1"
              >
                Acheter maintenant
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-4 mt-4">
              <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
                <span>Favoris</span>
              </button>
              <button
                onClick={() => setIsShareOpen(true)}
                className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Partager</span>
              </button>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-4">Caractéristiques incluses</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-600">
                      <Check className="w-4 h-4 text-accent-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                <FileCode className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">Version</p>
                  <p className="font-medium text-gray-900">{product.version || '1.0.0'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                <Layers className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">Fichiers</p>
                  <p className="font-medium text-gray-900">{product.filesIncluded?.join(', ') || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                <RefreshCw className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">Mises à jour</p>
                  <p className="font-medium text-gray-900">À vie</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                <Shield className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">Support</p>
                  <p className="font-medium text-gray-900">6 mois</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-1 border-b border-gray-200">
            {(['description', 'reviews', 'support'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'description' && 'Description'}
                {tab === 'reviews' && `Avis (${product.reviewCount || 0})`}
                {tab === 'support' && 'Support'}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.map((review: any) => (
                  <div key={review.id} className="card p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                        {review.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{review.user?.name || 'Utilisateur'}</p>
                            <StarRating rating={review.rating} size="sm" />
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(review.createdAt || review.date)}
                          </span>
                        </div>
                        {review.title && (
                          <h4 className="font-semibold text-gray-900 mt-3">{review.title}</h4>
                        )}
                        <p className="text-gray-600 mt-2">{review.comment}</p>
                        <div className="flex items-center gap-4 mt-4">
                          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600">
                            <ThumbsUp className="w-4 h-4" />
                            Utile ({review.helpful || 0})
                          </button>
                          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600">
                            <MessageSquare className="w-4 h-4" />
                            Répondre
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'support' && (
              <div className="card p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Besoin d'aide ?</h3>
                <p className="text-gray-600 mb-6">
                  Notre équipe de support est disponible pour répondre à toutes vos questions.
                </p>
                <Button leftIcon={<MessageSquare className="w-4 h-4" />}>
                  Contacter le support
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Produits similaires</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={{
                    id: relatedProduct.id,
                    title: relatedProduct.title,
                    slug: relatedProduct.slug,
                    price: relatedProduct.price,
                    salePrice: relatedProduct.salePrice || undefined,
                    images: relatedProduct.images || [relatedProduct.image],
                    averageRating: relatedProduct.rating,
                    reviewCount: relatedProduct.reviewCount || 0,
                    downloads: relatedProduct.sales,
                    vendorName: relatedProduct.vendor.name,
                    vendorId: relatedProduct.vendor.id,
                    categoryName: relatedProduct.category,
                    isNew: relatedProduct.isNew,
                    isFeatured: relatedProduct.isFeatured,
                  }}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={typeof window !== 'undefined' ? `${window.location.origin}/produit/${product.slug}` : ''}
        title={product.title}
      />
    </div>
  )
}
