'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, Shield, Zap, Heart, Award, Globe } from 'lucide-react'
import Button from '@/components/ui/Button'

const stats = [
  { value: '50K+', label: 'Templates' },
  { value: '12K+', label: 'Vendeurs' },
  { value: '500K+', label: 'Clients' },
  { value: '98%', label: 'Satisfaction' },
]

const values = [
  {
    icon: Shield,
    title: 'Qualité Premium',
    description: 'Chaque template est vérifié par notre équipe avant publication.',
  },
  {
    icon: Users,
    title: 'Communauté',
    description: 'Une communauté de créateurs passionnés du monde francophone.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'Les dernières technologies et tendances du design web.',
  },
  {
    icon: Heart,
    title: 'Support',
    description: 'Un accompagnement personnalisé pour chaque utilisateur.',
  },
]

const team = [
  {
    name: 'Marie Dupont',
    role: 'CEO & Fondatrice',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
  },
  {
    name: 'Pierre Martin',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
  },
  {
    name: 'Sophie Bernard',
    role: 'Head of Design',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
  },
  {
    name: 'Lucas Moreau',
    role: 'Head of Sales',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
  },
]

export default function AProposPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 to-secondary-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
          >
            À propos de ThemePro
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80 max-w-3xl mx-auto"
          >
            La marketplace francophone #1 pour les thèmes, templates et tunnels de vente premium.
            Notre mission : démocratiser l'accès au design web professionnel.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl font-bold gradient-text">{stat.value}</p>
                <p className="text-gray-600 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Histoire</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  ThemePro est né en 2020 d'une vision simple : créer la marketplace de référence 
                  pour le marché francophone. Face à la domination des plateformes anglophones, 
                  nous avons voulu offrir une alternative locale, adaptée aux besoins spécifiques 
                  de notre communauté.
                </p>
                <p>
                  Aujourd'hui, ThemePro réunit plus de 12 000 créateurs talentueux et sert 
                  plus de 500 000 clients dans le monde entier. Notre catalogue compte plus 
                  de 50 000 templates de qualité premium.
                </p>
                <p>
                  Notre engagement : offrir les meilleurs templates au meilleur prix, avec 
                  un support en français et une expérience utilisateur irréprochable.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-2xl overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                alt="L'équipe ThemePro"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ce qui nous guide au quotidien dans notre mission
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Équipe</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Des passionnés dédiés à votre réussite
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Rejoignez l'aventure ThemePro
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Que vous soyez créateur ou acheteur, ThemePro est fait pour vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/devenir-vendeur">
              <Button variant="accent" size="lg">Devenir vendeur</Button>
            </Link>
            <Link href="/produits">
              <Button variant="secondary" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Explorer les produits
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}







