'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, TrendingUp, Clock, ArrowRight, Star } from 'lucide-react'
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
    title: 'Flavor - Restaurant & Food Delivery Theme',
    slug: 'flavor-restaurant-theme',
    price: 49,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=150&fit=crop',
    category: 'HTML',
    rating: 4.7,
  },
  {
    id: '3',
    title: 'ShopifyPro - Thème E-commerce Premium',
    slug: 'shopify-pro-ecommerce',
    price: 180,
    salePrice: 149,
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=150&fit=crop',
    category: 'Shopify',
    rating: 4.8,
  },
  {
    id: '4',
    title: 'SystemePro - Tunnel de Vente Complet',
    slug: 'systeme-pro-tunnel',
    price: 97,
    salePrice: 67,
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=200&h=150&fit=crop',
    category: 'Systeme.io',
    rating: 4.9,
  },
  {
    id: '5',
    title: 'CryptoTrade - Trading Platform UI Kit Figma',
    slug: 'cryptotrade-trading-ui',
    price: 89,
    salePrice: 69,
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=200&h=150&fit=crop',
    category: 'Figma',
    rating: 4.8,
  },
  {
    id: '6',
    title: 'FunnelPro - Complete Sales Funnel System',
    slug: 'funnelpro-sales-funnel',
    price: 149,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop',
    category: 'Funnels',
    rating: 4.9,
  },
  {
    id: '7',
    title: 'ShopMax - E-commerce WordPress Theme',
    slug: 'shopmax-ecommerce',
    price: 69,
    salePrice: 49,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=150&fit=crop',
    category: 'WordPress',
    rating: 4.8,
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
  {
    id: '9',
    title: 'CoachingFunnel - Pack Systeme.io Coach',
    slug: 'coaching-funnel-systeme',
    price: 127,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=150&fit=crop',
    category: 'Systeme.io',
    rating: 4.6,
  },
  {
    id: '10',
    title: 'MailFlow - Email Templates Collection',
    slug: 'mailflow-email-templates',
    price: 29,
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=200&h=150&fit=crop',
    category: 'Email',
    rating: 4.5,
  },
]

const popularSearches = [
  'WordPress theme',
  'Shopify store',
  'Systeme.io funnel',
  'Dashboard admin',
  'Landing page',
  'E-commerce',
]

const recentSearches = ['template react', 'shopify fashion']

interface SearchBarProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<typeof allProducts>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { currency } = useCurrencyStore()

  // Focus sur l'input quand la barre s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Recherche en temps réel avec debounce
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setShowResults(false)
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
      setShowResults(true)
      setIsLoading(false)
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onClose()
      router.push(`/recherche?q=${encodeURIComponent(query)}`)
    }
  }

  const handleProductClick = (slug: string) => {
    onClose()
    router.push(`/produit/${slug}`)
  }

  const handlePopularSearch = (term: string) => {
    setQuery(term)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 p-4 pt-20 md:pt-24"
          >
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher des templates, thèmes, funnels..."
                    className="w-full pl-14 pr-14 py-5 text-lg border-b border-gray-100 focus:outline-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="absolute right-14 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-xl text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </form>

                {/* Results Container */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {/* Loading State */}
                  {isLoading && (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    </div>
                  )}

                  {/* Search Results */}
                  {!isLoading && showResults && results.length > 0 && (
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                        Résultats ({results.length})
                      </h3>
                      <div className="space-y-1">
                        {results.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product.slug)}
                            className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left group"
                          >
                            <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate group-hover:text-primary-600">
                                {product.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500">{product.category}</span>
                                <span className="flex items-center gap-1 text-warning-500">
                                  <Star className="w-3 h-3 fill-current" />
                                  {product.rating}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              {product.salePrice ? (
                                <>
                                  <span className="font-bold text-gray-900">
                                    {formatPrice(product.salePrice, currency)}
                                  </span>
                                  <span className="block text-xs text-gray-400 line-through">
                                    {formatPrice(product.price, currency)}
                                  </span>
                                </>
                              ) : (
                                <span className="font-bold text-gray-900">
                                  {formatPrice(product.price, currency)}
                                </span>
                              )}
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                      
                      {/* View All Results */}
                      <button
                        onClick={handleSearch}
                        className="w-full mt-3 py-3 text-center text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-colors"
                      >
                        Voir tous les résultats pour "{query}"
                      </button>
                    </div>
                  )}

                  {/* No Results */}
                  {!isLoading && showResults && results.length === 0 && query.length >= 2 && (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">Aucun résultat</h3>
                      <p className="text-gray-500 text-sm">
                        Essayez avec d'autres termes de recherche
                      </p>
                    </div>
                  )}

                  {/* Default State - Popular & Recent Searches */}
                  {!showResults && !isLoading && (
                    <div className="p-4">
                      {/* Recent Searches */}
                      {recentSearches.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Recherches récentes
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {recentSearches.map((term) => (
                              <button
                                key={term}
                                onClick={() => handlePopularSearch(term)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                              >
                                {term}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Popular Searches */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Recherches populaires
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {popularSearches.map((term) => (
                            <button
                              key={term}
                              onClick={() => handlePopularSearch(term)}
                              className="px-4 py-2 bg-primary-50 hover:bg-primary-100 rounded-full text-sm text-primary-700 transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quick Categories */}
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                          Catégories populaires
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {[
                            { name: 'WordPress', slug: 'wordpress', icon: '🎨' },
                            { name: 'Shopify', slug: 'shopify', icon: '🛒' },
                            { name: 'Systeme.io', slug: 'systeme-io', icon: '⚡' },
                            { name: 'Figma', slug: 'figma', icon: '✨' },
                          ].map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/categorie/${cat.slug}`}
                              onClick={onClose}
                              className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                              <span className="text-xl">{cat.icon}</span>
                              <span className="font-medium text-gray-700 text-sm">{cat.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                  <span>
                    <kbd className="px-2 py-1 bg-white rounded border border-gray-200 text-xs">↵</kbd> pour rechercher
                  </span>
                  <span>
                    <kbd className="px-2 py-1 bg-white rounded border border-gray-200 text-xs">Esc</kbd> pour fermer
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}







