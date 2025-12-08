'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Star, ArrowRight, TrendingUp } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCurrencyStore } from '@/store/currencyStore'

// Données de démonstration pour la recherche
const allProducts = [
  {
    id: '1',
    title: 'SaaSify - Template Admin Dashboard Premium',
    slug: 'saasify-admin-dashboard',
    price: 79,
    salePrice: 59,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=150&fit=crop',
    category: 'WordPress',
    rating: 4.9,
  },
  {
    id: '2',
    title: 'ShopifyPro - Thème E-commerce Premium',
    slug: 'shopify-pro-ecommerce',
    price: 180,
    salePrice: 149,
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=150&fit=crop',
    category: 'Shopify',
    rating: 4.8,
  },
  {
    id: '3',
    title: 'SystemePro - Tunnel de Vente Complet',
    slug: 'systeme-pro-tunnel',
    price: 97,
    salePrice: 67,
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=200&h=150&fit=crop',
    category: 'Systeme.io',
    rating: 4.9,
  },
  {
    id: '4',
    title: 'FunnelPro - Complete Sales Funnel System',
    slug: 'funnelpro-sales-funnel',
    price: 149,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop',
    category: 'Funnels',
    rating: 4.9,
  },
  {
    id: '5',
    title: 'ShopMax - E-commerce WordPress Theme',
    slug: 'shopmax-ecommerce',
    price: 69,
    salePrice: 49,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=150&fit=crop',
    category: 'WordPress',
    rating: 4.8,
  },
  {
    id: '6',
    title: 'CryptoTrade - Trading Platform UI Kit Figma',
    slug: 'cryptotrade-trading-ui',
    price: 89,
    salePrice: 69,
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=200&h=150&fit=crop',
    category: 'Figma',
    rating: 4.8,
  },
  {
    id: '7',
    title: 'AppLanding - Mobile App Landing Page',
    slug: 'applanding-mobile-page',
    price: 35,
    salePrice: 25,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=150&fit=crop',
    category: 'Landing',
    rating: 4.7,
  },
  {
    id: '8',
    title: 'FashionStore - Thème Mode Shopify',
    slug: 'fashion-store-shopify',
    price: 159,
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200&h=150&fit=crop',
    category: 'Shopify',
    rating: 4.7,
  },
]

const popularSearches = ['WordPress', 'Landing Page', 'Dashboard', 'E-commerce', 'Shopify', 'Systeme.io']

export default function HeroSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<typeof allProducts>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { currency } = useCurrencyStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fermer quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Recherche en temps réel
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    const timer = setTimeout(() => {
      const searchTerms = query.toLowerCase().split(' ')
      const filtered = allProducts.filter(product => {
        const searchText = `${product.title} ${product.category}`.toLowerCase()
        return searchTerms.every(term => searchText.includes(term))
      })
      setResults(filtered.slice(0, 5))
      setIsLoading(false)
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsOpen(false)
      router.push(`/recherche?q=${encodeURIComponent(query)}`)
    }
  }

  const handleProductClick = (slug: string) => {
    setIsOpen(false)
    router.push(`/produit/${slug}`)
  }

  const handlePopularClick = (term: string) => {
    setQuery(term)
    setIsOpen(true)
    inputRef.current?.focus()
  }

  const currentCurrency = mounted ? currency : 'EUR'

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Rechercher des thèmes, templates, funnels..."
          className="w-full pl-14 pr-36 py-5 rounded-2xl border-2 border-gray-100 bg-white 
                   shadow-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 
                   transition-all text-lg"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary"
        >
          Rechercher
        </button>
      </form>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && (query.length >= 2 || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {/* Loading */}
            {isLoading && (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            )}

            {/* Results */}
            {!isLoading && results.length > 0 && (
              <div className="p-3">
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Résultats ({results.length})
                </p>
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.slug)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left group"
                  >
                    <div className="relative w-14 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate group-hover:text-primary-600">
                        {product.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{product.category}</span>
                        <span className="flex items-center gap-0.5 text-warning-500">
                          <Star className="w-3 h-3 fill-current" />
                          {product.rating}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {product.salePrice ? (
                        <span className="font-bold text-gray-900 text-sm">
                          {formatPrice(product.salePrice, currentCurrency)}
                        </span>
                      ) : (
                        <span className="font-bold text-gray-900 text-sm">
                          {formatPrice(product.price, currentCurrency)}
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-600 transition-colors flex-shrink-0" />
                  </button>
                ))}
                
                {/* Voir tous les résultats */}
                <button
                  onClick={handleSubmit}
                  className="w-full mt-2 py-3 text-center text-primary-600 hover:bg-primary-50 rounded-xl font-medium text-sm transition-colors"
                >
                  Voir tous les résultats pour "{query}"
                </button>
              </div>
            )}

            {/* No Results */}
            {!isLoading && query.length >= 2 && results.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-gray-500 text-sm">Aucun résultat pour "{query}"</p>
                <button
                  onClick={handleSubmit}
                  className="mt-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Rechercher quand même →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popular Searches */}
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        <span className="text-sm text-gray-500 flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          Populaires :
        </span>
        {popularSearches.map((tag) => (
          <button
            key={tag}
            onClick={() => handlePopularClick(tag)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}







