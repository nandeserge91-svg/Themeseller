'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  Package, 
  Download, 
  Star,
  TrendingUp,
  TrendingDown,
  Eye,
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  Calendar,
  Clock
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'
import { useCurrencyStore } from '@/store/currencyStore'

// Données de démonstration
const stats = [
  {
    label: 'Revenus ce mois',
    value: '2,458 €',
    change: '+12%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-accent-600 bg-accent-100',
  },
  {
    label: 'Ventes totales',
    value: '156',
    change: '+8%',
    trend: 'up',
    icon: Package,
    color: 'text-primary-600 bg-primary-100',
  },
  {
    label: 'Téléchargements',
    value: '423',
    change: '+15%',
    trend: 'up',
    icon: Download,
    color: 'text-secondary-600 bg-secondary-100',
  },
  {
    label: 'Note moyenne',
    value: '4.8',
    change: '+0.2',
    trend: 'up',
    icon: Star,
    color: 'text-warning-600 bg-warning-100',
  },
]

const products = [
  {
    id: '1',
    title: 'SaaSify - Template Admin Dashboard Premium',
    slug: 'saasify-admin-dashboard',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    price: 79,
    salePrice: 59,
    sales: 245,
    revenue: 14455,
    views: 3420,
    rating: 4.9,
    status: 'APPROVED',
  },
  {
    id: '2',
    title: 'ShopMax - E-commerce WordPress Theme',
    slug: 'shopmax-ecommerce',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    price: 69,
    salePrice: 49,
    sales: 312,
    revenue: 15288,
    views: 4560,
    rating: 4.8,
    status: 'APPROVED',
  },
  {
    id: '3',
    title: 'AppLanding - Mobile App Landing Page',
    slug: 'applanding-mobile-page',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
    price: 35,
    salePrice: 25,
    sales: 178,
    revenue: 4450,
    views: 2100,
    rating: 4.7,
    status: 'APPROVED',
  },
]

const recentOrders = [
  {
    id: '1',
    product: 'SaaSify - Template Admin Dashboard',
    buyer: 'Jean Dupont',
    amount: 59,
    date: '2024-01-15T14:30:00',
    status: 'completed',
  },
  {
    id: '2',
    product: 'ShopMax - E-commerce WordPress',
    buyer: 'Marie Martin',
    amount: 49,
    date: '2024-01-15T12:15:00',
    status: 'completed',
  },
  {
    id: '3',
    product: 'AppLanding - Mobile App Landing',
    buyer: 'Pierre Bernard',
    amount: 25,
    date: '2024-01-14T18:45:00',
    status: 'completed',
  },
]

export default function VendeurDashboard() {
  const { currency } = useCurrencyStore()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Vendeur</h1>
              <p className="text-gray-600">Bienvenue, PixelCraft Studio</p>
            </div>
            <div className="flex gap-3">
              <Link href="/vendeur/statistiques">
                <Button variant="ghost" leftIcon={<TrendingUp className="w-4 h-4" />}>
                  Statistiques
                </Button>
              </Link>
              <Link href="/vendeur/produits/nouveau">
                <Button leftIcon={<Plus className="w-4 h-4" />}>
                  Nouveau produit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-accent-600' : 'text-red-500'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Mes produits</h2>
                <Link href="/vendeur/produits" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Voir tout
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produit
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ventes
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenus
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Note
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <Link href={`/vendeur/produits/${product.id}`}>
                                <h3 className="font-medium text-gray-900 truncate hover:text-primary-600">
                                  {product.title}
                                </h3>
                              </Link>
                              <p className="text-sm text-gray-500">
                                {formatPrice(product.salePrice || product.price, currency)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">{product.sales}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">
                            {formatPrice(product.revenue, currency)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                            <span className="font-medium text-gray-900">{product.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/produit/${product.slug}`} target="_blank">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/vendeur/produits/${product.id}`}>
                              <Button size="sm" variant="ghost">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <div className="card">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Ventes récentes</h2>
                <Link href="/vendeur/commandes" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Voir tout
                </Link>
              </div>
              <div className="divide-y">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h4 className="font-medium text-gray-900 truncate text-sm">
                          {order.product}
                        </h4>
                        <p className="text-sm text-gray-500">{order.buyer}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="font-semibold text-accent-600">
                          +{formatPrice(order.amount, currency)}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {new Date(order.date).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <Link href="/vendeur/commandes">
                  <Button variant="ghost" className="w-full" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                    Voir toutes les ventes
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Cette semaine</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>Vues totales</span>
                  </div>
                  <span className="font-semibold text-gray-900">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>Nouvelles ventes</span>
                  </div>
                  <span className="font-semibold text-gray-900">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="w-4 h-4" />
                    <span>Nouveaux avis</span>
                  </div>
                  <span className="font-semibold text-gray-900">8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}






