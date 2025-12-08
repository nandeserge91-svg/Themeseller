'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Search, 
  Download,
  Eye,
  DollarSign,
  Package,
  TrendingUp,
  Calendar
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { useCurrencyStore } from '@/store/currencyStore'

const orders = [
  {
    id: 'THP-001234',
    customer: { name: 'Jean Martin', email: 'jean.martin@email.com' },
    vendor: { name: 'WebStudio Pro', id: '1' },
    product: {
      title: 'ProBusiness - Template WordPress',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=100&h=75&fit=crop',
    },
    amount: 49,
    commission: 7.35,
    vendorPayout: 41.65,
    date: '2024-01-15T14:30:00',
    status: 'completed',
  },
  {
    id: 'THP-001233',
    customer: { name: 'Sophie Durand', email: 'sophie.d@email.com' },
    vendor: { name: 'DesignHub', id: '2' },
    product: {
      title: 'SaaS Landing Page - HTML5',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=75&fit=crop',
    },
    amount: 39,
    commission: 5.85,
    vendorPayout: 33.15,
    date: '2024-01-15T10:15:00',
    status: 'completed',
  },
  {
    id: 'THP-001232',
    customer: { name: 'Pierre Leblanc', email: 'p.leblanc@email.com' },
    vendor: { name: 'WebStudio Pro', id: '1' },
    product: {
      title: 'ProBusiness - Template WordPress',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=100&h=75&fit=crop',
    },
    amount: 49,
    commission: 7.35,
    vendorPayout: 41.65,
    date: '2024-01-14T16:45:00',
    status: 'completed',
  },
]

const stats = {
  totalRevenue: orders.reduce((acc, o) => acc + o.amount, 0),
  totalCommissions: orders.reduce((acc, o) => acc + o.commission, 0),
  ordersCount: orders.length,
  avgOrderValue: orders.reduce((acc, o) => acc + o.amount, 0) / orders.length,
}

export default function AdminCommandesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const { currency } = useCurrencyStore()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Commandes</h1>
              <p className="text-gray-600">Toutes les transactions de la plateforme</p>
            </div>
            <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
              Exporter CSV
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.ordersCount}</p>
                  <p className="text-sm text-gray-500">Commandes</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue, currency)}</p>
                  <p className="text-sm text-gray-500">Revenus totaux</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-secondary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalCommissions, currency)}</p>
                  <p className="text-sm text-gray-500">Commissions</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.avgOrderValue, currency)}</p>
                  <p className="text-sm text-gray-500">Panier moyen</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par n° commande, client ou vendeur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Commande</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Client</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Vendeur</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Montant</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Commission</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-9 rounded overflow-hidden">
                            <Image
                              src={order.product.image}
                              alt={order.product.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-mono text-sm text-primary-600">{order.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.customer.name}</p>
                          <p className="text-sm text-gray-500">{order.customer.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900">{order.vendor.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{formatPrice(order.amount, currency)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-accent-600">{formatPrice(order.commission, currency)}</p>
                          <p className="text-xs text-gray-500">Net vendeur: {formatPrice(order.vendorPayout, currency)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(order.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}






