'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Package, 
  Download, 
  Heart, 
  Settings, 
  CreditCard,
  ShoppingBag,
  Star,
  Clock,
  ArrowRight,
  User
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { formatPrice, formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'
import { useCurrencyStore } from '@/store/currencyStore'

// Données de démonstration
const recentPurchases = [
  {
    id: '1',
    orderNumber: 'TP-ABC123',
    product: {
      title: 'SaaSify - Template Admin Dashboard Premium',
      slug: 'saasify-admin-dashboard',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    },
    price: 59,
    date: '2024-01-15',
    status: 'COMPLETED',
    canDownload: true,
    canReview: true,
  },
  {
    id: '2',
    orderNumber: 'TP-DEF456',
    product: {
      title: 'ShopMax - E-commerce WordPress Theme',
      slug: 'shopmax-ecommerce',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    },
    price: 49,
    date: '2024-01-10',
    status: 'COMPLETED',
    canDownload: true,
    canReview: false, // Déjà noté
  },
]

const stats = [
  { label: 'Achats', value: 12, icon: Package, color: 'text-primary-600 bg-primary-100' },
  { label: 'Téléchargements', value: 24, icon: Download, color: 'text-accent-600 bg-accent-100' },
  { label: 'Favoris', value: 8, icon: Heart, color: 'text-red-500 bg-red-100' },
  { label: 'Avis laissés', value: 5, icon: Star, color: 'text-warning-500 bg-warning-100' },
]

export default function MonComptePage() {
  const { user, isAuthenticated } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const { currency } = useCurrencyStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (!isAuthenticated()) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Connectez-vous pour accéder à votre compte
          </h1>
          <Link href="/connexion">
            <Button>Se connecter</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold">
              {user?.firstName?.[0] || user?.email[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bonjour, {user?.firstName || 'Utilisateur'} !
              </h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Link href="/mon-compte/parametres">
              <Button variant="ghost" leftIcon={<Settings className="w-4 h-4" />}>
                Paramètres
              </Button>
            </Link>
            {user?.role === 'CLIENT' && (
              <Link href="/devenir-vendeur">
                <Button variant="secondary">
                  Devenir vendeur
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Purchases */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Achats récents</h2>
                <Link href="/mon-compte/achats" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Voir tout
                </Link>
              </div>
              <div className="divide-y">
                {recentPurchases.map((purchase) => (
                  <div key={purchase.id} className="p-6 flex gap-4">
                    <Link href={`/produit/${purchase.product.slug}`} className="flex-shrink-0">
                      <div className="relative w-24 h-20 rounded-xl overflow-hidden">
                        <Image
                          src={purchase.product.image}
                          alt={purchase.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/produit/${purchase.product.slug}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-1">
                          {purchase.product.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(purchase.date)}
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatPrice(purchase.price, currency)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        {purchase.canDownload && (
                          <Button size="sm" variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
                            Télécharger
                          </Button>
                        )}
                        {purchase.canReview && (
                          <Link href={`/produit/${purchase.product.slug}#reviews`}>
                            <Button size="sm" variant="ghost" leftIcon={<Star className="w-4 h-4" />}>
                              Laisser un avis
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {recentPurchases.length === 0 && (
                  <div className="p-12 text-center">
                    <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">Pas encore d'achats</h3>
                    <p className="text-gray-500 mb-4">
                      Découvrez nos templates premium
                    </p>
                    <Link href="/produits">
                      <Button>Explorer les produits</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation rapide</h2>
              <nav className="space-y-2">
                {[
                  { href: '/mon-compte/achats', icon: Package, label: 'Mes achats' },
                  { href: '/mon-compte/telechargements', icon: Download, label: 'Téléchargements' },
                  { href: '/mon-compte/favoris', icon: Heart, label: 'Favoris' },
                  { href: '/mon-compte/avis', icon: Star, label: 'Mes avis' },
                  { href: '/mon-compte/paiements', icon: CreditCard, label: 'Méthodes de paiement' },
                  { href: '/mon-compte/parametres', icon: Settings, label: 'Paramètres' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary-50 text-gray-700 hover:text-primary-600 transition-colors group"
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="flex-1">{link.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Become Vendor CTA */}
            {user?.role === 'CLIENT' && (
              <div className="card p-6 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
                <h3 className="text-lg font-semibold mb-2">Devenez vendeur</h3>
                <p className="text-white/80 text-sm mb-4">
                  Vendez vos créations et gagnez de l'argent sur ThemePro
                </p>
                <Link href="/devenir-vendeur">
                  <Button variant="accent" className="w-full">
                    Commencer
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}






