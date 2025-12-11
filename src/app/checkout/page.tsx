'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Lock, 
  CreditCard, 
  Shield, 
  ArrowLeft,
  CheckCircle2,
  Smartphone
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useCurrencyStore } from '@/store/currencyStore'
import { formatPrice } from '@/lib/utils'
import Button from '@/components/ui/Button'
import MobileMoneyPayment from '@/components/payment/MobileMoneyPayment'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const { currency } = useCurrencyStore()
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile_money'>('card')
  const [showMobilePayment, setShowMobilePayment] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Rediriger si le panier est vide (côté client uniquement)
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/panier')
    }
  }, [mounted, items.length, router])

  const currentCurrency = mounted ? currency : 'EUR'
  const subtotal = getTotal()
  const total = subtotal

  // Afficher un loader pendant l'hydratation ou si panier vide
  if (!mounted || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  const handleCheckout = async () => {
    if (!isAuthenticated()) {
      toast.error('Veuillez vous connecter pour continuer')
      router.push('/connexion?redirect=/checkout')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: items.map((item) => item.id),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      // Rediriger vers Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        // Simulation pour démo sans Stripe
        clearCart()
        router.push('/checkout/success?demo=true')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors du paiement')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/panier" className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au panier
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Récapitulatif de commande
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                      <p className="text-sm text-gray-500">par {item.vendorName}</p>
                    </div>
                    <div className="text-right">
                      {item.salePrice ? (
                        <>
                          <span className="font-semibold text-gray-900">
                            {formatPrice(item.salePrice, currentCurrency)}
                          </span>
                          <span className="block text-sm text-gray-400 line-through">
                            {formatPrice(item.price, currentCurrency)}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold text-gray-900">
                          {formatPrice(item.price, currentCurrency)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal, currentCurrency)}</span>
                </div>
                {items.some((i) => i.salePrice) && (
                  <div className="flex justify-between text-accent-600">
                    <span>Économies</span>
                    <span>
                      -{formatPrice(
                        items.reduce((acc, i) => {
                          if (i.salePrice) return acc + (i.price - i.salePrice)
                          return acc
                        }, 0),
                        currentCurrency
                      )}
                    </span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(total, currentCurrency)}</span>
                </div>
              </div>
            </div>

            {/* What you get */}
            <div className="card p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Ce que vous obtenez</h3>
              <ul className="space-y-3">
                {[
                  'Téléchargement instantané des fichiers',
                  'Mises à jour gratuites à vie',
                  '6 mois de support vendeur',
                  'Licence commerciale incluse',
                  'Remboursement sous 30 jours',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-accent-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment */}
          <div>
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Paiement sécurisé</h2>
                  <p className="text-sm text-gray-500">Vos données sont protégées</p>
                </div>
              </div>

              {/* User Info */}
              {isAuthenticated() ? (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Connecté en tant que</p>
                  <p className="font-medium text-gray-900">{user?.email}</p>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-warning-50 rounded-xl border border-warning-200">
                  <p className="text-sm text-warning-800">
                    <Link href="/connexion?redirect=/checkout" className="font-medium underline">
                      Connectez-vous
                    </Link>{' '}
                    pour finaliser votre achat
                  </p>
                </div>
              )}

              {/* Payment Methods Selection */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Choisissez votre méthode de paiement</p>
                <div className="grid grid-cols-2 gap-3">
                  {/* Carte bancaire */}
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                    <div className="font-medium text-gray-900 text-sm">Carte bancaire</div>
                    <div className="text-xs text-gray-500 mt-1">Visa, Mastercard, PayPal</div>
                  </button>

                  {/* Mobile Money */}
                  <button
                    onClick={() => setPaymentMethod('mobile_money')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'mobile_money'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Smartphone className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <div className="font-medium text-gray-900 text-sm">Mobile Money</div>
                    <div className="text-xs text-gray-500 mt-1">Orange, MTN, Moov, Wave</div>
                  </button>
                </div>
              </div>

              {/* Checkout Button or Mobile Money Component */}
              {paymentMethod === 'card' ? (
                <>
                  <div className="mb-4 flex items-center gap-3 flex-wrap">
                    <div className="px-3 py-2 border rounded-lg bg-white">
                      <svg className="h-5" viewBox="0 0 124 32" fill="none">
                        <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.569.569 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746zm.789 6.405c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.144.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.03.998 1.177 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.562-.657zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z" fill="#253B80"/>
                        <path d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.03 1 1.177 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.657zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.34.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z" fill="#179BD7"/>
                      </svg>
                    </div>
                    <div className="px-3 py-2 border rounded-lg bg-white">
                      <svg className="h-5" viewBox="0 0 40 24" fill="none">
                        <rect width="40" height="24" rx="4" fill="#000"/>
                        <path d="M17.448 15.876h-2.296l1.434-8.876h2.296l-1.434 8.876zM26.764 7.168c-.456-.18-.946-.312-1.568-.312-1.728 0-2.944.92-2.956 2.236-.024 .968.868 1.508 1.532 1.832.676.332 .908.548.908.844-.012.456-.548.664-1.052.664-.7 0-1.072-.104-1.648-.36l-.228-.108-.244 1.516c.408.188 1.164.352 1.948.36 1.84 0 3.032-.908 3.052-2.312.012-.772-.46-1.36-1.472-1.844-.612-.312-.988-.52-.988-.836.012-.288.32-.584 1.008-.584.576-.012 .992.124 1.316.264l.16.08.24-1.44zM30.332 7h-1.428c-.444 0-.776.128-.972.596l-2.752 6.28h1.936l.392-1.072h2.368l.22 1.072h1.708L30.332 7zm-2.284 5.356c.152-.412.74-2.004.74-2.004-.012.02.152-.416.248-.684l.124.62s.36 1.732.432 2.068h-1.544zM14.364 7l-1.716 6.052-.184-.94c-.32-1.088-1.316-2.268-2.432-2.86l1.656 6.612h1.852L16.216 7h-1.852z" fill="#fff"/>
                        <path d="M10.888 7H8.024l-.024.156c2.196.56 3.648 1.912 4.252 3.536L11.6 7.6c-.108-.464-.44-.588-.712-.6z" fill="#F9A51A"/>
                      </svg>
                    </div>
                    <div className="px-3 py-2 border rounded-lg bg-white">
                      <svg className="h-5" viewBox="0 0 40 24" fill="none">
                        <rect width="40" height="24" rx="4" fill="#EB001B"/>
                        <circle cx="15" cy="12" r="7" fill="#EB001B"/>
                        <circle cx="25" cy="12" r="7" fill="#F79E1B"/>
                        <path d="M20 6.5a7 7 0 0 0-2.5 5.5 7 7 0 0 0 2.5 5.5 7 7 0 0 0 2.5-5.5 7 7 0 0 0-2.5-5.5z" fill="#FF5F00"/>
                      </svg>
                    </div>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    isLoading={isLoading}
                    className="w-full"
                    size="lg"
                    disabled={!isAuthenticated()}
                  >
                    Payer {formatPrice(total, currentCurrency)}
                  </Button>
                </>
              ) : (
                <div className="mt-4">
                  {isAuthenticated() ? (
                    <MobileMoneyPayment
                      amount={currentCurrency === 'XOF' ? total : Math.round(total * 655.957)}
                      currency="XOF"
                      onSuccess={(txId) => {
                        clearCart()
                        router.push(`/checkout/success?transaction=${txId}`)
                      }}
                      onError={(error) => {
                        toast.error(error)
                      }}
                      onCancel={() => setPaymentMethod('card')}
                    />
                  ) : (
                    <div className="p-4 bg-warning-50 rounded-xl border border-warning-200 text-center">
                      <p className="text-sm text-warning-800 mb-3">
                        Connectez-vous pour payer par Mobile Money
                      </p>
                      <Button
                        onClick={() => router.push('/connexion?redirect=/checkout')}
                        variant="primary"
                      >
                        Se connecter
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-accent-500" />
                  <span>
                    {paymentMethod === 'card' 
                      ? 'Paiement sécurisé par Stripe (SSL 256 bits)' 
                      : 'Paiement sécurisé par Payfonte 🇨🇮'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Lock className="w-5 h-5 text-primary-500" />
                  <span>Vos données ne sont jamais stockées</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center mt-6">
              En passant commande, vous acceptez nos{' '}
              <Link href="/cgu" className="text-primary-600 hover:underline">
                Conditions d'utilisation
              </Link>{' '}
              et notre{' '}
              <Link href="/confidentialite" className="text-primary-600 hover:underline">
                Politique de confidentialité
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

