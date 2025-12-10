'use client'

import { useState, useEffect } from 'react'
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
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'
import { useCurrencyStore } from '@/store/currencyStore'
import { useProductsStore, Product } from '@/store/productsStore'
import { useAuthStore } from '@/store/authStore'

// Config des statuts
const statusConfig: Record<string, { label: string; icon: typeof CheckCircle; color: string }> = {
  active: { label: 'En vente', icon: CheckCircle, color: 'text-accent-600 bg-accent-50' },
  approved: { label: 'En vente', icon: CheckCircle, color: 'text-accent-600 bg-accent-50' },
  pending: { label: 'En attente', icon: Clock, color: 'text-warning-600 bg-warning-50' },
  'pending-review': { label: 'En attente', icon: Clock, color: 'text-warning-600 bg-warning-50' },
  rejected: { label: 'Rejeté', icon: XCircle, color: 'text-red-600 bg-red-50' },
  suspended: { label: 'Suspendu', icon: AlertCircle, color: 'text-orange-600 bg-orange-50' },
  draft: { label: 'Brouillon', icon: Clock, color: 'text-gray-600 bg-gray-100' },
}

export default function VendeurDashboard() {
  const { currency } = useCurrencyStore()
  const { products: allProducts, fetchProducts, isLoading } = useProductsStore()
  const { user } = useAuthStore()
  const [isHydrated, setIsHydrated] = useState(false)
  
  // Charger les produits du vendeur au montage
  useEffect(() => {
    setIsHydrated(true)
    fetchProducts({ my: true }) // Charger les produits du vendeur connecté
  }, [fetchProducts])
  
  // Filtrer les produits du vendeur connecté
  const vendorProducts = allProducts.filter(p => {
    // Afficher tous les produits si admin, sinon filtrer par vendeur
    if (user?.role === 'ADMIN') return true
    // Vérifier si le produit appartient au vendeur connecté
    const vendorId = user?.vendorProfile?.id
    return p.vendor?.userId === user?.id || p.vendor?.id === vendorId
  })
  
  // Calculer les statistiques dynamiques
  const stats = {
    totalRevenue: vendorProducts.reduce((acc, p) => acc + (p.revenue || 0), 0),
    totalSales: vendorProducts.reduce((acc, p) => acc + p.sales, 0),
    totalViews: vendorProducts.reduce((acc, p) => acc + p.views, 0),
    avgRating: vendorProducts.length > 0 
      ? vendorProducts.reduce((acc, p) => acc + p.rating, 0) / vendorProducts.filter(p => p.rating > 0).length || 0
      : 0,
    active: vendorProducts.filter(p => p.status === 'active' || p.status === 'approved').length,
    pending: vendorProducts.filter(p => p.status === 'pending' || p.status === 'pending-review').length,
    rejected: vendorProducts.filter(p => p.status === 'rejected').length,
  }
  
  const statsCards = [
    {
      label: 'Revenus totaux',
      value: formatPrice(stats.totalRevenue, currency),
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-accent-600 bg-accent-100',
    },
    {
      label: 'Ventes totales',
      value: stats.totalSales.toString(),
      change: '+8%',
      trend: 'up',
      icon: Package,
      color: 'text-primary-600 bg-primary-100',
    },
    {
      label: 'Vues totales',
      value: stats.totalViews.toString(),
      change: '+15%',
      trend: 'up',
      icon: Eye,
      color: 'text-secondary-600 bg-secondary-100',
    },
    {
      label: 'Note moyenne',
      value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '-',
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'text-warning-600 bg-warning-100',
    },
  ]
  
  // Loader
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Vendeur</h1>
              <p className="text-gray-600">Bienvenue, {user?.firstName || user?.email || 'Vendeur'}</p>
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
        {/* Alertes */}
        {stats.pending > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4 mb-6 border-l-4 border-warning-500 bg-warning-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-warning-600" />
                <p className="text-warning-800">
                  <strong>{stats.pending}</strong> produit(s) en attente de validation
                </p>
              </div>
              <Link href="/vendeur/produits?filter=pending">
                <Button size="sm" variant="ghost" className="text-warning-700">
                  Voir →
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
        
        {stats.rejected > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4 mb-6 border-l-4 border-red-500 bg-red-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">
                  <strong>{stats.rejected}</strong> produit(s) rejeté(s) - Corrigez et resoumettez
                </p>
              </div>
              <Link href="/vendeur/produits?filter=rejected">
                <Button size="sm" variant="ghost" className="text-red-700">
                  Voir →
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
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
                <h2 className="text-lg font-semibold text-gray-900">Mes produits ({vendorProducts.length})</h2>
                <Link href="/vendeur/produits" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Voir tout
                </Link>
              </div>
              
              {vendorProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Vous n'avez pas encore de produits</p>
                  <Link href="/vendeur/produits/nouveau">
                    <Button>Créer mon premier produit</Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produit
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ventes
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenus
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {vendorProducts.slice(0, 5).map((product) => {
                        const status = statusConfig[product.status] || statusConfig.pending
                        const StatusIcon = status.icon
                        return (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                  {product.image ? (
                                    <Image
                                      src={product.image}
                                      alt={product.title}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package className="w-6 h-6 text-gray-400" />
                                    </div>
                                  )}
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
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-medium text-gray-900">{product.sales}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-medium text-gray-900">
                                {formatPrice(product.revenue || 0, currency)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {(product.status === 'active' || product.status === 'approved') && (
                                  <Link href={`/produit/${product.slug}`} target="_blank">
                                    <Button size="sm" variant="ghost" title="Voir sur le site">
                                      <ExternalLink className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                )}
                                <Link href={`/vendeur/produits/${product.id}/modifier`}>
                                  <Button size="sm" variant="ghost" title="Modifier">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Stats */}
          <div>
            {/* Résumé des produits */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Résumé des produits</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-accent-500" />
                    <span>En vente</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4 text-warning-500" />
                    <span>En attente</span>
                  </div>
                  <span className="font-semibold text-warning-600">{stats.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>Rejetés</span>
                  </div>
                  <span className="font-semibold text-red-600">{stats.rejected}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span>Total</span>
                  </div>
                  <span className="font-semibold text-gray-900">{vendorProducts.length}</span>
                </div>
              </div>
              
              <div className="border-t mt-4 pt-4">
                <Link href="/vendeur/produits">
                  <Button variant="ghost" className="w-full" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                    Gérer mes produits
                  </Button>
                </Link>
              </div>
            </div>

            {/* Statistiques */}
            <div className="card p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>Vues totales</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.totalViews.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>Total ventes</span>
                  </div>
                  <span className="font-semibold text-gray-900">{stats.totalSales}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="w-4 h-4" />
                    <span>Note moyenne</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {stats.avgRating > 0 ? `⭐ ${stats.avgRating.toFixed(1)}` : '-'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Actions rapides */}
            <div className="card p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <Link href="/vendeur/produits/nouveau" className="block">
                  <Button variant="primary" className="w-full" leftIcon={<Plus className="w-4 h-4" />}>
                    Nouveau produit
                  </Button>
                </Link>
                <Link href="/vendeur/produits" className="block">
                  <Button variant="secondary" className="w-full" leftIcon={<Package className="w-4 h-4" />}>
                    Tous mes produits
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}






