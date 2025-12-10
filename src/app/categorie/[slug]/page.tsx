'use client'

import { useState, useMemo, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Search, 
  SlidersHorizontal, 
  ChevronDown,
  Grid3X3,
  List,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import ProductCard from '@/components/ui/ProductCard'
import Button from '@/components/ui/Button'
import { useProductsStore } from '@/store/productsStore'

// Données des catégories
const categoriesData: Record<string, { name: string; description: string; icon: string }> = {
  wordpress: {
    name: 'WordPress',
    description: 'Thèmes et plugins WordPress premium pour créer des sites professionnels',
    icon: '🎨',
  },
  html: {
    name: 'HTML / CSS',
    description: 'Templates HTML5 et CSS3 responsive pour tous types de projets',
    icon: '🌐',
  },
  figma: {
    name: 'Figma',
    description: 'UI Kits, designs et ressources Figma pour vos projets de design',
    icon: '✨',
  },
  funnels: {
    name: 'Tunnels de Vente',
    description: 'Funnels et pages de vente optimisées pour convertir vos visiteurs',
    icon: '🚀',
  },
  email: {
    name: 'Email Templates',
    description: 'Templates email responsive compatibles avec tous les clients mail',
    icon: '📧',
  },
  landing: {
    name: 'Landing Pages',
    description: 'Pages d\'atterrissage haute conversion pour vos campagnes',
    icon: '📄',
  },
  shopify: {
    name: 'Shopify',
    description: 'Thèmes Shopify premium pour votre boutique e-commerce',
    icon: '🛒',
  },
  'systeme-io': {
    name: 'Systeme.io',
    description: 'Tunnels et templates pour Systeme.io',
    icon: '⚡',
  },
}

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

const sortOptions = [
  { name: 'Plus populaires', value: 'popular' },
  { name: 'Plus récents', value: 'newest' },
  { name: 'Meilleures notes', value: 'rating' },
  { name: 'Prix croissant', value: 'price-asc' },
  { name: 'Prix décroissant', value: 'price-desc' },
]

export default function CategoriePage() {
  const params = useParams()
  const slug = params.slug as string
  
  const category = categoriesData[slug]
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSort, setSelectedSort] = useState('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isHydrated, setIsHydrated] = useState(false)

  // Récupérer les produits depuis le store
  const { products: storeProducts, isLoading, fetchProducts } = useProductsStore()
  
  // Charger les produits depuis l'API
  useEffect(() => {
    setIsHydrated(true)
    fetchProducts({ status: 'active', category: slug }) // Charger les produits de cette catégorie
  }, [fetchProducts, slug])

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
        reviewCount: Math.floor(p.rating * 30),
        downloads: p.sales,
        vendorName: p.vendor.name,
        vendorId: p.vendor.id,
        categorySlug: categorySlugMap[p.category] || p.category.toLowerCase().replace(/\s+/g, '-').replace('.', ''),
        isNew: new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        isFeatured: p.rating >= 4.5,
      }))
  }, [storeProducts])

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter((p) => p.categorySlug === slug)

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.vendorName.toLowerCase().includes(query)
      )
    }

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
  }, [slug, searchQuery, selectedSort])

  // Afficher un loader pendant le chargement
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Catégorie non trouvée</h1>
          <Link href="/produits">
            <Button>Voir tous les produits</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/produits" 
            className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Toutes les catégories
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-5xl">{category.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                {category.name}
              </h1>
              <p className="text-white/80 mt-1">
                {category.description}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Rechercher dans ${category.name}...`}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white shadow-lg focus:ring-4 focus:ring-white/30 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredProducts.length}</span> produits trouvés
          </p>

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

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={{
                  ...product,
                  categoryName: category.name,
                }} 
                index={index} 
              />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier votre recherche
            </p>
            <Button variant="secondary" onClick={() => setSearchQuery('')}>
              Réinitialiser la recherche
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
  )
}







