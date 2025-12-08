'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Grid, List } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'
import Button from '@/components/ui/Button'

const favorites = [
  {
    id: '1',
    title: 'ProBusiness - Template WordPress Premium',
    slug: 'probusiness-template-wordpress',
    price: 59,
    salePrice: 49,
    images: ['https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop'],
    averageRating: 4.8,
    reviewCount: 124,
    downloads: 1520,
    vendorName: 'WebStudio Pro',
    vendorId: '1',
    categoryName: 'WordPress',
    isNew: true,
  },
  {
    id: '2',
    title: 'SaaS Landing Page - HTML5 Template',
    slug: 'saas-landing-page-html5',
    price: 39,
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'],
    averageRating: 4.6,
    reviewCount: 89,
    downloads: 856,
    vendorName: 'DesignHub',
    vendorId: '2',
    categoryName: 'HTML',
  },
  {
    id: '3',
    title: 'UI Kit Dashboard Figma',
    slug: 'ui-kit-dashboard-figma',
    price: 79,
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop'],
    averageRating: 4.7,
    reviewCount: 156,
    downloads: 2103,
    vendorName: 'Figma Design Co',
    vendorId: '4',
    categoryName: 'Figma',
  },
]

export default function FavorisPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes favoris</h1>
              <p className="text-gray-600 mt-1">{favorites.length} produits sauvegardés</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <Link href="/mon-compte">
                <Button variant="secondary">Retour</Button>
              </Link>
            </div>
          </div>

          {favorites.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {favorites.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Heart className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Aucun favori pour l'instant
              </h2>
              <p className="text-gray-600 mb-6">
                Ajoutez des produits à vos favoris pour les retrouver facilement.
              </p>
              <Link href="/produits">
                <Button>Explorer les produits</Button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}







