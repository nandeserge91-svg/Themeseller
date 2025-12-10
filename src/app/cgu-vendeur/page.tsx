'use client'

import { motion } from 'framer-motion'

export default function CGUVendeurPage() {
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
            Conditions Générales pour les Vendeurs
          </motion.h1>
          <p className="text-white/80 mt-2">Dernière mise à jour : 1er janvier 2024</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card p-8 prose prose-gray max-w-none">
          <h2>1. Devenir vendeur</h2>
          <p>
            Pour devenir vendeur sur Themeseller, vous devez créer un compte et soumettre une demande 
            d'inscription au programme vendeur. Themeseller se réserve le droit d'accepter ou de refuser 
            toute demande à sa seule discrétion.
          </p>

          <h2>2. Conditions d'éligibilité</h2>
          <ul>
            <li>Être majeur et avoir la capacité juridique de contracter</li>
            <li>Disposer d'un statut légal permettant l'exercice d'une activité commerciale</li>
            <li>Fournir des informations exactes et vérifiables</li>
            <li>Respecter la législation en vigueur dans votre pays de résidence</li>
          </ul>

          <h2>3. Obligations des vendeurs</h2>
          
          <h3>3.1 Qualité des produits</h3>
          <p>Le vendeur s'engage à :</p>
          <ul>
            <li>Proposer des produits originaux dont il détient les droits</li>
            <li>Fournir des fichiers de qualité, fonctionnels et bien documentés</li>
            <li>Assurer un support client réactif pour ses produits</li>
            <li>Mettre à jour ses produits régulièrement</li>
          </ul>

          <h3>3.2 Contenu interdit</h3>
          <p>Sont strictement interdits :</p>
          <ul>
            <li>Les contenus plagiés ou violant des droits d'auteur</li>
            <li>Les contenus illégaux, offensants ou discriminatoires</li>
            <li>Les logiciels malveillants ou code nuisible</li>
            <li>Les produits nulled ou piratés</li>
          </ul>

          <h2>4. Tarification et commissions</h2>
          <p>
            Le vendeur fixe librement le prix de ses produits dans le respect des prix minimums 
            définis par Themeseller. Une commission de 15% est prélevée sur chaque vente.
          </p>
          <table className="w-full">
            <thead>
              <tr>
                <th>Niveau vendeur</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Standard</td>
                <td>15%</td>
              </tr>
              <tr>
                <td>Pro (50+ ventes)</td>
                <td>12%</td>
              </tr>
              <tr>
                <td>Elite (200+ ventes)</td>
                <td>10%</td>
              </tr>
            </tbody>
          </table>

          <h2>5. Paiements</h2>
          <p>
            Les paiements sont effectués mensuellement via Stripe Connect ou virement bancaire, 
            sous réserve d'avoir atteint le seuil minimum de 50€. Les paiements interviennent 
            le 15 de chaque mois pour les ventes du mois précédent.
          </p>

          <h2>6. Fiscalité</h2>
          <p>
            Le vendeur est seul responsable de ses obligations fiscales et sociales. Themeseller 
            transmet les informations requises aux autorités fiscales conformément à la législation 
            en vigueur.
          </p>

          <h2>7. Propriété intellectuelle</h2>
          <p>
            En publiant un produit sur Themeseller, le vendeur garantit détenir tous les droits 
            nécessaires. Le vendeur accorde à Themeseller une licence non-exclusive pour afficher 
            et promouvoir ses produits sur la plateforme.
          </p>

          <h2>8. Résiliation</h2>
          <p>
            Le vendeur peut fermer son compte à tout moment. Themeseller peut suspendre ou résilier 
            un compte vendeur en cas de violation des présentes conditions, sans préavis ni 
            indemnité.
          </p>

          <h2>9. Modification des conditions</h2>
          <p>
            Themeseller se réserve le droit de modifier ces conditions à tout moment. Les vendeurs 
            seront notifiés par email au moins 30 jours avant l'entrée en vigueur des modifications.
          </p>

          <h2>10. Contact</h2>
          <p>
            Pour toute question : 
            <a href="mailto:vendeurs@themepro.fr" className="text-primary-600"> vendeurs@themepro.fr</a>
          </p>
        </div>
      </div>
    </div>
  )
}







