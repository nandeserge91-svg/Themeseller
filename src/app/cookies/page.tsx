'use client'

import { motion } from 'framer-motion'

export default function CookiesPage() {
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
            Politique de Cookies
          </motion.h1>
          <p className="text-white/80 mt-2">Dernière mise à jour : 1er janvier 2024</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card p-8 prose prose-gray max-w-none">
          <h2>1. Qu'est-ce qu'un cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, tablette, 
            smartphone) lors de la visite d'un site web. Il permet de stocker des informations 
            relatives à votre navigation.
          </p>

          <h2>2. Types de cookies utilisés</h2>
          
          <h3>Cookies essentiels</h3>
          <p>
            Ces cookies sont nécessaires au fonctionnement du site. Ils permettent d'utiliser les 
            fonctionnalités principales comme la navigation, l'accès aux zones sécurisées, le panier 
            d'achats, etc. Sans ces cookies, le site ne peut pas fonctionner correctement.
          </p>

          <h3>Cookies de performance</h3>
          <p>
            Ces cookies collectent des informations sur la façon dont les visiteurs utilisent le site 
            (pages visitées, temps passé, erreurs rencontrées). Ces données nous aident à améliorer 
            les performances du site.
          </p>

          <h3>Cookies de fonctionnalité</h3>
          <p>
            Ces cookies permettent de mémoriser vos préférences (langue, région, paramètres d'affichage) 
            pour personnaliser votre expérience.
          </p>

          <h3>Cookies de ciblage/publicité</h3>
          <p>
            Ces cookies sont utilisés pour afficher des publicités pertinentes selon vos centres 
            d'intérêt. Ils servent également à limiter le nombre de fois que vous voyez une publicité 
            et à mesurer l'efficacité des campagnes publicitaires.
          </p>

          <h2>3. Liste des cookies utilisés</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Finalité</th>
                <th>Durée</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>session_id</td>
                <td>Maintien de la session utilisateur</td>
                <td>Session</td>
              </tr>
              <tr>
                <td>auth_token</td>
                <td>Authentification</td>
                <td>7 jours</td>
              </tr>
              <tr>
                <td>cart</td>
                <td>Panier d'achats</td>
                <td>30 jours</td>
              </tr>
              <tr>
                <td>preferences</td>
                <td>Préférences utilisateur</td>
                <td>1 an</td>
              </tr>
              <tr>
                <td>_ga</td>
                <td>Google Analytics</td>
                <td>2 ans</td>
              </tr>
            </tbody>
          </table>

          <h2>4. Gestion des cookies</h2>
          <p>
            Vous pouvez à tout moment modifier vos préférences en matière de cookies :
          </p>
          <ul>
            <li>Via le bandeau cookies affiché lors de votre première visite</li>
            <li>Via les paramètres de votre navigateur</li>
          </ul>

          <h3>Paramètres navigateur</h3>
          <ul>
            <li><strong>Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</li>
            <li><strong>Firefox :</strong> Options → Vie privée et sécurité → Cookies</li>
            <li><strong>Safari :</strong> Préférences → Confidentialité → Cookies</li>
            <li><strong>Edge :</strong> Paramètres → Cookies et autorisations de site</li>
          </ul>

          <h2>5. Conséquences du refus des cookies</h2>
          <p>
            Si vous refusez les cookies essentiels, certaines fonctionnalités du site pourraient 
            ne pas fonctionner correctement. Le refus des autres cookies n'affectera pas votre 
            navigation mais pourrait limiter la personnalisation de votre expérience.
          </p>

          <h2>6. Contact</h2>
          <p>
            Pour toute question concernant notre politique de cookies, contactez-nous à : 
            <a href="mailto:privacy@themepro.fr" className="text-primary-600"> privacy@themepro.fr</a>
          </p>
        </div>
      </div>
    </div>
  )
}







