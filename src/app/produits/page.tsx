'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronDown,
  Grid3X3,
  List,
  Star
} from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'
import Button from '@/components/ui/Button'
import { useProductsStore } from '@/store/productsStore'

// Mapping des catégories pour le slug
const categorySlugMap: Record<string, string> = {
  'WordPress': 'wordpress',
  'HTML': 'html',
  'Figma': 'figma',
  'Funnels': 'funnels',
  'Email': 'email',
  'Landing': 'landing',
  'Shopify': 'shopify',
  'Systeme.io': 'systeme-io',
}

// Les catégories seront calculées dynamiquement

const sortOptions = [
  { name: 'Plus récents', value: 'newest' },
  { name: 'Plus populaires', value: 'popular' },
  { name: 'Meilleures notes', value: 'rating' },
  { name: 'Prix croissant', value: 'price-asc' },
  { name: 'Prix décroissant', value: 'price-desc' },
]

const priceRanges = [
  { name: 'Tous les prix', min: 0, max: Infinity },
  { name: 'Moins de 30€', min: 0, max: 30 },
  { name: '30€ - 50€', min: 30, max: 50 },
  { name: '50€ - 100€', min: 50, max: 100 },
  { name: 'Plus de 100€', min: 100, max: Infinity },
]

export default function ProduitsPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || 'all'

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedSort, setSelectedSort] = useState('popular')
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [minRating, setMinRating] = useState(0)
  const [isHydrated, setIsHydrated] = useState(false)

  // Récupérer les produits depuis le store (seulement les actifs/approuvés)
  const { products: storeProducts } = useProductsStore()
  
  // Hydratation côté client
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Transformer les produits du store pour l'affichage
  const allProducts = useMemo(() => {
    return storeProducts
      .filter(p => p.status === 'active') // Seulement les produits approuvés
      .map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        price: p.price,
        salePrice: p.salePrice,
        images: [p.image],
        averageRating: p.rating,
        reviewCount: Math.floor(p.rating * 30), // Estimation
        downloads: p.sales,
        vendorName: p.vendor.name,
        vendorId: p.vendor.id,
        categoryName: p.category,
        categorySlug: categorySlugMap[p.category] || p.category.toLowerCase().replace(/\s+/g, '-'),
        isNew: new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Nouveau si < 30 jours
        isFeatured: p.rating >= 4.5,
      }))
  }, [storeProducts])

  // Calculer les catégories dynamiquement
  const categories = useMemo(() => {
    const categoryCounts: Record<string, number> = {}
    allProducts.forEach(p => {
      const slug = p.categorySlug
      categoryCounts[slug] = (categoryCounts[slug] || 0) + 1
    })
    
    return [
      { name: 'Tous', slug: 'all', count: allProducts.length },
      ...Object.entries(categoryCounts).map(([slug, count]) => {
        const categoryName = Object.entries(categorySlugMap).find(([, s]) => s === slug)?.[0] || slug
        return { name: categoryName, slug, count }
      })
    ]
  }, [allProducts])

  const filteredProducts = useMemo(() => {
    let result = [...allProducts]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.categoryName.toLowerCase().includes(query) ||
          p.vendorName.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.categorySlug === selectedCategory)
    }

    // Price range filter
    result = result.filter((p) => {
      const price = p.salePrice || p.price
      return price >= selectedPriceRange.min && price <= selectedPriceRange.max
    })

    // Rating filter
    if (minRating > 0) {
      result = result.filter((p) => p.averageRating >= minRating)
    }

    // Sort
    switch (selectedSort) {
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'popular':
        result.sort((a, b) => b.downloads - a.downloads)
        break
      case 'rating':
        result.sort((a, b) => b.averageRating - a.averageRating)
        break
      case 'price-asc':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
        break
      case 'price-desc':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
        break
    }

    return result
  }, [searchQuery, selectedCategory, selectedSort, selectedPriceRange, minRating])

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedPriceRange !== priceRanges[0],
    minRating > 0,
  ].filter(Boolean).length

  // Afficher un loader pendant l'hydratation
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Tous les Templates
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            Découvrez notre collection de plus de 50 000 templates premium pour tous vos projets
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des templates..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white shadow-lg focus:ring-4 focus:ring-white/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Catégories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedCategory === cat.slug
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-sm text-gray-400">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Prix</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.name}
                      onClick={() => setSelectedPriceRange(range)}
                      className={`w-full px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedPriceRange === range
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {range.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Note minimum</h3>
                <div className="space-y-2">
                  {[0, 3, 3.5, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                        minRating === rating
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {rating === 0 ? (
                        'Toutes les notes'
                      ) : (
                        <>
                          <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                          {rating}+
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                {/* Mobile Filters Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtres
                  {activeFiltersCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">{filteredProducts.length}</span> résultats
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 border border-gray-200 rounded-xl bg-white cursor-pointer focus:ring-2 focus:ring-primary-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* View Mode */}
                <div className="hidden sm:flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400'}`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:hidden overflow-hidden mb-6"
                >
                  <div className="card p-6 space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Catégories</h3>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat.slug}
                            onClick={() => setSelectedCategory(cat.slug)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                              selectedCategory === cat.slug
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Prix</h3>
                      <div className="flex flex-wrap gap-2">
                        {priceRanges.map((range) => (
                          <button
                            key={range.name}
                            onClick={() => setSelectedPriceRange(range)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                              selectedPriceRange === range
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {range.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  Essayez de modifier vos filtres ou votre recherche
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setSelectedPriceRange(priceRanges[0])
                    setMinRating(0)
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}

            {/* Load More */}
            {filteredProducts.length > 0 && (
              <div className="mt-12 text-center">
                <Button variant="secondary" size="lg">
                  Charger plus de templates
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

