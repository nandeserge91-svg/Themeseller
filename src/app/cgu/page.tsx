'use client'

import { motion } from 'framer-motion'

export default function CGUPage() {
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
            Conditions Générales d'Utilisation
          </motion.h1>
          <p className="text-white/80 mt-2">Dernière mise à jour : 1er janvier 2024</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card p-8 prose prose-gray max-w-none">
          <h2>1. Objet</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (ci-après "CGU") ont pour objet de définir 
            les modalités et conditions d'utilisation de la plateforme ThemePro (ci-après "la Plateforme"), 
            ainsi que les droits et obligations des utilisateurs.
          </p>

          <h2>2. Acceptation des CGU</h2>
          <p>
            L'accès et l'utilisation de la Plateforme sont subordonnés à l'acceptation et au respect 
            des présentes CGU. En accédant à la Plateforme, l'utilisateur accepte sans réserve les 
            présentes conditions.
          </p>

          <h2>3. Description des services</h2>
          <p>
            ThemePro est une marketplace permettant :
          </p>
          <ul>
            <li>Aux acheteurs d'acquérir des templates, thèmes et tunnels de vente numériques</li>
            <li>Aux vendeurs de commercialiser leurs créations numériques</li>
            <li>La mise en relation entre acheteurs et vendeurs</li>
          </ul>

          <h2>4. Inscription et compte utilisateur</h2>
          <p>
            Pour utiliser certains services de la Plateforme, l'utilisateur doit créer un compte. 
            Il s'engage à fournir des informations exactes et à les maintenir à jour. L'utilisateur 
            est responsable de la confidentialité de ses identifiants de connexion.
          </p>

          <h2>5. Propriété intellectuelle</h2>
          <p>
            Tous les contenus présents sur la Plateforme (logos, textes, éléments graphiques, etc.) 
            sont protégés par le droit de la propriété intellectuelle. Toute reproduction non autorisée 
            constitue une contrefaçon.
          </p>
          <p>
            Les produits achetés sont soumis à des licences spécifiques définissant les droits 
            d'utilisation accordés à l'acheteur.
          </p>

          <h2>6. Responsabilités</h2>
          <p>
            ThemePro s'efforce d'assurer la disponibilité de la Plateforme mais ne peut garantir 
            un accès ininterrompu. ThemePro n'est pas responsable des contenus publiés par les 
            vendeurs ni des transactions entre utilisateurs.
          </p>

          <h2>7. Données personnelles</h2>
          <p>
            Le traitement des données personnelles est régi par notre Politique de Confidentialité. 
            L'utilisateur dispose d'un droit d'accès, de rectification et de suppression de ses données.
          </p>

          <h2>8. Modification des CGU</h2>
          <p>
            ThemePro se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs 
            seront informés des modifications par email ou notification sur la Plateforme.
          </p>

          <h2>9. Droit applicable</h2>
          <p>
            Les présentes CGU sont régies par le droit français. Tout litige sera soumis aux 
            tribunaux compétents de Paris.
          </p>

          <h2>10. Contact</h2>
          <p>
            Pour toute question concernant les présentes CGU, vous pouvez nous contacter à : 
            <a href="mailto:legal@themepro.fr" className="text-primary-600"> legal@themepro.fr</a>
          </p>
        </div>
      </div>
    </div>
  )
}







