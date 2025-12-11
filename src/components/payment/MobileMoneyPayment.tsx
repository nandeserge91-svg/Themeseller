'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, CreditCard, Smartphone, Shield, ChevronRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'

interface MobileMoneyPaymentProps {
  amount: number
  currency?: string
  country?: string
  productIds?: string[]
  onError?: (error: string) => void
}

// Logos des opérateurs Mobile Money
const OrangeMoneyLogo = () => (
  <svg viewBox="0 0 48 48" className="w-8 h-8">
    <circle cx="24" cy="24" r="24" fill="#FF6600"/>
    <text x="24" y="29" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">OM</text>
  </svg>
)

const MTNLogo = () => (
  <svg viewBox="0 0 48 48" className="w-8 h-8">
    <circle cx="24" cy="24" r="24" fill="#FFCC00"/>
    <rect x="10" y="17" width="28" height="14" rx="2" fill="#003399"/>
    <text x="24" y="28" textAnchor="middle" fill="#FFCC00" fontSize="9" fontWeight="bold">MTN</text>
  </svg>
)

const MoovLogo = () => (
  <svg viewBox="0 0 48 48" className="w-8 h-8">
    <circle cx="24" cy="24" r="24" fill="#0066B3"/>
    <circle cx="24" cy="24" r="12" fill="#fff"/>
    <circle cx="24" cy="24" r="8" fill="#0066B3"/>
  </svg>
)

const WaveLogo = () => (
  <svg viewBox="0 0 48 48" className="w-8 h-8">
    <circle cx="24" cy="24" r="24" fill="#1DC7EA"/>
    <path d="M10 24c4-4 8-8 14-4s10 0 14-4" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M10 30c4-4 8-8 14-4s10 0 14-4" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>
)

export default function MobileMoneyPayment({
  amount,
  currency = 'XOF',
  country = 'CI',
  productIds = [],
  onError,
}: MobileMoneyPaymentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuthStore()

  // Formater le montant
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(value) + ' FCFA'
  }

  // Initier le paiement via Payfonte Standard Checkout
  const handlePayment = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/payment/payfonte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount),
          currency,
          country,
          productIds,
          customerName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : undefined,
          customerEmail: user?.email,
          narration: `Achat sur Themeseller`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du paiement')
      }

      // Rediriger vers la page de checkout Payfonte
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        throw new Error('URL de paiement non reçue')
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du paiement'
      onError?.(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
      {/* En-tête */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-full mb-3">
          <Smartphone className="w-7 h-7 text-primary-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Mobile Money</h3>
        <p className="text-sm text-gray-500">Paiement sécurisé via Payfonte</p>
      </div>

      {/* Montant */}
      <div className="bg-white rounded-xl p-4 mb-6 text-center border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-500 mb-1">Montant à payer</p>
        <p className="text-3xl font-bold text-primary-600">{formatAmount(amount)}</p>
      </div>

      {/* Opérateurs disponibles */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3 text-center">
          Opérateurs acceptés en Côte d'Ivoire
        </p>
        <div className="flex justify-center gap-4">
          <div className="flex flex-col items-center">
            <OrangeMoneyLogo />
            <span className="text-xs text-gray-500 mt-1">Orange</span>
          </div>
          <div className="flex flex-col items-center">
            <MTNLogo />
            <span className="text-xs text-gray-500 mt-1">MTN</span>
          </div>
          <div className="flex flex-col items-center">
            <MoovLogo />
            <span className="text-xs text-gray-500 mt-1">Moov</span>
          </div>
          <div className="flex flex-col items-center">
            <WaveLogo />
            <span className="text-xs text-gray-500 mt-1">Wave</span>
          </div>
        </div>
      </div>

      {/* Bouton de paiement */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full py-4 text-lg font-semibold"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Redirection en cours...
            </>
          ) : (
            <>
              Payer {formatAmount(amount)}
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </motion.div>

      {/* Info sécurité */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
        <Shield className="w-4 h-4" />
        <span>Paiement sécurisé par Payfonte</span>
      </div>

      {/* Note */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        Vous serez redirigé vers la page de paiement Payfonte pour finaliser votre achat.
      </p>
    </div>
  )
}
