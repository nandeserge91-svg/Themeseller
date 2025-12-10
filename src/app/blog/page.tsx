'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, ArrowRight, Search } from 'lucide-react'
import Button from '@/components/ui/Button'

const articles = [
  {
    id: '1',
    slug: 'tendances-web-design-2024',
    title: 'Les 10 tendances web design à suivre en 2024',
    excerpt: 'Découvrez les tendances qui vont marquer le design web cette année : minimalisme, dark mode, micro-interactions...',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=500&fit=crop',
    author: 'Marie Dupont',
    date: '15 Jan 2024',
    readTime: '5 min',
    category: 'Design',
  },
  {
    id: '2',
    slug: 'optimiser-conversion-landing-page',
    title: 'Comment optimiser votre landing page pour maximiser les conversions',
    excerpt: "Les meilleures pratiques pour créer une landing page qui convertit : CTA, social proof, structure...",
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
    author: 'Pierre Martin',
    date: '12 Jan 2024',
    readTime: '8 min',
    category: 'Marketing',
  },
  {
    id: '3',
    slug: 'wordpress-vs-html-templates',
    title: 'WordPress vs HTML : quel type de template choisir ?',
    excerpt: 'Comparatif complet pour vous aider à choisir entre un thème WordPress et un template HTML selon vos besoins.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop',
    author: 'Lucas Moreau',
    date: '10 Jan 2024',
    readTime: '6 min',
    category: 'Tutoriels',
  },
  {
    id: '4',
    slug: 'creer-tunnel-vente-efficace',
    title: 'Guide complet : créer un tunnel de vente efficace',
    excerpt: 'Apprenez à construire un funnel de vente qui convertit avec les bonnes étapes et les bons outils.',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=500&fit=crop',
    author: 'Sophie Bernard',
    date: '8 Jan 2024',
    readTime: '10 min',
    category: 'Marketing',
  },
  {
    id: '5',
    slug: 'seo-templates-bonnes-pratiques',
    title: 'SEO & Templates : les bonnes pratiques pour bien référencer votre site',
    excerpt: "Optimisez le référencement de votre site web dès le choix du template avec ces conseils d'experts.",
    image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&h=500&fit=crop',
    author: 'Marie Dupont',
    date: '5 Jan 2024',
    readTime: '7 min',
    category: 'SEO',
  },
  {
    id: '6',
    slug: 'devenir-vendeur-themepro',
    title: 'Comment devenir vendeur sur Themeseller et générer des revenus passifs',
    excerpt: 'Toutes les étapes pour créer et vendre vos templates sur notre marketplace.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    author: 'Pierre Martin',
    date: '2 Jan 2024',
    readTime: '12 min',
    category: 'Business',
  },
]

const categories = ['Tous', 'Design', 'Marketing', 'Tutoriels', 'SEO', 'Business']

export default function BlogPage() {
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
            Blog Themeseller
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg max-w-2xl mx-auto"
          >
            Conseils, tutoriels et actualités sur le web design et le marketing digital
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  cat === 'Tous'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Featured Article */}
        <Link href={`/blog/${articles[0].slug}`} className="block mb-12">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card overflow-hidden group"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <span className="relative h-64 lg:h-auto block">
                <Image
                  src={articles[0].image}
                  alt={articles[0].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                  À la une
                </span>
              </span>
              <span className="p-8 flex flex-col justify-center block">
                <span className="text-primary-600 font-medium text-sm mb-2 block">{articles[0].category}</span>
                <span className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors block">
                  {articles[0].title}
                </span>
                <span className="text-gray-600 mb-6 block">{articles[0].excerpt}</span>
                <span className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {articles[0].author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {articles[0].date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {articles[0].readTime}
                  </span>
                </span>
              </span>
            </div>
          </motion.article>
        </Link>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(1).map((article, index) => (
            <Link key={article.id} href={`/blog/${article.slug}`}>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden group h-full flex flex-col"
              >
                <span className="relative h-48 block">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 text-gray-700 text-xs font-medium rounded-full">
                    {article.category}
                  </span>
                </span>
                <span className="p-6 flex-1 flex flex-col block">
                  <span className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 block">
                    {article.title}
                  </span>
                  <span className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1 block">{article.excerpt}</span>
                  <span className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </span>
                </span>
              </motion.article>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Voir plus d'articles
          </Button>
        </div>
      </div>
    </div>
  )
}







