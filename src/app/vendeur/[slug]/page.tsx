'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Star, 
  Package, 
  TrendingUp, 
  CheckCircle, 
  Calendar,
  Globe,
  Twitter,
  Mail,
  ArrowLeft
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import ProductCard from '@/components/ui/ProductCard'
import Button from '@/components/ui/Button'

const vendorsData: Record<string, any> = {
  'pixelcraft-studio': {
    id: 'v1',
    name: 'PixelCraft Studio',
    slug: 'pixelcraft-studio',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop',
    bio: 'Créateur de templates premium depuis 2020. Spécialisé en WordPress et React. Notre équipe de designers et développeurs passionnés crée des templates de haute qualité pour aider les entreprises à se démarquer en ligne.',
    rating: 4.9,
    reviewCount: 890,
    totalSales: 12500,
    productCount: 24,
    isVerified: true,
    memberSince: '2020-03-15',
    website: 'https://pixelcraft.studio',
    twitter: '@pixelcraft',
    location: 'Paris, France',
  },
}

const vendorProducts = [
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
    categoryName: 'WordPress',
    isNew: false,
    isFeatured: true,
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
    categoryName: 'WordPress',
    isNew: true,
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
    categoryName: 'Landing Pages',
    isNew: false,
    isFeatured: true,
  },
]

export default function VendeurProfilPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const vendor = vendorsData[slug] || vendorsData['pixelcraft-studio']
  const [activeTab, setActiveTab] = useState<'products' | 'reviews'>('products')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="relative h-64 md:h-80">
        <Image
          src={vendor.banner}
          alt={vendor.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <Link 
            href="/vendeurs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux vendeurs
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative -mt-20 mb-8">
          <div className="card p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="relative -mt-20 md:-mt-24 flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                  <Image
                    src={vendor.avatar}
                    alt={vendor.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {vendor.name}
                      </h1>
                      {vendor.isVerified && (
                        <CheckCircle className="w-6 h-6 text-primary-500 fill-primary-100" />
                      )}
                    </div>
                    <p className="text-gray-600 max-w-2xl">{vendor.bio}</p>
                  </div>
                  
                  <Button variant="secondary">
                    <Mail className="w-4 h-4 mr-2" />
                    Contacter
                  </Button>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-warning-500 fill-warning-500" />
                    <span className="font-bold text-gray-900">{vendor.rating}</span>
                    <span className="text-gray-500">({vendor.reviewCount} avis)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-5 h-5" />
                    <span>{vendor.productCount} produits</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="w-5 h-5" />
                    <span>{vendor.totalSales.toLocaleString()} ventes</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>Membre depuis {formatDate(vendor.memberSince)}</span>
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-4 mt-4">
                  {vendor.website && (
                    <a 
                      href={vendor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                      <Globe className="w-4 h-4" />
                      Site web
                    </a>
                  )}
                  {vendor.twitter && (
                    <a 
                      href={`https://twitter.com/${vendor.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                      <Twitter className="w-4 h-4" />
                      {vendor.twitter}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-8">
            {[
              { id: 'products', label: `Produits (${vendorProducts.length})` },
              { id: 'reviews', label: `Avis (${vendor.reviewCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {vendorProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="card p-8 text-center mb-12">
            <p className="text-gray-600">
              Les avis seront affichés ici une fois la base de données configurée.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}







