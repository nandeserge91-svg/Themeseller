'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

const faqCategories = [
  {
    name: 'Général',
    questions: [
      {
        q: "Qu'est-ce que ThemePro ?",
        a: "ThemePro est une marketplace francophone qui propose des thèmes, templates et tunnels de vente premium créés par des designers et développeurs talentueux. Nous offrons une large sélection de produits de qualité pour tous types de projets web."
      },
      {
        q: "Comment fonctionne ThemePro ?",
        a: "C'est simple ! Parcourez notre catalogue, choisissez les templates qui vous intéressent, ajoutez-les au panier et procédez au paiement. Après l'achat, vous pouvez télécharger immédiatement vos fichiers depuis votre espace client."
      },
      {
        q: "Les templates sont-ils de qualité ?",
        a: "Oui ! Chaque template est vérifié par notre équipe avant publication. Nous nous assurons que le code est propre, bien documenté et conforme à nos standards de qualité."
      },
    ]
  },
  {
    name: 'Achats & Paiements',
    questions: [
      {
        q: "Quels moyens de paiement acceptez-vous ?",
        a: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal et Apple Pay via notre partenaire de paiement sécurisé Stripe."
      },
      {
        q: "Puis-je obtenir un remboursement ?",
        a: "Oui, nous offrons une garantie de remboursement de 30 jours si le produit ne correspond pas à la description ou présente des défauts majeurs. Contactez notre support pour toute demande."
      },
      {
        q: "Les prix incluent-ils la TVA ?",
        a: "Les prix affichés sont TTC pour les clients européens. La TVA applicable dépend de votre pays de résidence."
      },
    ]
  },
  {
    name: 'Téléchargements & Licences',
    questions: [
      {
        q: "Combien de fois puis-je télécharger un produit ?",
        a: "Vous disposez de 5 téléchargements par produit acheté. Si vous avez besoin de téléchargements supplémentaires, contactez notre support."
      },
      {
        q: "Quelle licence est incluse ?",
        a: "Chaque achat inclut une licence commerciale standard qui vous permet d'utiliser le template pour un projet client ou personnel. Pour des utilisations multiples, consultez les options de licence étendue."
      },
      {
        q: "Les mises à jour sont-elles gratuites ?",
        a: "Oui ! Toutes les futures mises à jour du template sont incluses gratuitement dans votre achat."
      },
    ]
  },
  {
    name: 'Vendeurs',
    questions: [
      {
        q: "Comment devenir vendeur sur ThemePro ?",
        a: "Créez un compte, puis accédez à la page 'Devenir vendeur' pour compléter votre profil. Une fois validé, vous pourrez publier vos templates."
      },
      {
        q: "Quelle est la commission de ThemePro ?",
        a: "ThemePro prélève une commission de 15% sur chaque vente. Vous conservez 85% du prix de vente."
      },
      {
        q: "Quand suis-je payé ?",
        a: "Les paiements sont effectués mensuellement via Stripe Connect, à condition d'avoir atteint le seuil minimum de 50€."
      },
    ]
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const filteredCategories = faqCategories.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0)

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
            Foire Aux Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg mb-8"
          >
            Trouvez rapidement des réponses à vos questions
          </motion.p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une question..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white shadow-lg focus:ring-4 focus:ring-white/30"
            />
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredCategories.map((category) => (
          <div key={category.name} className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{category.name}</h2>
            <div className="space-y-3">
              {category.questions.map((item, index) => {
                const id = `${category.name}-${index}`
                const isOpen = openItems.includes(id)
                
                return (
                  <div key={id} className="card overflow-hidden">
                    <button
                      onClick={() => toggleItem(id)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left"
                    >
                      <span className="font-medium text-gray-900 pr-4">{item.q}</span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-4 text-gray-600">{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Aucune question ne correspond à votre recherche.</p>
            <Button variant="secondary" onClick={() => setSearchQuery('')}>
              Voir toutes les questions
            </Button>
          </div>
        )}

        {/* Contact CTA */}
        <div className="card p-8 bg-gradient-to-r from-primary-50 to-secondary-50 text-center mt-12">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Vous n'avez pas trouvé votre réponse ?
          </h3>
          <p className="text-gray-600 mb-6">
            Notre équipe support est là pour vous aider.
          </p>
          <Link href="/contact">
            <Button>Contactez-nous</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}







