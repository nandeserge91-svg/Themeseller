'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import Button from '@/components/ui/Button'

// Mock article data
const article = {
  slug: 'tendances-web-design-2024',
  title: 'Les 10 tendances web design à suivre en 2024',
  excerpt: 'Découvrez les tendances qui vont marquer le design web cette année.',
  image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=600&fit=crop',
  author: {
    name: 'Marie Dupont',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    role: 'Head of Design',
  },
  date: '15 Jan 2024',
  readTime: '5 min',
  category: 'Design',
  content: `
    <p class="lead">Le design web évolue constamment. Voici les tendances majeures qui définiront l'année 2024.</p>

    <h2>1. Le minimalisme évolué</h2>
    <p>Le minimalisme reste une tendance forte, mais il évolue vers des designs plus audacieux avec des touches de couleur stratégiques et des typographies expressives.</p>

    <h2>2. Le dark mode généralisé</h2>
    <p>Après avoir été une option, le dark mode devient un standard. Les designers créent désormais des expériences pensées d'abord en mode sombre.</p>

    <h2>3. Les micro-interactions</h2>
    <p>Les animations subtiles et les micro-interactions enrichissent l'expérience utilisateur sans être intrusives. Chaque action génère un feedback visuel agréable.</p>

    <h2>4. Le glassmorphism mature</h2>
    <p>L'effet de verre dépoli continue d'évoluer avec des applications plus subtiles et des combinaisons avec d'autres effets visuels.</p>

    <h2>5. La typographie bold</h2>
    <p>Les polices audacieuses et expressives prennent le devant de la scène, devenant parfois l'élément principal du design.</p>

    <h2>6. Les gradients 3.0</h2>
    <p>Les dégradés reviennent en force avec des combinaisons de couleurs plus complexes et des transitions plus naturelles.</p>

    <h2>7. L'accessibilité au premier plan</h2>
    <p>L'accessibilité n'est plus une option. Les designs doivent être inclusifs et fonctionnels pour tous les utilisateurs.</p>

    <h2>8. L'IA dans le design</h2>
    <p>Les outils d'IA assistent les designers dans la création, de la génération d'images à l'optimisation des layouts.</p>

    <h2>9. Le scroll horizontal</h2>
    <p>Le défilement horizontal fait son retour pour certaines sections, créant des expériences narratives originales.</p>

    <h2>10. Les expériences immersives</h2>
    <p>La 3D, la réalité augmentée et les expériences interactives créent des sites web mémorables qui se démarquent.</p>

    <h2>Conclusion</h2>
    <p>Ces tendances ne sont pas des règles absolues, mais des directions à explorer. Le plus important reste de créer des expériences qui servent vos utilisateurs et vos objectifs.</p>
  `,
}

const relatedArticles = [
  {
    slug: 'optimiser-conversion-landing-page',
    title: 'Comment optimiser votre landing page',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    date: '12 Jan 2024',
  },
  {
    slug: 'wordpress-vs-html-templates',
    title: 'WordPress vs HTML : quel choix ?',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
    date: '10 Jan 2024',
  },
]

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative h-96 md:h-[500px]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/blog"
              className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au blog
            </Link>
            <span className="inline-block px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full mb-4">
              {article.category}
            </span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4"
            >
              {article.title}
            </motion.h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span>{article.author.name}</span>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime} de lecture
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Share Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Partager</p>
              <div className="flex flex-col gap-2">
                <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <article className="lg:col-span-3">
            <div 
              className="prose prose-lg prose-gray max-w-none prose-headings:font-display prose-a:text-primary-600"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Author Card */}
            <div className="mt-12 card p-6">
              <div className="flex items-start gap-4">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div>
                  <p className="font-bold text-gray-900">{article.author.name}</p>
                  <p className="text-gray-500 text-sm">{article.author.role}</p>
                  <p className="text-gray-600 mt-2 text-sm">
                    Passionnée par le design web et les nouvelles technologies, Marie partage 
                    son expertise à travers des articles et tutoriels.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Articles similaires</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedArticles.map((related) => (
                  <Link key={related.slug} href={`/blog/${related.slug}`} className="group">
                    <div className="card overflow-hidden">
                      <span className="relative h-40 block">
                        <Image
                          src={related.image}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </span>
                      <span className="p-4 block">
                        <span className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors block">
                          {related.title}
                        </span>
                        <span className="text-sm text-gray-500 mt-1 block">{related.date}</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}







