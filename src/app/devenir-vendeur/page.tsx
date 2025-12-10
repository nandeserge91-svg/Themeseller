'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Check, 
  ArrowRight, 
  DollarSign, 
  Users, 
  Globe,
  Zap,
  Shield,
  TrendingUp,
  Star
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const benefits = [
  {
    icon: DollarSign,
    title: 'Commission attractive',
    description: 'Gardez 85% de chaque vente. Paiements mensuels sécurisés via Stripe.',
    gradient: 'from-accent-500 to-teal-500',
  },
  {
    icon: Globe,
    title: 'Audience mondiale',
    description: 'Accédez à des milliers d\'acheteurs francophones du monde entier.',
    gradient: 'from-primary-500 to-blue-500',
  },
  {
    icon: Zap,
    title: 'Publication rapide',
    description: 'Vos produits sont validés en moins de 24h par notre équipe.',
    gradient: 'from-warning-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Protection garantie',
    description: 'Vos créations sont protégées contre la copie et la redistribution.',
    gradient: 'from-secondary-500 to-purple-500',
  },
]

const stats = [
  { value: '12K+', label: 'Vendeurs actifs' },
  { value: '2M€+', label: 'Reversés aux créateurs' },
  { value: '500K+', label: 'Clients satisfaits' },
  { value: '4.8/5', label: 'Note moyenne' },
]

const steps = [
  { number: 1, title: 'Créez votre compte', description: 'Inscription gratuite en 2 minutes' },
  { number: 2, title: 'Ajoutez vos produits', description: 'Uploadez vos templates et fixez vos prix' },
  { number: 3, title: 'Recevez vos revenus', description: 'Paiements mensuels automatiques' },
]

export default function DevenirVendeurPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    storeName: '',
    bio: '',
    website: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated()) {
      toast.error('Veuillez vous connecter d\'abord')
      router.push('/connexion?redirect=/devenir-vendeur')
      return
    }

    if (!formData.storeName.trim()) {
      toast.error('Veuillez entrer un nom de boutique')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/vendor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      toast.success('Félicitations ! Votre compte vendeur a été créé.')
      router.push('/vendeur')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'inscription')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 top-0 w-96 h-96 rounded-full bg-white" />
          <div className="absolute -right-20 bottom-0 w-96 h-96 rounded-full bg-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6"
          >
            <Star className="w-4 h-4 fill-warning-400 text-warning-400" />
            Rejoignez 12 000+ créateurs
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-white mb-6"
          >
            Vendez vos templates
            <span className="block text-warning-400">et gagnez de l'argent</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/80 max-w-2xl mx-auto mb-10"
          >
            Transformez vos créations en revenus. Publiez vos thèmes, templates et tunnels de vente 
            sur la marketplace francophone #1.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="#inscription">
              <Button variant="accent" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Commencer gratuitement
              </Button>
            </a>
            <Link href="/produits">
              <Button variant="secondary" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Voir les produits
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi vendre sur Themeseller ?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Des outils puissants pour développer votre activité et maximiser vos revenus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-8 text-center group hover:shadow-glow"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${benefit.gradient} 
                              flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-gray-600 text-lg">
              3 étapes simples pour commencer à vendre
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-300 to-transparent" />
                )}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold shadow-glow">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Calculator */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Calculez vos revenus potentiels
          </h2>
          <p className="text-gray-400 mb-12">
            Avec une commission de seulement 15%, gardez la majorité de vos gains
          </p>

          <div className="card p-8 bg-white/5 backdrop-blur border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-gray-400 mb-2">Prix de vente</p>
                <p className="text-4xl font-bold text-white">59 €</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Ventes/mois</p>
                <p className="text-4xl font-bold text-white">×50</p>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Vos revenus</p>
                <p className="text-4xl font-bold text-accent-400">2 507 €</p>
                <p className="text-sm text-gray-500 mt-1">(85% de commission)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="inscription" className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Créez votre compte vendeur
            </h2>
            <p className="text-gray-600">
              Inscription gratuite, sans engagement
            </p>
          </div>

          <div className="card p-8">
            {user?.role === 'VENDOR' ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-100 flex items-center justify-center">
                  <Check className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Vous êtes déjà vendeur !
                </h3>
                <p className="text-gray-600 mb-6">
                  Accédez à votre tableau de bord pour gérer vos produits.
                </p>
                <Link href="/vendeur">
                  <Button>Accéder au dashboard</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isAuthenticated() && (
                  <div className="p-4 bg-primary-50 rounded-xl text-center">
                    <p className="text-primary-700 mb-3">
                      Vous devez d'abord créer un compte ou vous connecter.
                    </p>
                    <Link href="/connexion?redirect=/devenir-vendeur">
                      <Button variant="secondary" size="sm">
                        Se connecter / S'inscrire
                      </Button>
                    </Link>
                  </div>
                )}

                <Input
                  label="Nom de votre boutique"
                  placeholder="Ex: PixelCraft Studio"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  disabled={!isAuthenticated()}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio (optionnel)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Présentez-vous en quelques mots..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isAuthenticated()}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 resize-none"
                  />
                </div>

                <Input
                  label="Site web (optionnel)"
                  type="url"
                  placeholder="https://votre-site.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  disabled={!isAuthenticated()}
                />

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    disabled={!isAuthenticated()}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    J'accepte les{' '}
                    <Link href="/cgu-vendeur" className="text-primary-600 hover:underline">
                      Conditions générales de vente
                    </Link>{' '}
                    et je m'engage à respecter les règles de qualité de Themeseller.
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={isLoading}
                  disabled={!isAuthenticated()}
                >
                  Devenir vendeur
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}







