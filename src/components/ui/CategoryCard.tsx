'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface CategoryCardProps {
  category: {
    name: string
    slug: string
    icon: string
    description?: string
    productCount?: number
    gradient: string
  }
  index?: number
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link 
        href={`/categorie/${category.slug}`}
        className={`relative overflow-hidden rounded-2xl p-6 ${category.gradient} group cursor-pointer block`}
      >
        {/* Background Pattern */}
        <span className="absolute inset-0 opacity-10">
          <span className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/30 block" />
          <span className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-white/20 block" />
        </span>

        <span className="relative z-10 block">
          {/* Icon */}
          <span className="text-5xl mb-4 block transform group-hover:scale-110 transition-transform duration-300">
            {category.icon}
          </span>

          {/* Content */}
          <span className="text-xl font-bold text-white mb-1 block">
            {category.name}
          </span>
          
          {category.productCount !== undefined && (
            <span className="text-white/80 text-sm mb-4 block">
              {category.productCount} produits
            </span>
          )}

          {/* Arrow */}
          <span className="flex items-center text-white/80 text-sm font-medium group-hover:text-white transition-colors">
            Explorer
            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </span>
        </span>
      </Link>
    </motion.div>
  )
}
