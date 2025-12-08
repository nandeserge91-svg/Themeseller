'use client'

import { motion } from 'framer-motion'

export default function ConfidentialitePage() {
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
            Politique de Confidentialité
          </motion.h1>
          <p className="text-white/80 mt-2">Dernière mise à jour : 1er janvier 2024</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card p-8 prose prose-gray max-w-none">
          <h2>1. Introduction</h2>
          <p>
            ThemePro (ci-après "nous") s'engage à protéger la vie privée des utilisateurs de 
            sa plateforme. Cette politique de confidentialité explique comment nous collectons, 
            utilisons et protégeons vos données personnelles.
          </p>

          <h2>2. Données collectées</h2>
          <p>Nous collectons les types de données suivants :</p>
          <ul>
            <li><strong>Données d'identification :</strong> nom, prénom, email, mot de passe</li>
            <li><strong>Données de facturation :</strong> adresse, informations de paiement</li>
            <li><strong>Données de navigation :</strong> adresse IP, cookies, historique de navigation</li>
            <li><strong>Données de transaction :</strong> historique d'achats, téléchargements</li>
          </ul>

          <h2>3. Utilisation des données</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul>
            <li>Gérer votre compte et vos commandes</li>
            <li>Traiter les paiements</li>
            <li>Vous envoyer des communications relatives à vos achats</li>
            <li>Améliorer nos services</li>
            <li>Personnaliser votre expérience</li>
            <li>Respecter nos obligations légales</li>
          </ul>

          <h2>4. Partage des données</h2>
          <p>
            Nous ne vendons pas vos données personnelles. Nous pouvons les partager avec :
          </p>
          <ul>
            <li>Nos prestataires de services (paiement, hébergement, email)</li>
            <li>Les vendeurs concernés par vos achats</li>
            <li>Les autorités compétentes si requis par la loi</li>
          </ul>

          <h2>5. Sécurité des données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données 
            contre l'accès non autorisé, la modification, la divulgation ou la destruction. 
            Les paiements sont sécurisés via Stripe.
          </p>

          <h2>6. Cookies</h2>
          <p>
            Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez gérer vos 
            préférences de cookies dans les paramètres de votre navigateur.
          </p>

          <h2>7. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d'opposition</li>
            <li>Droit de limitation du traitement</li>
          </ul>

          <h2>8. Conservation des données</h2>
          <p>
            Vos données sont conservées pendant la durée de votre compte et jusqu'à 5 ans après 
            sa suppression pour les obligations légales et comptables.
          </p>

          <h2>9. Contact</h2>
          <p>
            Pour exercer vos droits ou poser des questions sur vos données personnelles, 
            contactez notre Délégué à la Protection des Données : 
            <a href="mailto:dpo@themepro.fr" className="text-primary-600"> dpo@themepro.fr</a>
          </p>
        </div>
      </div>
    </div>
  )
}







