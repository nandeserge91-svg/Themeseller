'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X, Grid, List, ArrowUpDown } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'
import Button from '@/components/ui/Button'

// Tous les produits disponibles
const allProducts = [
  {
    id: '1',
    title: 'SaaSify - Template Admin Dashboard Premium',
    slug: 'saasify-admin-dashboard',
    price: 79,
    salePrice: 59,
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'],
    averageRating: 4.9,
    reviewCount: 245,
    downloads: 3420,
    vendorName: 'PixelCraft Studio',
    vendorId: '1',
    categoryName: 'WordPress',
    isNew: false,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Flavor - Restaurant & Food Delivery Theme',
    slug: 'flavor-restaurant-theme',
    price: 49,
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop'],
    averageRating: 4.7,
    reviewCount: 189,
    downloads: 2890,
    vendorName: 'ThemeWizards',
    vendorId: '2',
    categoryName: 'HTML',
    isNew: true,
    isFeatured: false,
  },
  {
    id: '3',
    title: 'ShopifyPro - Thème E-commerce Premium',
    slug: 'shopify-pro-ecommerce',
    price: 180,
    salePrice: 149,
    images: ['https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop'],
    averageRating: 4.8,
    reviewCount: 234,
    downloads: 1890,
    vendorName: 'ShopifyExperts',
    vendorId: '7',
    categoryName: 'Shopify',
    isNew: true,
    isFeatured: true,
  },
  {
    id: '4',
    title: 'SystemePro - Tunnel de Vente Complet',
    slug: 'systeme-pro-tunnel',
    price: 97,
    salePrice: 67,
    images: ['https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop'],
    averageRating: 4.9,
    reviewCount: 312,
    downloads: 2456,
    vendorName: 'FunnelMasters',
    vendorId: '8',
    categoryName: 'Systeme.io',
    isNew: true,
    isFeatured: true,
  },
  {
    id: '5',
    title: 'CryptoTrade - Trading Platform UI Kit Figma',
    slug: 'cryptotrade-trading-ui',
    price: 89,
    salePrice: 69,
    images: ['https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&h=400&fit=crop'],
    averageRating: 4.8,
    reviewCount: 156,
    downloads: 1560,
    vendorName: 'DesignMasters',
    vendorId: '3',
    categoryName: 'Figma',
    isNew: false,
    isFeatured: true,
  },
  {
    id: '6',
    title: 'FunnelPro - Complete Sales Funnel System',
    slug: 'funnelpro-sales-funnel',
    price: 149,
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'],
    averageRating: 4.9,
    reviewCount: 98,
    downloads: 890,
    vendorName: 'ConvertLab',
    vendorId: '4',
    categoryName: 'Funnels',
    isNew: true,
    isFeatured: true,
  },
  {
    id: '7',
    title: 'ShopMax - E-commerce WordPress Theme',
    slug: 'shopmax-ecommerce',
    price: 69,
    salePrice: 49,
    images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop'],
    averageRating: 4.8,
    reviewCount: 312,
    downloads: 4560,
    vendorName: 'PixelCraft Studio',
    vendorId: '1',
    categoryName: 'WordPress',
    isNew: true,
    isFeatured: false,
  },
  {
    id: '8',
    title: 'FashionStore - Thème Mode Shopify',
    slug: 'fashion-store-shopify',
    price: 159,
    images: ['https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop'],
    averageRating: 4.7,
    reviewCount: 156,
    downloads: 1234,
    vendorName: 'ShopifyExperts',
    vendorId: '7',
    categoryName: 'Shopify',
    isNew: false,
    isFeatured: false,
  },
  {
    id: '9',
    title: 'CoachingFunnel - Pack Systeme.io Coach',
    slug: 'coaching-funnel-systeme',
    price: 127,
    images: ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'],
    averageRating: 4.6,
    reviewCount: 89,
    downloads: 890,
    vendorName: 'FunnelMasters',
    vendorId: '8',
    categoryName: 'Systeme.io',
    isNew: true,
    isFeatured: false,
  },
  {
    id: '10',
    title: 'MailFlow - Email Templates Collection',
    slug: 'mailflow-email-templates',
    price: 29,
    images: ['https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=600&h=400&fit=crop'],
    averageRating: 4.5,
    reviewCount: 145,
    downloads: 2340,
    vendorName: 'EmailPro',
    vendorId: '6',
    categoryName: 'Email',
    isNew: true,
    isFeatured: false,
  },
  {
    id: '11',
    title: 'AppLanding - Mobile App Landing Page',
    slug: 'applanding-mobile-page',
    price: 35,
    salePrice: 25,
    images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop'],
    averageRating: 4.7,
    reviewCount: 234,
    downloads: 3200,
    vendorName: 'PixelCraft Studio',
    vendorId: '1',
    categoryName: 'Landing',
    isNew: false,
    isFeatured: true,
  },
  {
    id: '12',
    title: 'DashUI - Admin Dashboard Figma Kit',
    slug: 'dashui-admin-figma',
    price: 79,
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'],
    averageRating: 4.9,
    reviewCount: 167,
    downloads: 1450,
    vendorName: 'DesignMasters',
    vendorId: '3',
    categoryName: 'Figma',
    isNew: false,
    isFeatured: false,
  },
]

const categories = [
  { name: 'Tous', slug: 'all' },
  { name: 'WordPress', slug: 'wordpress' },
  { name: 'Shopify', slug: 'shopify' },
  { name: 'Systeme.io', slug: 'systeme-io' },
  { name: 'HTML', slug: 'html' },
  { name: 'Figma', slug: 'figma' },
  { name: 'Funnels', slug: 'funnels' },
  { name: 'Email', slug: 'email' },
]

const sortOptions = [
  { name: 'Pertinence', value: 'relevance' },
  { name: 'Plus récents', value: 'newest' },
  { name: 'Prix croissant', value: 'price-asc' },
  { name: 'Prix décroissant', value: 'price-desc' },
  { name: 'Meilleures notes', value: 'rating' },
]

function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [inputValue, setInputValue] = useState(initialQuery)
  const [results, setResults] = useState<typeof allProducts>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')
  const [isLoading, setIsLoading] = useState(false)

  // Recherche et filtrage
  useEffect(() => {
    setIsLoading(true)
    
    const timer = setTimeout(() => {
      let filtered = [...allProducts]

      // Filtrer par recherche
      if (searchQuery) {
        const searchTerms = searchQuery.toLowerCase().split(' ')
        filtered = filtered.filter(product => {
          const searchText = `${product.title} ${product.categoryName} ${product.vendorName}`.toLowerCase()
          return searchTerms.every(term => searchText.includes(term))
        })
      }

      // Filtrer par catégorie
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(product => 
          product.categoryName.toLowerCase().replace('.', '-') === selectedCategory ||
          product.categoryName.toLowerCase() === selectedCategory
        )
      }

      // Trier
      switch (sortBy) {
        case 'newest':
          filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
          break
        case 'price-asc':
          filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
          break
        case 'price-desc':
          filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
          break
        case 'rating':
          filtered.sort((a, b) => b.averageRating - a.averageRating)
          break
        default:
          // Pertinence - featured en premier
          filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
      }

      setResults(filtered)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, selectedCategory, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(inputValue)
    // Mettre à jour l'URL
    const params = new URLSearchParams()
    if (inputValue) params.set('q', inputValue)
    router.push(`/recherche?${params.toString()}`)
  }

  const handleClearSearch = () => {
    setInputValue('')
    setSearchQuery('')
    router.push('/recherche')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white text-center mb-6"
          >
            {searchQuery ? `Résultats pour "${searchQuery}"` : 'Rechercher des templates'}
          </motion.h1>
          
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Rechercher des templates, thèmes, funnels..."
              className="w-full pl-14 pr-14 py-4 rounded-xl bg-white shadow-lg focus:ring-4 focus:ring-white/30 text-lg"
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Categories */}
          <div className="flex-1 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {isLoading ? 'Recherche en cours...' : `${results.length} produit${results.length > 1 ? 's' : ''} trouvé${results.length > 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : results.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {results.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Aucun résultat trouvé
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Nous n'avons pas trouvé de produits correspondant à votre recherche. 
              Essayez avec d'autres termes ou explorez nos catégories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleClearSearch}>
                Effacer la recherche
              </Button>
              <Button variant="secondary" onClick={() => router.push('/produits')}>
                Voir tous les produits
              </Button>
            </div>
          </motion.div>
        )}

        {/* Suggestions */}
        {!searchQuery && results.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Suggestions populaires</h2>
            <div className="flex flex-wrap gap-3">
              {['WordPress theme', 'Shopify store', 'Systeme.io funnel', 'Dashboard admin', 'Landing page', 'E-commerce template'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setInputValue(term)
                    setSearchQuery(term)
                  }}
                  className="px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-full text-sm font-medium transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}
