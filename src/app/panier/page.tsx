'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ArrowLeft,
  Shield,
  CreditCard,
  RefreshCw,
  Tag
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { formatPrice } from '@/lib/utils'
import Button from '@/components/ui/Button'

export default function PanierPage() {
  const [mounted, setMounted] = useState(false)
  const { items, removeItem, clearCart, getTotal } = useCartStore()
  const { currency } = useCurrencyStore()
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const currentCurrency = mounted ? currency : 'EUR'
  const subtotal = getTotal()
  const platformFee = 0 // Pas de frais pour l'acheteur
  const total = subtotal + platformFee

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 mesh-bg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Votre panier est vide
          </h1>
          <p className="text-gray-600 mb-8">
            Découvrez nos templates premium et trouvez celui qui correspond à votre projet.
          </p>
          <Link href="/produits">
            <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Explorer les produits
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Panier</h1>
          <p className="text-gray-600 mt-1">
            {items.length} article{items.length > 1 ? 's' : ''} dans votre panier
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex gap-6">
                  {/* Image */}
                  <Link href={`/produit/${item.slug}`} className="flex-shrink-0">
                    <div className="relative w-32 h-24 rounded-xl overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/produit/${item.slug}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      par <span className="font-medium">{item.vendorName}</span>
                    </p>
                    
                    {/* Mobile Price */}
                    <div className="flex items-center justify-between mt-4 lg:hidden">
                      <div className="flex items-center gap-2">
                        {item.salePrice ? (
                          <>
                            <span className="font-bold text-gray-900">
                              {formatPrice(item.salePrice, currentCurrency)}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              {formatPrice(item.price, currentCurrency)}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-gray-900">
                            {formatPrice(item.price, currentCurrency)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Desktop Price & Actions */}
                  <div className="hidden lg:flex flex-col items-end justify-between">
                    <div className="text-right">
                      {item.salePrice ? (
                        <>
                          <span className="text-xl font-bold text-gray-900">
                            {formatPrice(item.salePrice, currentCurrency)}
                          </span>
                          <span className="block text-sm text-gray-400 line-through">
                            {formatPrice(item.price, currentCurrency)}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-gray-900">
                          {formatPrice(item.price, currentCurrency)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <Link href="/produits">
                <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Continuer les achats
                </Button>
              </Link>
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Vider le panier
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Résumé de la commande
              </h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code promo
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Entrer le code"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Button variant="secondary" size="sm">
                    <Tag className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal, currentCurrency)}</span>
                </div>
                {items.some(i => i.salePrice) && (
                  <div className="flex justify-between text-accent-600">
                    <span>Économies</span>
                    <span>
                      -{formatPrice(items.reduce((acc, i) => {
                        if (i.salePrice) return acc + (i.price - i.salePrice)
                        return acc
                      }, 0), currentCurrency)}
                    </span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(total, currentCurrency)}</span>
                </div>
              </div>

              {/* CTA */}
              <Link href="/checkout">
                <Button className="w-full" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Passer à la caisse
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-accent-500" />
                  <span>Paiement sécurisé par Stripe</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CreditCard className="w-5 h-5 text-primary-500" />
                  <span>CB, PayPal, Apple Pay acceptés</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <RefreshCw className="w-5 h-5 text-warning-500" />
                  <span>Remboursement sous 30 jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

