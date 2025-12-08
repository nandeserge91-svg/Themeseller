'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Search, 
  ShoppingCart, 
  Download, 
  CreditCard, 
  User, 
  Shield, 
  FileText,
  HelpCircle,
  ArrowRight
} from 'lucide-react'

const helpCategories = [
  {
    icon: ShoppingCart,
    title: 'Achats',
    description: 'Comment acheter, panier, codes promo',
    links: [
      { title: 'Comment acheter un template', href: '/aide/acheter' },
      { title: 'Utiliser un code promo', href: '/aide/promo' },
      { title: 'Historique des commandes', href: '/aide/commandes' },
    ],
  },
  {
    icon: Download,
    title: 'Téléchargements',
    description: 'Accéder et télécharger vos fichiers',
    links: [
      { title: 'Télécharger vos achats', href: '/aide/telecharger' },
      { title: 'Limite de téléchargements', href: '/aide/limites' },
      { title: 'Problèmes de téléchargement', href: '/aide/problemes' },
    ],
  },
  {
    icon: CreditCard,
    title: 'Paiements',
    description: 'Moyens de paiement, factures, remboursements',
    links: [
      { title: 'Moyens de paiement acceptés', href: '/aide/paiements' },
      { title: 'Obtenir une facture', href: '/aide/factures' },
      { title: 'Demander un remboursement', href: '/remboursement' },
    ],
  },
  {
    icon: User,
    title: 'Mon Compte',
    description: 'Gérer votre profil et paramètres',
    links: [
      { title: 'Modifier mon profil', href: '/aide/profil' },
      { title: 'Changer mon mot de passe', href: '/aide/mot-de-passe' },
      { title: 'Supprimer mon compte', href: '/aide/supprimer' },
    ],
  },
  {
    icon: Shield,
    title: 'Licences',
    description: 'Comprendre les droits d\'utilisation',
    links: [
      { title: 'Types de licences', href: '/aide/licences' },
      { title: 'Licence standard vs étendue', href: '/aide/licence-etendue' },
      { title: 'Utilisation commerciale', href: '/aide/commercial' },
    ],
  },
  {
    icon: FileText,
    title: 'Vendeurs',
    description: 'Devenir vendeur et gérer votre boutique',
    links: [
      { title: 'Devenir vendeur', href: '/devenir-vendeur' },
      { title: 'Publier un produit', href: '/aide/publier' },
      { title: 'Recevoir mes paiements', href: '/aide/paiements-vendeur' },
    ],
  },
]

export default function AidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display font-bold text-white mb-4"
          >
            Centre d'Aide
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg mb-8"
          >
            Comment pouvons-nous vous aider aujourd'hui ?
          </motion.p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans l'aide..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white shadow-lg focus:ring-4 focus:ring-white/30"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {helpCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
                <category.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{category.description}</p>
              <ul className="space-y-2">
                {category.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-primary-600 hover:text-primary-700 text-sm flex items-center group"
                    >
                      {link.title}
                      <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/faq" className="card p-6 hover:shadow-lg transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning-100 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-primary-600">FAQ</h3>
                <p className="text-gray-600 text-sm">Questions fréquemment posées</p>
              </div>
            </div>
          </Link>
          <Link href="/contact" className="card p-6 hover:shadow-lg transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
                <Search className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-primary-600">Contact</h3>
                <p className="text-gray-600 text-sm">Parlez à notre équipe support</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}







