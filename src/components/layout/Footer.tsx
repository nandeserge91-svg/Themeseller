import Link from 'next/link'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail,
  MapPin,
  Phone
} from 'lucide-react'

const footerLinks = {
  produits: [
    { name: 'Thèmes WordPress', href: '/categorie/wordpress' },
    { name: 'Thèmes Shopify', href: '/categorie/shopify' },
    { name: 'Templates Systeme.io', href: '/categorie/systeme-io' },
    { name: 'Templates HTML', href: '/categorie/html' },
    { name: 'Designs Figma', href: '/categorie/figma' },
    { name: 'Tunnels de Vente', href: '/categorie/funnels' },
  ],
  entreprise: [
    { name: 'À propos', href: '/a-propos' },
    { name: 'Devenir vendeur', href: '/devenir-vendeur' },
    { name: 'Blog', href: '/blog' },
    { name: 'Carrières', href: '/carrieres' },
    { name: 'Contact', href: '/contact' },
  ],
  support: [
    { name: 'Centre d\'aide', href: '/aide' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Politique de remboursement', href: '/remboursement' },
    { name: 'Signaler un problème', href: '/signaler' },
  ],
  legal: [
    { name: 'Conditions d\'utilisation', href: '/cgu' },
    { name: 'Politique de confidentialité', href: '/confidentialite' },
    { name: 'Mentions légales', href: '/mentions-legales' },
    { name: 'Cookies', href: '/cookies' },
  ],
}

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Restez informé des nouveautés
              </h3>
              <p className="text-white/80">
                Inscrivez-vous pour recevoir les derniers templates et offres exclusives
              </p>
            </div>
            <form className="flex w-full max-w-md gap-2">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 
                         placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button type="submit" className="btn-accent">
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-display font-bold text-xl">
                Theme<span className="text-primary-400">seller</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-6">
              La marketplace francophone #1 pour les thèmes, templates et tunnels de vente premium.
            </p>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-400" />
                Paris, France
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400" />
                contact@themepro.fr
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400" />
                +33 1 23 45 67 89
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produits</h4>
            <ul className="space-y-3">
              {footerLinks.produits.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.entreprise.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Légal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Themeseller. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                aria-label={social.name}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

