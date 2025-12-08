'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'contact@themepro.fr',
    link: 'mailto:contact@themepro.fr',
  },
  {
    icon: Phone,
    title: 'Téléphone',
    value: '+33 1 23 45 67 89',
    link: 'tel:+33123456789',
  },
  {
    icon: MapPin,
    title: 'Adresse',
    value: 'Paris, France',
    link: '#',
  },
  {
    icon: Clock,
    title: 'Horaires',
    value: 'Lun-Ven: 9h-18h',
    link: '#',
  },
]

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success('Message envoyé avec succès !')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display font-bold text-white mb-4"
          >
            Contactez-nous
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            Une question ? Notre équipe est là pour vous aider.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos coordonnées</h2>
            
            {contactInfo.map((info) => (
              <a
                key={info.title}
                href={info.link}
                className="card p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                  <info.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{info.title}</p>
                  <p className="font-medium text-gray-900">{info.value}</p>
                </div>
              </a>
            ))}

            <div className="card p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
              <MessageSquare className="w-8 h-8 text-primary-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Chat en direct</h3>
              <p className="text-gray-600 text-sm mb-4">
                Besoin d'une réponse rapide ? Notre équipe est disponible en chat.
              </p>
              <Button variant="primary" size="sm">
                Démarrer un chat
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Nom complet"
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="jean@exemple.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Sujet"
                  placeholder="Comment pouvons-nous vous aider ?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Décrivez votre demande en détail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full md:w-auto"
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Envoyer le message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}







