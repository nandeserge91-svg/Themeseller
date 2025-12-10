'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Star, Package, TrendingUp, CheckCircle, Loader2, Users } from 'lucide-react'
import Button from '@/components/ui/Button'

interface Vendor {
  id: string
  name: string
  slug: string
  avatar: string
  banner: string
  bio: string
  rating: number
  reviewCount: number
  totalSales: number
  productCount: number
  isVerified: boolean
  featured: boolean
  createdAt: string
}

export default function VendeursPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'verified' | 'featured'>('all')

  // Charger les vendeurs depuis l'API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch('/api/vendors')
        if (response.ok) {
          const data = await response.json()
          setVendors(data.vendors || [])
        }
      } catch (error) {
        console.error('Erreur chargement vendeurs:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchVendors()
  }, [])

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.bio.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (filter === 'verified') return matchesSearch && vendor.isVerified
    if (filter === 'featured') return matchesSearch && vendor.featured
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Nos Vendeurs
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Découvrez les créateurs talentueux qui proposent leurs templates sur Themeseller
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un vendeur..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white shadow-lg focus:ring-4 focus:ring-white/30"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-gray-600">Chargement des vendeurs...</p>
            </div>
          </div>
        ) : (
          <>
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredVendors.length}</span> vendeur{filteredVendors.length > 1 ? 's' : ''}
          </p>
          
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Tous' },
              { value: 'featured', label: 'En vedette' },
              { value: 'verified', label: 'Vérifiés' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as typeof filter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filter === option.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/vendeur/${vendor.slug}`} className="card overflow-hidden group hover:shadow-xl transition-shadow block">
                {/* Banner */}
                <span className="relative h-32 overflow-hidden block">
                  <Image
                    src={vendor.banner}
                    alt={vendor.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {vendor.featured && (
                    <span className="absolute top-3 right-3 px-2 py-1 bg-warning-500 text-white text-xs font-semibold rounded-full">
                      ⭐ En vedette
                    </span>
                  )}
                </span>

                {/* Avatar */}
                <span className="relative -mt-10 px-6 block">
                  <span className="relative w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg block">
                    <Image
                      src={vendor.avatar}
                      alt={vendor.name}
                      fill
                      className="object-cover"
                    />
                  </span>
                </span>

                {/* Content */}
                <span className="p-6 pt-3 block">
                  <span className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {vendor.name}
                    </span>
                    {vendor.isVerified && (
                      <CheckCircle className="w-5 h-5 text-primary-500 fill-primary-100" />
                    )}
                  </span>
                  
                  <span className="text-sm text-gray-600 mb-4 line-clamp-2 block">
                    {vendor.bio}
                  </span>

                  {/* Stats */}
                  <span className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                      <span className="font-semibold text-gray-900">{vendor.rating}</span>
                      <span>({vendor.reviewCount})</span>
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Package className="w-4 h-4" />
                      <span>{vendor.productCount} produits</span>
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>{(vendor.totalSales / 1000).toFixed(1)}k ventes</span>
                    </span>
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredVendors.length === 0 && !isLoading && (
          <div className="card p-12 text-center">
            {vendors.length === 0 ? (
              <>
                <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun vendeur pour le moment
                </h3>
                <p className="text-gray-600 mb-4">
                  Soyez le premier à rejoindre notre communauté de vendeurs !
                </p>
                <Link href="/devenir-vendeur">
                  <Button>Devenir vendeur</Button>
                </Link>
              </>
            ) : (
              <>
                <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun vendeur trouvé
                </h3>
                <p className="text-gray-600 mb-4">
                  Essayez de modifier votre recherche
                </p>
                <Button variant="secondary" onClick={() => setSearchQuery('')}>
                  Réinitialiser
                </Button>
              </>
            )}
          </div>
        )}
          </>
        )}

        {/* CTA */}
        <div className="mt-16 card p-8 bg-gradient-to-r from-primary-600 to-secondary-600 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Vous êtes créateur de templates ?
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Rejoignez notre communauté de vendeurs et commencez à monétiser vos créations dès aujourd'hui.
          </p>
          <Link href="/devenir-vendeur">
            <Button variant="accent" size="lg">
              Devenir vendeur
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

