'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

interface MobileMoneyPaymentProps {
  amount: number
  currency?: string
  orderId?: string
  onSuccess?: (transactionId: string) => void
  onError?: (error: string) => void
  onCancel?: () => void
}

// Composants SVG pour les logos des opérateurs
const OrangeMoneyLogo = () => (
  <svg viewBox="0 0 48 48" className="w-10 h-10">
    <circle cx="24" cy="24" r="24" fill="#FF6600"/>
    <path d="M24 10c-7.732 0-14 6.268-14 14s6.268 14 14 14 14-6.268 14-14-6.268-14-14-14zm0 24c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z" fill="#fff"/>
    <text x="24" y="28" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">OM</text>
  </svg>
)

const MTNLogo = () => (
  <svg viewBox="0 0 48 48" className="w-10 h-10">
    <circle cx="24" cy="24" r="24" fill="#FFCC00"/>
    <rect x="10" y="16" width="28" height="16" rx="2" fill="#003399"/>
    <text x="24" y="28" textAnchor="middle" fill="#FFCC00" fontSize="10" fontWeight="bold">MTN</text>
  </svg>
)

const MoovLogo = () => (
  <svg viewBox="0 0 48 48" className="w-10 h-10">
    <circle cx="24" cy="24" r="24" fill="#0066B3"/>
    <circle cx="24" cy="24" r="14" fill="#fff"/>
    <circle cx="24" cy="24" r="10" fill="#0066B3"/>
    <text x="24" y="28" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">MOOV</text>
  </svg>
)

const WaveLogo = () => (
  <svg viewBox="0 0 48 48" className="w-10 h-10">
    <circle cx="24" cy="24" r="24" fill="#1DC7EA"/>
    <path d="M10 24c4-4 8-8 14-4s10 0 14-4" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M10 30c4-4 8-8 14-4s10 0 14-4" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M10 18c4-4 8-8 14-4s10 0 14-4" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>
)

const providers = [
  { 
    id: 'orange_money', 
    name: 'Orange Money', 
    color: 'bg-orange-500',
    Logo: OrangeMoneyLogo,
    prefix: ['07', '08', '09']
  },
  { 
    id: 'mtn_money', 
    name: 'MTN MoMo', 
    color: 'bg-yellow-500',
    Logo: MTNLogo,
    prefix: ['05', '04']
  },
  { 
    id: 'moov_money', 
    name: 'Moov Money', 
    color: 'bg-blue-500',
    Logo: MoovLogo,
    prefix: ['01']
  },
  { 
    id: 'wave', 
    name: 'Wave', 
    color: 'bg-cyan-500',
    Logo: WaveLogo,
    prefix: ['07', '01', '05']
  },
]

type PaymentStatus = 'idle' | 'processing' | 'pending' | 'success' | 'error'

export default function MobileMoneyPayment({
  amount,
  currency = 'XOF',
  orderId,
  onSuccess,
  onError,
  onCancel,
}: MobileMoneyPaymentProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [status, setStatus] = useState<PaymentStatus>('idle')
  const [error, setError] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(null)

  // Formater le montant en FCFA
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(value) + ' FCFA'
  }

  // Formater le numéro de téléphone
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 4) return `${numbers.slice(0, 2)} ${numbers.slice(2)}`
    if (numbers.length <= 6) return `${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4)}`
    if (numbers.length <= 8) return `${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 6)} ${numbers.slice(6)}`
    return `${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 6)} ${numbers.slice(6, 8)} ${numbers.slice(8, 10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    if (formatted.replace(/\s/g, '').length <= 10) {
      setPhoneNumber(formatted)
    }
  }

  // Vérifier le statut du paiement
  const checkPaymentStatus = async (txId: string) => {
    try {
      const response = await fetch(`/api/payment/payfonte?transactionId=${txId}`)
      const data = await response.json()

      if (data.transaction?.status === 'successful' || data.transaction?.status === 'completed') {
        setStatus('success')
        if (checkInterval) clearInterval(checkInterval)
        onSuccess?.(txId)
      } else if (data.transaction?.status === 'failed' || data.transaction?.status === 'cancelled') {
        setStatus('error')
        setError('Le paiement a été annulé ou a échoué')
        if (checkInterval) clearInterval(checkInterval)
        onError?.('Paiement échoué')
      }
    } catch (err) {
      console.error('Erreur vérification:', err)
    }
  }

  // Initier le paiement
  const handleSubmit = async () => {
    if (!selectedProvider || !phoneNumber) {
      setError('Veuillez sélectionner un opérateur et entrer votre numéro')
      return
    }

    const cleanPhone = phoneNumber.replace(/\s/g, '')
    if (cleanPhone.length < 10) {
      setError('Numéro de téléphone invalide')
      return
    }

    setStatus('processing')
    setError('')

    try {
      const response = await fetch('/api/payment/payfonte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          phoneNumber: cleanPhone,
          provider: selectedProvider,
          orderId,
          description: `Achat Themeseller`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du paiement')
      }

      setTransactionId(data.transaction.id)
      setStatus('pending')

      // Vérifier le statut toutes les 5 secondes pendant 2 minutes
      const interval = setInterval(() => {
        checkPaymentStatus(data.transaction.id)
      }, 5000)
      setCheckInterval(interval)

      // Arrêter après 2 minutes
      setTimeout(() => {
        clearInterval(interval)
        if (status === 'pending') {
          setError('Délai dépassé. Vérifiez votre téléphone ou réessayez.')
        }
      }, 120000)

    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Erreur lors du paiement')
      onError?.(err instanceof Error ? err.message : 'Erreur')
    }
  }

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (checkInterval) clearInterval(checkInterval)
    }
  }, [checkInterval])

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Paiement Mobile Money</h3>
        <p className="text-3xl font-bold text-primary-600">{formatAmount(amount)}</p>
      </div>

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Sélection opérateur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choisissez votre opérateur
              </label>
              <div className="grid grid-cols-2 gap-3">
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center ${
                      selectedProvider === provider.id
                        ? 'border-primary-500 bg-primary-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <provider.Logo />
                    <div className="font-medium text-gray-900 text-sm mt-2">{provider.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Numéro de téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500">
                  <span className="text-lg">🇨🇮</span>
                  <span className="font-medium">+225</span>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="07 XX XX XX XX"
                  className="w-full pl-24 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Boutons */}
            <div className="flex gap-3">
              {onCancel && (
                <Button variant="secondary" onClick={onCancel} className="flex-1">
                  Annuler
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                disabled={!selectedProvider || phoneNumber.replace(/\s/g, '').length < 10}
                className="flex-1"
              >
                Payer {formatAmount(amount)}
              </Button>
            </div>
          </motion.div>
        )}

        {status === 'processing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Initialisation du paiement...</p>
          </motion.div>
        )}

        {status === 'pending' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-yellow-600 animate-pulse" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Validez sur votre téléphone
            </h4>
            <p className="text-gray-600 mb-4">
              Un message a été envoyé au <strong>{phoneNumber}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Composez votre code PIN {providers.find(p => p.id === selectedProvider)?.name} pour confirmer
            </p>
            <div className="mt-6">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin mx-auto" />
              <p className="text-xs text-gray-400 mt-2">Vérification en cours...</p>
            </div>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Paiement réussi !
            </h4>
            <p className="text-gray-600">
              Votre paiement de {formatAmount(amount)} a été confirmé.
            </p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Paiement échoué
            </h4>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => setStatus('idle')}>
              Réessayer
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sécurité */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-2">
          <span>🔒</span>
          Paiement sécurisé par Payfonte
        </p>
      </div>
    </div>
  )
}

