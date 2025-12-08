'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Flag, Shield, FileWarning } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function SignalerPage() {
  const [formData, setFormData] = useState({
    type: '',
    url: '',
    email: '',
    description: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success('Signalement envoyé ! Nous allons examiner votre rapport.')
    setFormData({ type: '', url: '', email: '', description: '' })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
              <Flag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Signaler un problème
            </h1>
            <p className="text-white/80">
              Aidez-nous à maintenir ThemePro sûr et respectueux
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Cards */}
          <div className="space-y-4">
            <div className="card p-5">
              <AlertTriangle className="w-8 h-8 text-warning-500 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Contenu inapproprié</h3>
              <p className="text-gray-600 text-sm">
                Signalez tout contenu offensant, illégal ou violant nos conditions.
              </p>
            </div>
            <div className="card p-5">
              <Shield className="w-8 h-8 text-primary-500 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Violation de droits</h3>
              <p className="text-gray-600 text-sm">
                Signalez le plagiat ou l'utilisation non autorisée de propriété intellectuelle.
              </p>
            </div>
            <div className="card p-5">
              <FileWarning className="w-8 h-8 text-red-500 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Arnaque ou fraude</h3>
              <p className="text-gray-600 text-sm">
                Signalez les comportements frauduleux ou les tentatives d'escroquerie.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Formulaire de signalement</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de signalement *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="inappropriate">Contenu inapproprié</option>
                    <option value="copyright">Violation de droits d'auteur</option>
                    <option value="fraud">Arnaque ou fraude</option>
                    <option value="quality">Problème de qualité</option>
                    <option value="abuse">Comportement abusif</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <Input
                  label="URL du contenu (optionnel)"
                  placeholder="https://themepro.fr/produit/..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />

                <Input
                  label="Votre email *"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description détaillée *
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Décrivez le problème en détail. Incluez toute information pertinente..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 resize-none"
                    required
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                  <strong>Note :</strong> Les signalements abusifs ou de mauvaise foi pourront 
                  entraîner des sanctions sur votre compte.
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Envoyer le signalement
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}







