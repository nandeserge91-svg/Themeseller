'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Download, ArrowRight, Package, Mail } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useCartStore } from '@/store/cartStore'
import Button from '@/components/ui/Button'

export default function CheckoutSuccessPage() {
  const { clearCart } = useCartStore()

  useEffect(() => {
    // Vider le panier
    clearCart()

    // Animation confetti
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'],
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'],
      })
    }, 250)

    return () => clearInterval(interval)
  }, [clearCart])

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 mesh-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-accent-400 to-accent-600 flex items-center justify-center shadow-glow"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Paiement réussi ! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8"
        >
          Merci pour votre achat ! Vos fichiers sont maintenant disponibles au téléchargement.
        </motion.p>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 mb-8"
        >
          <div className="card p-4 flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Download className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Téléchargement disponible</h3>
              <p className="text-sm text-gray-500">
                Accédez à vos fichiers depuis votre espace client
              </p>
            </div>
          </div>

          <div className="card p-4 flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Email de confirmation</h3>
              <p className="text-sm text-gray-500">
                Un reçu a été envoyé à votre adresse email
              </p>
            </div>
          </div>

          <div className="card p-4 flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Support inclus</h3>
              <p className="text-sm text-gray-500">
                6 mois de support vendeur pour vos produits
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/mon-compte/achats">
            <Button size="lg" rightIcon={<Download className="w-5 h-5" />}>
              Télécharger mes achats
            </Button>
          </Link>
          <Link href="/produits">
            <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Continuer les achats
            </Button>
          </Link>
        </motion.div>

        {/* Order Number */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-gray-400 mt-8"
        >
          Numéro de commande : <span className="font-mono">TP-{Date.now().toString(36).toUpperCase()}</span>
        </motion.p>
      </motion.div>
    </div>
  )
}







