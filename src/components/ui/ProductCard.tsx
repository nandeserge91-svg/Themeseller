'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Star, Download, ShoppingCart, Check, Heart, Zap, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatPrice } from '@/lib/utils'
import { useCartStore, CartProduct } from '@/store/cartStore'
import { useCurrencyStore } from '@/store/currencyStore'

interface ProductCardProps {
  product: {
    id: string
    title: string
    slug: string
    price: number
    salePrice?: number | null
    images: string[]
    averageRating: number
    reviewCount: number
    downloads: number
    vendorName: string
    vendorId: string
    categoryName?: string
    isNew?: boolean
    isFeatured?: boolean
  }
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { addItem, removeItem, isInCart, clearCart } = useCartStore()
  const { currency } = useCurrencyStore()
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const inCart = mounted ? isInCart(product.id) : false
  const currentCurrency = mounted ? currency : 'EUR'

  const cartProduct: CartProduct = {
    id: product.id,
    title: product.title,
    slug: product.slug,
    price: product.price,
    salePrice: product.salePrice ?? undefined,
    image: product.images[0],
    vendorName: product.vendorName,
    vendorId: product.vendorId,
  }

  const handleCartAction = () => {
    if (inCart) {
      removeItem(product.id)
    } else {
      addItem(cartProduct)
    }
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    clearCart()
    addItem(cartProduct)
    router.push('/checkout')
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const shareUrl = `${window.location.origin}/produit/${product.slug}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Découvrez ${product.title} sur ThemePro`,
          url: shareUrl,
        })
      } catch (err) {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl)
        toast.success('Lien copié !')
      } catch (err) {
        toast.error('Erreur lors de la copie')
      }
    }
  }

  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <div className="card-product">
        {/* Image Container */}
        <Link href={`/produit/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover product-image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay */}
          <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <span className="absolute top-3 left-3 flex flex-wrap gap-2">
            {product.isNew && (
              <span className="px-3 py-1 bg-accent-500 text-white text-xs font-semibold rounded-full">
                Nouveau
              </span>
            )}
            {product.isFeatured && (
              <span className="px-3 py-1 bg-warning-500 text-white text-xs font-semibold rounded-full">
                Populaire
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                -{discountPercentage}%
              </span>
            )}
          </span>
        </Link>

        {/* Quick Actions - Outside Link */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full 
                     flex items-center justify-center opacity-0 group-hover:opacity-100 
                     transform translate-y-2 group-hover:translate-y-0 transition-all duration-300
                     hover:bg-red-50 hover:text-red-500"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full 
                     flex items-center justify-center opacity-0 group-hover:opacity-100 
                     transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75
                     hover:bg-primary-50 hover:text-primary-600"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Actions - Outside Link */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 
                      transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
             style={{ top: 'auto' }}>
          <button
            onClick={handleCartAction}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
              inCart
                ? 'bg-accent-500 text-white hover:bg-accent-600'
                : 'bg-white text-gray-900 hover:bg-gray-100'
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-4 h-4" />
                Ajouté
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Panier
              </>
            )}
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 
                     bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Acheter
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category */}
          {product.categoryName && (
            <span className="text-xs font-medium text-primary-600 uppercase tracking-wider">
              {product.categoryName}
            </span>
          )}

          {/* Title */}
          <Link href={`/produit/${product.slug}`}>
            <h3 className="font-semibold text-gray-900 mt-1 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Vendor */}
          <p className="text-sm text-gray-500 mb-3">
            par <span className="text-gray-700 font-medium">{product.vendorName}</span>
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
              <span className="font-medium text-gray-700">{product.averageRating}</span>
              <span>({product.reviewCount})</span>
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              <span>{product.downloads}</span>
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.salePrice ? (
                <>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(product.salePrice, currentCurrency)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.price, currentCurrency)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(product.price, currentCurrency)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
