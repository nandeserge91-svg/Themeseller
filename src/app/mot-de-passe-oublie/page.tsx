'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitted(true)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card p-8">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Mot de passe oublié ?
                </h1>
                <p className="text-gray-600">
                  Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Adresse email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Envoyer le lien
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-accent-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Email envoyé !
              </h2>
              <p className="text-gray-600 mb-6">
                Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez 
                un email avec les instructions pour réinitialiser votre mot de passe.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                N'oubliez pas de vérifier votre dossier spam si vous ne le trouvez pas.
              </p>
              <Button
                variant="secondary"
                onClick={() => setIsSubmitted(false)}
                className="w-full"
              >
                Envoyer à une autre adresse
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link 
              href="/connexion" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}







