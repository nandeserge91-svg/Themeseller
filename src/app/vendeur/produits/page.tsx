'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Eye, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Package,
  AlertCircle,
  Ban,
  RotateCcw,
  Copy,
  ExternalLink,
  AlertTriangle,
  X
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { useCurrencyStore } from '@/store/currencyStore'
import { useProductsStore, Product } from '@/store/productsStore'
import { useAuthStore } from '@/store/authStore'

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle; color: string; textColor: string }> = {
  active: { label: 'En vente', icon: CheckCircle, color: 'text-accent-600 bg-accent-50', textColor: 'text-accent-700' },
  approved: { label: 'En vente', icon: CheckCircle, color: 'text-accent-600 bg-accent-50', textColor: 'text-accent-700' },
  pending: { label: 'En attente', icon: Clock, color: 'text-warning-600 bg-warning-50', textColor: 'text-warning-700' },
  'pending-review': { label: 'En attente', icon: Clock, color: 'text-warning-600 bg-warning-50', textColor: 'text-warning-700' },
  rejected: { label: 'Rejeté', icon: XCircle, color: 'text-red-600 bg-red-50', textColor: 'text-red-700' },
  suspended: { label: 'Suspendu', icon: Ban, color: 'text-orange-600 bg-orange-50', textColor: 'text-orange-700' },
  archived: { label: 'Archivé', icon: Ban, color: 'text-gray-600 bg-gray-100', textColor: 'text-gray-700' },
  draft: { label: 'Brouillon', icon: Edit, color: 'text-gray-600 bg-gray-100', textColor: 'text-gray-700' },
}

export default function VendeurProduitsPage() {
  const searchParams = useSearchParams()
  const { products: allProducts, deleteProduct, updateProduct, resubmitProduct, addProduct, fetchProducts, isLoading } = useProductsStore()
  const { user } = useAuthStore()
  
  // Filtrer les produits du vendeur connecté
  const products = allProducts.filter(p => {
    // Afficher tous les produits si admin
    if (user?.role === 'ADMIN') return true
    // Filtrer par vendeur connecté
    const vendorId = user?.vendorProfile?.id
    return p.vendor?.userId === user?.id || p.vendor?.id === vendorId
  })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [viewingRejection, setViewingRejection] = useState<Product | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { currency } = useCurrencyStore()

  // Charger les produits au montage
  useEffect(() => {
    setIsHydrated(true)
    fetchProducts() // Charger tous les produits
  }, [fetchProducts])

  // Mettre à jour le filtre depuis l'URL
  useEffect(() => {
    const filter = searchParams.get('filter')
    if (filter) {
      setStatusFilter(filter)
    }
  }, [searchParams])

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase())
    // Matcher les statuts en incluant les variations
    let matchesStatus = statusFilter === 'all'
    if (!matchesStatus) {
      if (statusFilter === 'active') matchesStatus = p.status === 'active' || p.status === 'approved'
      else if (statusFilter === 'pending') matchesStatus = p.status === 'pending' || p.status === 'pending-review'
      else if (statusFilter === 'suspended') matchesStatus = p.status === 'suspended' || p.status === 'archived'
      else matchesStatus = p.status === statusFilter
    }
    return matchesSearch && matchesStatus
  })

  // Stats - inclure tous les statuts possibles
  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active' || p.status === 'approved').length,
    pending: products.filter(p => p.status === 'pending' || p.status === 'pending-review').length,
    rejected: products.filter(p => p.status === 'rejected').length,
    suspended: products.filter(p => p.status === 'suspended' || p.status === 'archived').length,
    draft: products.filter(p => p.status === 'draft').length,
    totalSales: products.reduce((acc, p) => acc + p.sales, 0),
    totalRevenue: products.reduce((acc, p) => acc + (p.revenue || 0), 0),
    totalViews: products.reduce((acc, p) => acc + p.views, 0),
  }

  // Actions
  const handleDelete = () => {
    if (deletingProduct) {
      deleteProduct(deletingProduct.id)
      setDeletingProduct(null)
      setNotification({ type: 'success', message: 'Produit supprimé avec succès.' })
    }
  }

  const handleDuplicate = (product: Product) => {
    addProduct({
      ...product,
      title: `${product.title} (Copie)`,
      status: 'draft',
      // Garder le même vendeur pour la duplication
    })
    setOpenMenuId(null)
    setNotification({ type: 'success', message: 'Produit dupliqué ! Vous pouvez maintenant le modifier.' })
  }

  const handleResubmit = (productId: string) => {
    resubmitProduct(productId)
    setOpenMenuId(null)
    setNotification({ type: 'success', message: 'Produit resoumis pour révision.' })
  }

  const handleSuspend = (productId: string) => {
    updateProduct(productId, { status: 'suspended' })
    setOpenMenuId(null)
    setNotification({ type: 'success', message: 'Produit retiré de la vente.' })
  }

  const handleReactivate = (productId: string) => {
    updateProduct(productId, { status: 'active' })
    setOpenMenuId(null)
    setNotification({ type: 'success', message: 'Produit remis en vente !' })
  }

  // Afficher un loader pendant l'hydratation
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Notification */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`fixed top-24 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
                  notification.type === 'success' 
                    ? 'bg-accent-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}
              >
                {notification.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                {notification.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes produits</h1>
              <p className="text-gray-600">{stats.total} produits au total</p>
            </div>
            <Link href="/vendeur/produits/nouveau">
              <Button leftIcon={<Plus className="w-4 h-4" />}>
                Nouveau produit
              </Button>
            </Link>
          </div>

          {/* Alertes */}
          {stats.rejected > 0 && statusFilter !== 'rejected' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4 mb-4 border-l-4 border-red-500 bg-red-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800">
                    <strong>{stats.rejected}</strong> produit(s) rejeté(s) - Corrigez les problèmes et resoumettez
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setStatusFilter('rejected')
                    document.getElementById('products-table')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Voir les produits rejetés
                </button>
              </div>
            </motion.div>
          )}

          {stats.pending > 0 && statusFilter !== 'pending' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4 mb-4 border-l-4 border-warning-500 bg-warning-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-warning-600" />
                  <p className="text-warning-800">
                    <strong>{stats.pending}</strong> produit(s) en attente de validation
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setStatusFilter('pending')
                    document.getElementById('products-table')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-4 py-2 text-sm font-medium text-warning-700 bg-white border border-warning-300 rounded-lg hover:bg-warning-100 transition-colors"
                >
                  Voir les produits en attente
                </button>
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                  <p className="text-sm text-gray-500">En vente</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-sm text-gray-500">En attente</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-secondary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
                  <p className="text-sm text-gray-500">Ventes</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">€</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue, currency)}</p>
                  <p className="text-sm text-gray-500">Revenus</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tous les statuts ({stats.total})</option>
                <option value="active">En vente ({stats.active})</option>
                <option value="pending">En attente ({stats.pending})</option>
                <option value="rejected">Rejetés ({stats.rejected})</option>
                <option value="suspended">Suspendus ({stats.suspended})</option>
                <option value="draft">Brouillons ({stats.draft})</option>
              </select>
              {statusFilter !== 'all' && (
                <button
                  onClick={() => setStatusFilter('all')}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Réinitialiser
                </button>
              )}
            </div>
            
            {/* Indicateur de filtre actif */}
            {statusFilter !== 'all' && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-gray-500">Filtre actif :</span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[statusFilter as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-600'}`}>
                  {statusConfig[statusFilter as keyof typeof statusConfig]?.label || statusFilter}
                </span>
                <span className="text-sm text-gray-500">
                  ({filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''})
                </span>
              </div>
            )}
          </div>

          {/* Products Table */}
          <div id="products-table" className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Produit</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Prix</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ventes</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Revenus</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Statut</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => {
                    const status = statusConfig[product.status]
                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-12 rounded-lg overflow-hidden">
                              <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                              {product.status === 'rejected' && (
                                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                                  <XCircle className="w-6 h-6 text-red-600" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-1">{product.title}</p>
                              <p className="text-sm text-gray-500">{product.views} vues • {product.rating > 0 ? `⭐ ${product.rating}` : 'Pas encore noté'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">{formatPrice(product.price, currency)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-900">{product.sales}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">{formatPrice(product.revenue || 0, currency)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color} w-fit`}>
                              <status.icon className="w-3 h-3" />
                              {status.label}
                            </span>
                            {product.rejectionReason && (
                              <button
                                onClick={() => setViewingRejection(product)}
                                className="text-xs text-red-600 hover:underline text-left"
                              >
                                Voir la raison →
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            {/* Actions rapides */}
                            {product.status === 'active' && (
                              <Link
                                href={`/produit/${product.slug}`}
                                target="_blank"
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                                title="Voir sur le site"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                            )}
                            
                            <Link
                              href={`/vendeur/produits/${product.id}/modifier`}
                              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            
                            {/* Menu déroulant */}
                            <div className="relative" ref={openMenuId === product.id ? menuRef : null}>
                              <button 
                                onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              
                              <AnimatePresence>
                                {openMenuId === product.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50"
                                  >
                                    {/* Voir sur le site */}
                                    {product.status === 'active' && (
                                      <Link
                                        href={`/produit/${product.slug}`}
                                        target="_blank"
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => setOpenMenuId(null)}
                                      >
                                        <Eye className="w-4 h-4" />
                                        Voir sur le site
                                      </Link>
                                    )}
                                    
                                    {/* Modifier */}
                                    <Link
                                      href={`/vendeur/produits/${product.id}/modifier`}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                      onClick={() => setOpenMenuId(null)}
                                    >
                                      <Edit className="w-4 h-4" />
                                      Modifier le produit
                                    </Link>
                                    
                                    {/* Dupliquer */}
                                    <button
                                      onClick={() => handleDuplicate(product)}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                      <Copy className="w-4 h-4" />
                                      Dupliquer
                                    </button>
                                    
                                    {/* Resoumettre (si rejeté) */}
                                    {product.status === 'rejected' && (
                                      <button
                                        onClick={() => handleResubmit(product.id)}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50"
                                      >
                                        <RotateCcw className="w-4 h-4" />
                                        Resoumettre pour révision
                                      </button>
                                    )}
                                    
                                    {/* Soumettre brouillon */}
                                    {product.status === 'draft' && (
                                      <button
                                        onClick={() => handleResubmit(product.id)}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                        Soumettre pour révision
                                      </button>
                                    )}
                                    
                                    {/* Retirer de la vente (si actif) */}
                                    {product.status === 'active' && (
                                      <button
                                        onClick={() => handleSuspend(product.id)}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warning-600 hover:bg-warning-50"
                                      >
                                        <Ban className="w-4 h-4" />
                                        Retirer de la vente
                                      </button>
                                    )}
                                    
                                    {/* Remettre en vente (si suspendu par vendeur) */}
                                    {product.status === 'suspended' && !product.rejectionReason?.includes('administration') && (
                                      <button
                                        onClick={() => handleReactivate(product.id)}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-accent-600 hover:bg-accent-50"
                                      >
                                        <RotateCcw className="w-4 h-4" />
                                        Remettre en vente
                                      </button>
                                    )}
                                    
                                    <div className="border-t border-gray-100 my-1"></div>
                                    
                                    {/* Supprimer */}
                                    <button
                                      onClick={() => {
                                        setDeletingProduct(product)
                                        setOpenMenuId(null)
                                      }}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Supprimer
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    {statusFilter === 'all' 
                      ? 'Vous n\'avez pas encore de produits' 
                      : `Aucun produit avec le statut "${statusConfig[statusFilter as keyof typeof statusConfig]?.label}"`
                    }
                  </p>
                  {statusFilter === 'all' && (
                    <Link href="/vendeur/produits/nouveau">
                      <Button>Créer mon premier produit</Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal raison de rejet */}
      <AnimatePresence>
        {viewingRejection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setViewingRejection(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Produit rejeté</h2>
                </div>
                <button onClick={() => setViewingRejection(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Produit concerné :</p>
                <p className="font-medium text-gray-900">{viewingRejection.title}</p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-red-700 font-medium mb-2">Raison du rejet :</p>
                <p className="text-red-800">{viewingRejection.rejectionReason}</p>
              </div>
              
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setViewingRejection(null)} className="flex-1">
                  Fermer
                </Button>
                <Link href={`/vendeur/produits/${viewingRejection.id}/modifier`} className="flex-1">
                  <Button className="w-full" leftIcon={<Edit className="w-4 h-4" />}>
                    Modifier
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de confirmation de suppression */}
      <AnimatePresence>
        {deletingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeletingProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
                Supprimer ce produit ?
              </h2>
              
              <p className="text-gray-600 text-center mb-2">
                Vous êtes sur le point de supprimer :
              </p>
              <p className="font-semibold text-gray-900 text-center mb-4">
                "{deletingProduct.title}"
              </p>
              
              {deletingProduct.sales > 0 && (
                <div className="bg-warning-50 border border-warning-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-warning-700 text-center">
                    ⚠️ Ce produit a généré <strong>{deletingProduct.sales} vente(s)</strong>.
                    Les clients conserveront leur accès aux fichiers.
                  </p>
                </div>
              )}
              
              <p className="text-sm text-gray-500 text-center mb-6">
                Cette action est irréversible.
              </p>
              
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setDeletingProduct(null)} className="flex-1">
                  Annuler
                </Button>
                <Button 
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Supprimer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
