'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Edit, Trash2, MessageSquare } from 'lucide-react'
import Button from '@/components/ui/Button'

const reviews = [
  {
    id: '1',
    productId: '1',
    productTitle: 'ProBusiness - Template WordPress Premium',
    productImage: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=200&h=150&fit=crop',
    productSlug: 'probusiness-template-wordpress',
    rating: 5,
    comment: "Excellent template ! Très bien codé et facile à personnaliser. Le support est réactif et professionnel. Je recommande vivement.",
    date: '2024-01-10',
    helpful: 12,
  },
  {
    id: '2',
    productId: '2',
    productTitle: 'SaaS Landing Page - HTML5 Template',
    productImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop',
    productSlug: 'saas-landing-page-html5',
    rating: 4,
    comment: "Bon template dans l'ensemble. Design moderne et responsive. Quelques petits ajustements nécessaires pour la version mobile.",
    date: '2024-01-05',
    helpful: 8,
  },
]

const pendingReviews = [
  {
    id: '3',
    productId: '3',
    productTitle: 'UI Kit Dashboard Figma',
    productImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=150&fit=crop',
    productSlug: 'ui-kit-dashboard-figma',
    purchaseDate: '2024-01-12',
  },
]

export default function AvisPage() {
  const [activeTab, setActiveTab] = useState<'written' | 'pending'>('written')

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mes avis</h1>
            <Link href="/mon-compte">
              <Button variant="secondary">Retour</Button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('written')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                activeTab === 'written'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Avis publiés ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              À évaluer ({pendingReviews.length})
            </button>
          </div>

          {/* Written Reviews */}
          {activeTab === 'written' && (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="card p-6">
                  <div className="flex gap-4">
                    <Link href={`/produit/${review.productSlug}`} className="flex-shrink-0">
                      <div className="relative w-24 h-18 rounded-lg overflow-hidden">
                        <Image
                          src={review.productImage}
                          alt={review.productTitle}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link href={`/produit/${review.productSlug}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-primary-600">
                          {review.productTitle}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center gap-2 mt-1 mb-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'text-warning-500 fill-warning-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm">{review.comment}</p>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                          {review.helpful} personnes ont trouvé cet avis utile
                        </span>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pending Reviews */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingReviews.map((item) => (
                <div key={item.id} className="card p-6">
                  <div className="flex items-center gap-4">
                    <Link href={`/produit/${item.productSlug}`} className="flex-shrink-0">
                      <div className="relative w-24 h-18 rounded-lg overflow-hidden">
                        <Image
                          src={item.productImage}
                          alt={item.productTitle}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link href={`/produit/${item.productSlug}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-primary-600">
                          {item.productTitle}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        Acheté le {new Date(item.purchaseDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Button leftIcon={<MessageSquare className="w-4 h-4" />}>
                      Laisser un avis
                    </Button>
                  </div>
                </div>
              ))}

              {pendingReviews.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun produit à évaluer
                  </h3>
                  <p className="text-gray-600">
                    Tous vos achats ont déjà été évalués.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}







