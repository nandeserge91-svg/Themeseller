'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { formatPrice } from '@/lib/utils'

export default function CartSidebar() {
  const [mounted, setMounted] = useState(false)
  const { items, isOpen, closeCart, removeItem, getTotal } = useCartStore()
  const { currency } = useCurrencyStore()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Ne pas rendre côté serveur
  if (!mounted) return null
  
  const currentCurrency = currency

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-gray-900">Panier</h2>
                  <p className="text-sm text-gray-500">{items.length} article(s)</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Votre panier est vide</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Découvrez nos templates premium et ajoutez-les à votre panier
                  </p>
                  <Link
                    href="/produits"
                    onClick={closeCart}
                    className="btn-primary"
                  >
                    Explorer les produits
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-4 bg-gray-50 rounded-2xl"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500 mb-2">
                          par {item.vendorName}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary-600">
                            {formatPrice(item.salePrice || item.price, currentCurrency)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4 bg-white">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-medium text-gray-600">Total</span>
                  <span className="font-bold text-gray-900">{formatPrice(getTotal(), currentCurrency)}</span>
                </div>
                <Link
                  href="/panier"
                  onClick={closeCart}
                  className="btn-primary w-full justify-center gap-2"
                >
                  Voir le panier
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-secondary w-full justify-center"
                >
                  Passer à la caisse
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

