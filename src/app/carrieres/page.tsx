'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Clock, ArrowRight, Users, Heart, Zap, Globe } from 'lucide-react'
import Button from '@/components/ui/Button'

const jobs = [
  {
    id: '1',
    title: 'Développeur Full-Stack Senior',
    department: 'Engineering',
    location: 'Paris, France',
    type: 'CDI',
    description: 'Rejoignez notre équipe technique pour développer la prochaine génération de notre marketplace.',
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'Remote',
    type: 'CDI',
    description: 'Créez des expériences utilisateur exceptionnelles pour notre plateforme.',
  },
  {
    id: '3',
    title: 'Product Manager',
    department: 'Product',
    location: 'Paris, France',
    type: 'CDI',
    description: 'Définissez la vision produit et travaillez avec les équipes pour la concrétiser.',
  },
  {
    id: '4',
    title: 'Customer Success Manager',
    department: 'Support',
    location: 'Remote',
    type: 'CDI',
    description: 'Accompagnez nos vendeurs et clients pour maximiser leur succès sur ThemePro.',
  },
  {
    id: '5',
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'Paris, France',
    type: 'CDI',
    description: 'Développez et exécutez notre stratégie marketing pour accélérer la croissance.',
  },
]

const perks = [
  {
    icon: Globe,
    title: 'Remote-friendly',
    description: 'Travaillez d\'où vous voulez',
  },
  {
    icon: Heart,
    title: 'Mutuelle premium',
    description: '100% prise en charge',
  },
  {
    icon: Zap,
    title: 'Formation continue',
    description: 'Budget annuel dédié',
  },
  {
    icon: Users,
    title: 'Team building',
    description: 'Événements réguliers',
  },
]

export default function CarrieresPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 to-secondary-600 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
          >
            Rejoignez l'aventure ThemePro
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80 max-w-2xl mx-auto mb-8"
          >
            Construisez avec nous le futur du design web. Nous recherchons des talents 
            passionnés pour rejoindre notre équipe en pleine croissance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <a href="#jobs" className="btn-accent">
              Voir les offres
            </a>
          </motion.div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre culture</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Chez ThemePro, nous croyons que les meilleures idées viennent d'équipes 
                  diversifiées et passionnées. Nous cultivons un environnement où chacun 
                  peut s'épanouir et contribuer à notre mission.
                </p>
                <p>
                  Transparence, collaboration et innovation sont au cœur de tout ce que nous 
                  faisons. Nous encourageons la prise d'initiative et valorisons l'impact 
                  plutôt que la hiérarchie.
                </p>
              </div>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                alt="L'équipe ThemePro"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos avantages</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nous prenons soin de notre équipe avec des avantages pensés pour votre bien-être
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {perks.map((perk, index) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-100 flex items-center justify-center">
                  <perk.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{perk.title}</h3>
                <p className="text-gray-600 text-sm">{perk.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section id="jobs" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Postes ouverts</h2>
            <p className="text-gray-600">
              {jobs.length} offres disponibles
            </p>
          </div>

          <div className="space-y-4">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/carrieres/${job.id}`} className="card p-6 block hover:shadow-lg transition-shadow group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-medium text-primary-600 uppercase tracking-wider">
                        {job.department}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{job.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Vous ne trouvez pas le poste idéal ?
          </h2>
          <p className="text-white/80 mb-8">
            Envoyez-nous une candidature spontanée, nous sommes toujours à la recherche de talents.
          </p>
          <Link href="/contact">
            <Button variant="accent" size="lg">
              Candidature spontanée
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}







