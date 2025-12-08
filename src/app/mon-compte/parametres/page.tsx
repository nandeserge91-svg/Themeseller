'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Bell, CreditCard, Shield, Save, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const tabs = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'security', label: 'Sécurité', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'payment', label: 'Paiement', icon: CreditCard },
]

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [profile, setProfile] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
  })

  const [notifications, setNotifications] = useState({
    email_orders: true,
    email_promotions: false,
    email_newsletter: true,
    push_orders: true,
    push_messages: true,
  })

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Paramètres enregistrés !')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Paramètres du compte</h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Tabs */}
            <div className="md:w-48 flex-shrink-0">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="card p-6">
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-900">Informations personnelles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Prénom"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      />
                      <Input
                        label="Nom"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      />
                    </div>
                    <Input
                      label="Email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                    <Input
                      label="Téléphone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-900">Sécurité du compte</h2>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
                      <div className="space-y-4">
                        <div className="relative">
                          <Input
                            label="Mot de passe actuel"
                            type={showPassword ? 'text' : 'password'}
                          />
                        </div>
                        <Input
                          label="Nouveau mot de passe"
                          type={showPassword ? 'text' : 'password'}
                        />
                        <Input
                          label="Confirmer le nouveau mot de passe"
                          type={showPassword ? 'text' : 'password'}
                        />
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                          <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                            className="rounded"
                          />
                          Afficher les mots de passe
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <h3 className="font-medium text-gray-900 mb-4">
                        Authentification à deux facteurs
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Ajoutez une couche de sécurité supplémentaire à votre compte.
                      </p>
                      <Button variant="secondary" leftIcon={<Shield className="w-4 h-4" />}>
                        Activer la 2FA
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-900">Préférences de notifications</h2>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">Notifications par email</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700">Commandes et téléchargements</span>
                          <input
                            type="checkbox"
                            checked={notifications.email_orders}
                            onChange={(e) => setNotifications({ ...notifications, email_orders: e.target.checked })}
                            className="toggle"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700">Promotions et offres spéciales</span>
                          <input
                            type="checkbox"
                            checked={notifications.email_promotions}
                            onChange={(e) => setNotifications({ ...notifications, email_promotions: e.target.checked })}
                            className="toggle"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700">Newsletter</span>
                          <input
                            type="checkbox"
                            checked={notifications.email_newsletter}
                            onChange={(e) => setNotifications({ ...notifications, email_newsletter: e.target.checked })}
                            className="toggle"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <h3 className="font-medium text-gray-900 mb-4">Notifications push</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700">Mises à jour de commandes</span>
                          <input
                            type="checkbox"
                            checked={notifications.push_orders}
                            onChange={(e) => setNotifications({ ...notifications, push_orders: e.target.checked })}
                            className="toggle"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700">Messages vendeurs</span>
                          <input
                            type="checkbox"
                            checked={notifications.push_messages}
                            onChange={(e) => setNotifications({ ...notifications, push_messages: e.target.checked })}
                            className="toggle"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'payment' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-bold text-gray-900">Méthodes de paiement</h2>
                    
                    <div className="card bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
                            VISA
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                            <p className="text-sm text-gray-500">Expire 12/25</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                          Par défaut
                        </span>
                      </div>
                    </div>

                    <Button variant="secondary" leftIcon={<CreditCard className="w-4 h-4" />}>
                      Ajouter une carte
                    </Button>

                    <div className="pt-6 border-t border-gray-100">
                      <h3 className="font-medium text-gray-900 mb-4">Adresse de facturation</h3>
                      <div className="space-y-4">
                        <Input label="Adresse" placeholder="123 Rue de Paris" />
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="Ville" placeholder="Paris" />
                          <Input label="Code postal" placeholder="75001" />
                        </div>
                        <Input label="Pays" placeholder="France" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <Button 
                    onClick={handleSave} 
                    isLoading={isLoading}
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    Enregistrer les modifications
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}







