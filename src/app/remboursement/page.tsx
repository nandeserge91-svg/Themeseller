'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Clock, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function RemboursementPage() {
  const [formData, setFormData] = useState({
    email: '',
    orderNumber: '',
    reason: '',
    details: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success('Demande de remboursement envoyée !')
    setFormData({ email: '', orderNumber: '', reason: '', details: '' })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-display font-bold text-white"
          >
            Politique de Remboursement
          </motion.h1>
          <p className="text-white/80 mt-2">
            Garantie satisfait ou remboursé sous 30 jours
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Policy Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6 text-center">
            <CheckCircle className="w-10 h-10 text-accent-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">30 jours</h3>
            <p className="text-gray-600 text-sm">Pour demander un remboursement</p>
          </div>
          <div className="card p-6 text-center">
            <Clock className="w-10 h-10 text-primary-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">5-7 jours</h3>
            <p className="text-gray-600 text-sm">Délai de traitement</p>
          </div>
          <div className="card p-6 text-center">
            <HelpCircle className="w-10 h-10 text-warning-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Support 24/7</h3>
            <p className="text-gray-600 text-sm">Équipe disponible</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Conditions */}
          <div className="card p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Conditions de remboursement</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Produit non conforme</p>
                  <p className="text-sm text-gray-600">Le produit ne correspond pas à la description</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Défaut technique majeur</p>
                  <p className="text-sm text-gray-600">Le produit présente des bugs empêchant son utilisation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Double achat</p>
                  <p className="text-sm text-gray-600">Vous avez acheté le même produit deux fois</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Non éligible au remboursement
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Produit déjà téléchargé et utilisé sans défaut avéré</li>
                <li>• Changement d'avis après l'achat</li>
                <li>• Incompatibilité avec un logiciel non mentionné</li>
                <li>• Demande après 30 jours</li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="card p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Demander un remboursement</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              
              <Input
                label="Numéro de commande"
                placeholder="THP-XXXXXX"
                value={formData.orderNumber}
                onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raison du remboursement
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Sélectionnez une raison</option>
                  <option value="not_as_described">Produit non conforme à la description</option>
                  <option value="technical_issue">Défaut technique majeur</option>
                  <option value="duplicate">Achat en double</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Détails
                </label>
                <textarea
                  rows={4}
                  placeholder="Décrivez votre problème en détail..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 resize-none"
                  required
                />
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Soumettre la demande
              </Button>
            </form>

            <p className="text-sm text-gray-500 mt-4 text-center">
              Une question ? <Link href="/contact" className="text-primary-600 hover:underline">Contactez-nous</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}







