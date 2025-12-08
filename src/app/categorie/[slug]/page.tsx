'use client'

import { useState, useMemo } from 'react'
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

// Données de démonstration par catégorie
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
}

const allProducts = [
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
    categorySlug: 'wordpress',
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
    categorySlug: 'html',
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
    categorySlug: 'figma',
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
    categorySlug: 'funnels',
    isNew: true,
    isFeatured: true,
  },
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
    categorySlug: 'html',
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
    categorySlug: 'wordpress',
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
    categorySlug: 'email',
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
    categorySlug: 'funnels',
    isNew: true,
    isFeatured: false,
  },
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
    categorySlug: 'wordpress',
    isNew: false,
    isFeatured: false,
  },
  {
    id: '10',
    title: 'HealthCare - Medical Clinic Theme',
    slug: 'healthcare-medical-theme',
    price: 55,
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop'],
    averageRating: 4.4,
    reviewCount: 92,
    downloads: 890,
    vendorName: 'MinimalStudio',
    vendorId: 'v5',
    categorySlug: 'html',
    isNew: false,
    isFeatured: false,
  },
  {
    id: '11',
    title: 'AppLanding - Mobile App Landing Page',
    slug: 'applanding-mobile-page',
    price: 35,
    salePrice: 25,
    images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop'],
    averageRating: 4.7,
    reviewCount: 234,
    downloads: 3200,
    vendorName: 'PixelCraft Studio',
    vendorId: 'v1',
    categorySlug: 'landing',
    isNew: false,
    isFeatured: true,
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
    categorySlug: 'figma',
    isNew: false,
    isFeatured: false,
  },
]

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







