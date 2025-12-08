'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Download, 
  Star, 
  Clock, 
  Search,
  ChevronDown,
  ExternalLink,
  Package
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'
import { useCurrencyStore } from '@/store/currencyStore'

// Données de démonstration
const purchases = [
  {
    id: '1',
    orderNumber: 'TP-ABC123',
    product: {
      id: 'p1',
      title: 'SaaSify - Template Admin Dashboard Premium',
      slug: 'saasify-admin-dashboard',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      vendor: 'PixelCraft Studio',
    },
    price: 59,
    date: '2024-01-15',
    status: 'COMPLETED',
    downloadCount: 2,
    maxDownloads: 5,
    hasReview: false,
  },
  {
    id: '2',
    orderNumber: 'TP-DEF456',
    product: {
      id: 'p2',
      title: 'ShopMax - E-commerce WordPress Theme',
      slug: 'shopmax-ecommerce',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      vendor: 'PixelCraft Studio',
    },
    price: 49,
    date: '2024-01-10',
    status: 'COMPLETED',
    downloadCount: 3,
    maxDownloads: 5,
    hasReview: true,
  },
  {
    id: '3',
    orderNumber: 'TP-GHI789',
    product: {
      id: 'p3',
      title: 'CryptoTrade - Trading Platform UI Kit Figma',
      slug: 'cryptotrade-trading-ui',
      image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=600&fit=crop',
      vendor: 'DesignMasters',
    },
    price: 69,
    date: '2023-12-20',
    status: 'COMPLETED',
    downloadCount: 1,
    maxDownloads: 5,
    hasReview: false,
  },
]

const sortOptions = [
  { name: 'Plus récents', value: 'newest' },
  { name: 'Plus anciens', value: 'oldest' },
  { name: 'Prix croissant', value: 'price-asc' },
  { name: 'Prix décroissant', value: 'price-desc' },
]

export default function AchatsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const { currency } = useCurrencyStore()

  const filteredPurchases = purchases.filter((p) =>
    p.product.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link href="/mon-compte" className="text-gray-500 hover:text-primary-600">
              Mon compte
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Mes achats</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Mes achats</h1>
          <p className="text-gray-600 mt-1">
            {purchases.length} produit{purchases.length > 1 ? 's' : ''} acheté{purchases.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-4 py-3 pr-10 border border-gray-200 rounded-xl bg-white cursor-pointer focus:ring-2 focus:ring-primary-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Purchases List */}
        <div className="space-y-4">
          {filteredPurchases.map((purchase, index) => (
            <motion.div
              key={purchase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <Link href={`/produit/${purchase.product.slug}`} className="flex-shrink-0">
                  <div className="relative w-full md:w-40 h-32 rounded-xl overflow-hidden">
                    <Image
                      src={purchase.product.image}
                      alt={purchase.product.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <Link href={`/produit/${purchase.product.slug}`}>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                          {purchase.product.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        par {purchase.product.vendor}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(purchase.date)}
                        </span>
                        <span>Commande {purchase.orderNumber}</span>
                        <span className="px-2 py-0.5 bg-accent-100 text-accent-700 rounded-full text-xs font-medium">
                          {purchase.status === 'COMPLETED' ? 'Complété' : 'En cours'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(purchase.price, currency)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t">
                    <Button
                      size="sm"
                      leftIcon={<Download className="w-4 h-4" />}
                    >
                      Télécharger ({purchase.maxDownloads - purchase.downloadCount} restants)
                    </Button>
                    
                    {!purchase.hasReview && (
                      <Link href={`/produit/${purchase.product.slug}#reviews`}>
                        <Button
                          size="sm"
                          variant="secondary"
                          leftIcon={<Star className="w-4 h-4" />}
                        >
                          Laisser un avis
                        </Button>
                      </Link>
                    )}
                    
                    <Link href={`/produit/${purchase.product.slug}`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        leftIcon={<ExternalLink className="w-4 h-4" />}
                      >
                        Voir le produit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredPurchases.length === 0 && (
            <div className="card p-12 text-center">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucun achat trouvé
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? 'Aucun produit ne correspond à votre recherche'
                  : "Vous n'avez pas encore effectué d'achat"}
              </p>
              <Link href="/produits">
                <Button>Explorer les produits</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}






