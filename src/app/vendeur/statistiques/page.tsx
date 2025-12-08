'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Package,
  Eye,
  Star,
  Download,
  Calendar
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { useCurrencyStore } from '@/store/currencyStore'

const stats = {
  revenue: { current: 9547, previous: 8234, change: 15.9 },
  sales: { current: 213, previous: 187, change: 13.9 },
  views: { current: 5576, previous: 4823, change: 15.6 },
  rating: { current: 4.8, previous: 4.7, change: 2.1 },
}

const topProducts = [
  { title: 'ProBusiness - Template WordPress', sales: 124, revenue: 6076 },
  { title: 'SaaS Landing Page - HTML5', sales: 89, revenue: 3471 },
]

const recentActivity = [
  { type: 'sale', message: 'Nouvelle vente de ProBusiness', time: 'Il y a 2h', amount: 49 },
  { type: 'review', message: 'Nouvel avis 5⭐ sur SaaS Landing', time: 'Il y a 5h' },
  { type: 'sale', message: 'Nouvelle vente de SaaS Landing', time: 'Il y a 8h', amount: 39 },
  { type: 'view', message: '100 nouvelles vues sur vos produits', time: 'Il y a 12h' },
]

export default function StatistiquesPage() {
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
              <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
              <p className="text-gray-600">Analysez vos performances</p>
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500">
                <option>30 derniers jours</option>
                <option>7 derniers jours</option>
                <option>Ce mois</option>
                <option>Ce trimestre</option>
                <option>Cette année</option>
              </select>
              <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
                Export
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-accent-600" />
                </div>
                <span className={`flex items-center text-sm font-medium ${stats.revenue.change >= 0 ? 'text-accent-600' : 'text-red-600'}`}>
                  {stats.revenue.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {stats.revenue.change}%
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatPrice(stats.revenue.current, currency)}</p>
              <p className="text-sm text-gray-500 mt-1">Revenus</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary-600" />
                </div>
                <span className={`flex items-center text-sm font-medium ${stats.sales.change >= 0 ? 'text-accent-600' : 'text-red-600'}`}>
                  {stats.sales.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {stats.sales.change}%
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.sales.current}</p>
              <p className="text-sm text-gray-500 mt-1">Ventes</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-secondary-600" />
                </div>
                <span className={`flex items-center text-sm font-medium ${stats.views.change >= 0 ? 'text-accent-600' : 'text-red-600'}`}>
                  {stats.views.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {stats.views.change}%
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{(stats.views.current / 1000).toFixed(1)}k</p>
              <p className="text-sm text-gray-500 mt-1">Vues</p>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-warning-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-warning-600" />
                </div>
                <span className={`flex items-center text-sm font-medium ${stats.rating.change >= 0 ? 'text-accent-600' : 'text-red-600'}`}>
                  {stats.rating.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {stats.rating.change}%
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.rating.current}</p>
              <p className="text-sm text-gray-500 mt-1">Note moyenne</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Placeholder */}
            <div className="lg:col-span-2 card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Revenus sur 30 jours</h3>
              <div className="h-64 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">Graphique des revenus</p>
              </div>
            </div>

            {/* Top Products */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Produits</h3>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900 text-sm line-clamp-1">{product.title}</p>
                      <p className="text-xs text-gray-500">{product.sales} ventes</p>
                    </div>
                    <span className="font-semibold text-accent-600">{formatPrice(product.revenue, currency)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-6 mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Activité récente</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'sale' ? 'bg-accent-100' : 
                      activity.type === 'review' ? 'bg-warning-100' : 'bg-primary-100'
                    }`}>
                      {activity.type === 'sale' && <DollarSign className="w-5 h-5 text-accent-600" />}
                      {activity.type === 'review' && <Star className="w-5 h-5 text-warning-600" />}
                      {activity.type === 'view' && <Eye className="w-5 h-5 text-primary-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.message}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  {activity.amount && (
                    <span className="font-semibold text-accent-600">+{formatPrice(activity.amount, currency)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}






