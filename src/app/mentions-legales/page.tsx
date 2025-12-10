'use client'

import { motion } from 'framer-motion'

export default function MentionsLegalesPage() {
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
            Mentions Légales
          </motion.h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card p-8 prose prose-gray max-w-none">
          <h2>1. Éditeur du site</h2>
          <p>
            Le site Themeseller est édité par :<br />
            <strong>Themeseller SAS</strong><br />
            Capital social : 10 000 €<br />
            Siège social : 123 Avenue des Champs-Élysées, 75008 Paris, France<br />
            RCS Paris : 123 456 789<br />
            N° TVA intracommunautaire : FR12345678900<br />
            Directeur de la publication : Marie Dupont
          </p>

          <h2>2. Hébergement</h2>
          <p>
            Le site est hébergé par :<br />
            <strong>Vercel Inc.</strong><br />
            340 S Lemon Ave #4133<br />
            Walnut, CA 91789, États-Unis
          </p>

          <h2>3. Contact</h2>
          <p>
            Email : <a href="mailto:contact@themepro.fr" className="text-primary-600">contact@themepro.fr</a><br />
            Téléphone : +33 1 23 45 67 89
          </p>

          <h2>4. Propriété intellectuelle</h2>
          <p>
            L'ensemble des éléments constituant le site Themeseller (textes, graphismes, logiciels, 
            photographies, images, vidéos, sons, plans, logos, marques, etc.) ainsi que le site 
            lui-même, sont protégés par les dispositions du Code de la propriété intellectuelle.
          </p>
          <p>
            Toute reproduction, représentation, modification, publication, adaptation de tout ou 
            partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, 
            sauf autorisation écrite préalable de Themeseller.
          </p>

          <h2>5. Données personnelles</h2>
          <p>
            Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au 
            Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit 
            d'accès, de rectification et de suppression des données vous concernant.
          </p>
          <p>
            Pour exercer ce droit, contactez-nous à : 
            <a href="mailto:dpo@themepro.fr" className="text-primary-600"> dpo@themepro.fr</a>
          </p>

          <h2>6. Cookies</h2>
          <p>
            Le site Themeseller utilise des cookies pour améliorer l'expérience utilisateur. 
            Pour plus d'informations, consultez notre politique de cookies.
          </p>

          <h2>7. Limitation de responsabilité</h2>
          <p>
            Themeseller s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour 
            des informations diffusées sur ce site. Toutefois, Themeseller ne peut garantir l'exactitude, 
            la précision ou l'exhaustivité des informations mises à disposition sur ce site.
          </p>

          <h2>8. Liens hypertextes</h2>
          <p>
            Le site peut contenir des liens vers d'autres sites. Themeseller n'exerce aucun contrôle 
            sur ces sites et décline toute responsabilité quant à leur contenu.
          </p>

          <h2>9. Droit applicable</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. En cas de litige, 
            les tribunaux français seront seuls compétents.
          </p>
        </div>
      </div>
    </div>
  )
}







