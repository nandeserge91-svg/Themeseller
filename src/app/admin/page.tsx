'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Users, 
  Package, 
  DollarSign, 
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  ArrowUpRight,
  MoreHorizontal,
  Eye,
  XCircle
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'
import { useCurrencyStore } from '@/store/currencyStore'

// Données de démonstration
const stats = [
  {
    label: 'Revenus totaux',
    value: '124,580 €',
    change: '+12.5%',
    icon: DollarSign,
    color: 'text-accent-600 bg-accent-100',
  },
  {
    label: 'Utilisateurs',
    value: '8,459',
    change: '+8.2%',
    icon: Users,
    color: 'text-primary-600 bg-primary-100',
  },
  {
    label: 'Produits actifs',
    value: '1,234',
    change: '+15.3%',
    icon: Package,
    color: 'text-secondary-600 bg-secondary-100',
  },
  {
    label: 'Commandes',
    value: '3,567',
    change: '+10.1%',
    icon: ShoppingCart,
    color: 'text-warning-600 bg-warning-100',
  },
]

const pendingProducts = [
  {
    id: '1',
    title: 'NewTheme - Modern Business Template',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    vendor: 'ThemeWizards',
    price: 59,
    submittedAt: '2024-01-15T10:30:00',
  },
  {
    id: '2',
    title: 'AppUI - Mobile App UI Kit',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    vendor: 'DesignMasters',
    price: 79,
    submittedAt: '2024-01-14T15:45:00',
  },
  {
    id: '3',
    title: 'EmailPack - Email Templates Bundle',
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=300&fit=crop',
    vendor: 'EmailPro',
    price: 39,
    submittedAt: '2024-01-14T09:20:00',
  },
]

const recentOrders = [
  {
    id: 'TP-ABC123',
    customer: 'Jean Dupont',
    amount: 147,
    items: 3,
    status: 'completed',
    date: '2024-01-15T14:30:00',
  },
  {
    id: 'TP-DEF456',
    customer: 'Marie Martin',
    amount: 59,
    items: 1,
    status: 'completed',
    date: '2024-01-15T12:15:00',
  },
  {
    id: 'TP-GHI789',
    customer: 'Pierre Bernard',
    amount: 98,
    items: 2,
    status: 'pending',
    date: '2024-01-15T11:00:00',
  },
  {
    id: 'TP-JKL012',
    customer: 'Sophie Durand',
    amount: 49,
    items: 1,
    status: 'refunded',
    date: '2024-01-14T18:45:00',
  },
]

const topVendors = [
  {
    id: '1',
    name: 'PixelCraft Studio',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    sales: 2450,
    revenue: 145800,
    rating: 4.9,
  },
  {
    id: '2',
    name: 'ThemeWizards',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    sales: 1890,
    revenue: 98500,
    rating: 4.8,
  },
  {
    id: '3',
    name: 'DesignMasters',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    sales: 1456,
    revenue: 87300,
    rating: 4.7,
  },
]

export default function AdminDashboard() {
  const [approving, setApproving] = useState<string | null>(null)
  const { currency } = useCurrencyStore()

  const handleApprove = async (productId: string) => {
    setApproving(productId)
    // Simuler l'approbation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setApproving(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
              <p className="text-gray-600">Tableau de bord de gestion ThemePro</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/utilisateurs">
                <Button variant="ghost" leftIcon={<Users className="w-4 h-4" />}>
                  Utilisateurs
                </Button>
              </Link>
              <Link href="/admin/produits">
                <Button variant="ghost" leftIcon={<Package className="w-4 h-4" />}>
                  Produits
                </Button>
              </Link>
              <Link href="/admin/parametres">
                <Button variant="secondary">
                  Paramètres
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
                <div className="flex items-center gap-1 text-sm font-medium text-accent-600">
                  <TrendingUp className="w-4 h-4" />
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Products */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">Produits en attente</h2>
                  <span className="px-2 py-0.5 bg-warning-100 text-warning-700 rounded-full text-xs font-medium">
                    {pendingProducts.length}
                  </span>
                </div>
                <Link href="/admin/produits?status=pending" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Voir tout
                </Link>
              </div>
              <div className="divide-y">
                {pendingProducts.map((product) => (
                  <div key={product.id} className="p-6 flex gap-4">
                    <div className="relative w-24 h-18 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
                      <p className="text-sm text-gray-500">par {product.vendor}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{formatPrice(product.price, currency)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(product.submittedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {}}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleApprove(product.id)}
                        isLoading={approving === product.id}
                        leftIcon={<CheckCircle className="w-4 h-4" />}
                      >
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="card mt-8">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Commandes récentes</h2>
                <Link href="/admin/commandes" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Voir tout
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commande
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">{order.id}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({order.items} article{order.items > 1 ? 's' : ''})
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {formatPrice(order.amount, currency)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed'
                              ? 'bg-accent-100 text-accent-700'
                              : order.status === 'pending'
                              ? 'bg-warning-100 text-warning-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {order.status === 'completed' ? 'Complété' :
                             order.status === 'pending' ? 'En attente' : 'Remboursé'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Alerts */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Alertes</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-warning-50 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning-800">3 produits en attente</p>
                    <p className="text-xs text-warning-600">Depuis plus de 24h</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">2 avis signalés</p>
                    <p className="text-xs text-red-600">À modérer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Vendors */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Top Vendeurs</h3>
              <div className="space-y-4">
                {topVendors.map((vendor, index) => (
                  <div key={vendor.id} className="flex items-center gap-3">
                    <span className="w-6 text-sm font-medium text-gray-400">#{index + 1}</span>
                    <Image
                      src={vendor.avatar}
                      alt={vendor.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{vendor.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{vendor.sales} ventes</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-warning-500 fill-warning-500" />
                          {vendor.rating}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(vendor.revenue, currency)}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/admin/vendeurs">
                <Button variant="ghost" className="w-full mt-4" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  Voir tous les vendeurs
                </Button>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-2">
                {[
                  { href: '/admin/categories', label: 'Gérer les catégories' },
                  { href: '/admin/avis', label: 'Modérer les avis' },
                  { href: '/admin/paiements', label: 'Voir les paiements' },
                  { href: '/admin/rapports', label: 'Générer un rapport' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}






