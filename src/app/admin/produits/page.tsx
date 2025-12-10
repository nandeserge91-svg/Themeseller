'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Package,
  AlertCircle,
  MoreVertical,
  Trash2,
  Ban,
  RotateCcw,
  X,
  AlertTriangle,
  FileText
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { useCurrencyStore } from '@/store/currencyStore'
import { useProductsStore, Product } from '@/store/productsStore'

// Type pour l'admin (mapping des statuts)
type AdminStatus = 'approved' | 'pending' | 'rejected' | 'suspended'

const mapStatusToAdmin = (status: Product['status']): AdminStatus => {
  if (status === 'active') return 'approved'
  if (status === 'draft') return 'pending' // Les brouillons ne sont pas visibles par l'admin normalement
  return status as AdminStatus
}

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle; color: string }> = {
  approved: { label: 'Approuvé', icon: CheckCircle, color: 'text-accent-600 bg-accent-50' },
  active: { label: 'Approuvé', icon: CheckCircle, color: 'text-accent-600 bg-accent-50' },
  pending: { label: 'En attente', icon: Clock, color: 'text-warning-600 bg-warning-50' },
  'pending-review': { label: 'En attente', icon: Clock, color: 'text-warning-600 bg-warning-50' },
  rejected: { label: 'Rejeté', icon: XCircle, color: 'text-red-600 bg-red-50' },
  suspended: { label: 'Suspendu', icon: Ban, color: 'text-orange-600 bg-orange-50' },
  archived: { label: 'Archivé', icon: Ban, color: 'text-gray-600 bg-gray-100' },
  draft: { label: 'Brouillon', icon: FileText, color: 'text-gray-600 bg-gray-100' },
}

export default function AdminProduitsPage() {
  // Utiliser le store partagé
  const { 
    products: allProducts,
    isLoading,
    fetchProducts,
    approveProduct, 
    rejectProduct, 
    suspendProduct, 
    reactivateProduct, 
    deleteProduct 
  } = useProductsStore()
  
  // Filtrer pour exclure les brouillons (pas soumis)
  const products = allProducts.filter(p => p.status !== 'draft')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)
  const [rejectingProduct, setRejectingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const { currency } = useCurrencyStore()

  // Charger les produits depuis l'API
  useEffect(() => {
    setIsHydrated(true)
    fetchProducts() // Charger tous les produits (l'API filtre selon le rôle)
  }, [fetchProducts])

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
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.vendor.name.toLowerCase().includes(searchQuery.toLowerCase())
    // Matcher les statuts en incluant les variations
    let matchesStatus = statusFilter === 'all'
    if (!matchesStatus) {
      if (statusFilter === 'approved') matchesStatus = p.status === 'active' || p.status === 'approved'
      else if (statusFilter === 'pending') matchesStatus = p.status === 'pending' || p.status === 'pending-review'
      else if (statusFilter === 'suspended') matchesStatus = p.status === 'suspended' || p.status === 'archived'
      else matchesStatus = p.status === statusFilter
    }
    return matchesSearch && matchesStatus
  })

  // Actions
  const handleApprove = async (productId: string) => {
    const result = await approveProduct(productId)
    setOpenMenuId(null)
    if (result.success) {
      setNotification({ type: 'success', message: 'Produit approuvé avec succès !' })
    } else {
      setNotification({ type: 'error', message: result.error || 'Erreur lors de l\'approbation' })
    }
  }

  const handleReject = async (productId: string, reason: string) => {
    const result = await rejectProduct(productId, reason)
    setRejectingProduct(null)
    if (result.success) {
      setNotification({ type: 'success', message: 'Produit rejeté.' })
    } else {
      setNotification({ type: 'error', message: result.error || 'Erreur lors du rejet' })
    }
  }

  const handleSuspend = async (productId: string) => {
    const result = await suspendProduct(productId)
    setOpenMenuId(null)
    if (result.success) {
      setNotification({ type: 'success', message: 'Produit retiré de la vente.' })
    } else {
      setNotification({ type: 'error', message: result.error || 'Erreur lors de la suspension' })
    }
  }

  const handleReactivate = async (productId: string) => {
    const result = await reactivateProduct(productId)
    setOpenMenuId(null)
    if (result.success) {
      setNotification({ type: 'success', message: 'Produit remis en vente !' })
    } else {
      setNotification({ type: 'error', message: result.error || 'Erreur lors de la réactivation' })
    }
  }

  const handleDelete = async () => {
    if (deletingProduct) {
      const result = await deleteProduct(deletingProduct.id)
      setDeletingProduct(null)
      if (result.success) {
        setNotification({ type: 'success', message: 'Produit supprimé définitivement.' })
      } else {
        setNotification({ type: 'error', message: result.error || 'Erreur lors de la suppression' })
      }
    }
  }

  const pendingCount = products.filter(p => p.status === 'pending' || p.status === 'pending-review').length

  // Afficher un loader pendant le chargement
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des produits...</p>
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
                className={`fixed top-24 right-4 z-50 px-6 py-3 rounded-xl shadow-lg ${
                  notification.type === 'success' 
                    ? 'bg-accent-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}
              >
                {notification.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Produits</h1>
              <p className="text-gray-600">Gérez et modérez les produits des vendeurs</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {products.filter(p => p.status === 'active').length}
                  </p>
                  <p className="text-sm text-gray-500">Approuvés</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                  <p className="text-sm text-gray-500">En attente</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Ban className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {products.filter(p => p.status === 'suspended').length}
                  </p>
                  <p className="text-sm text-gray-500">Suspendus</p>
                </div>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {products.filter(p => p.status === 'rejected').length}
                  </p>
                  <p className="text-sm text-gray-500">Rejetés</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Alert */}
          {pendingCount > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4 mb-6 border-l-4 border-warning-500 bg-warning-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-warning-600" />
                  <p className="text-warning-800">
                    <strong>{pendingCount}</strong> produit(s) en attente de modération
                  </p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setStatusFilter('pending')}
                >
                  Voir les produits
                </Button>
              </div>
            </motion.div>
          )}

          {/* Filters */}
          <div className="card p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit ou vendeur..."
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
                <option value="all">Tous les statuts</option>
                <option value="active">Approuvés</option>
                <option value="pending">En attente</option>
                <option value="suspended">Suspendus</option>
                <option value="rejected">Rejetés</option>
                <option value="rejected">Rejetés</option>
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Produit</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Vendeur</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Prix</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Soumis le</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ventes</th>
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
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-1">{product.title}</p>
                              <p className="text-sm text-gray-500">{product.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{product.vendor.name}</p>
                            <a 
                              href={`mailto:${product.vendor.email}`} 
                              className="text-sm text-primary-600 hover:underline"
                            >
                              {product.vendor.email}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">{formatPrice(product.price, currency)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            <status.icon className="w-3 h-3" />
                            {status.label}
                          </span>
                          {product.rejectionReason && (
                            <p className="text-xs text-red-500 mt-1 max-w-[150px] truncate" title={product.rejectionReason}>
                              {product.rejectionReason}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600 text-sm">
                            {product.submittedAt ? new Date(product.submittedAt).toLocaleDateString('fr-FR', { 
                              day: '2-digit', 
                              month: 'short',
                              year: 'numeric'
                            }) : '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-900">{product.sales}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            {/* Voir le produit */}
                            <button
                              onClick={() => setViewingProduct(product)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                              title="Voir les détails"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Actions rapides pour les produits en attente */}
                            {(product.status === 'pending' || product.status === 'pending-review') && (
                              <>
                                <button 
                                  onClick={() => handleApprove(product.id)}
                                  className="p-2 text-accent-600 hover:bg-accent-50 rounded-lg"
                                  title="Approuver"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    setRejectingProduct(product)
                                    setOpenMenuId(null)
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                  title="Rejeter"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}

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
                                    <Link
                                      href={`/produit/${product.slug}`}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                      onClick={() => setOpenMenuId(null)}
                                    >
                                      <Eye className="w-4 h-4" />
                                      Voir sur le site
                                    </Link>

                                    {/* Approuver (si pas déjà approuvé) */}
                                    {product.status !== 'active' && (
                                      <button
                                        onClick={() => handleApprove(product.id)}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-accent-600 hover:bg-accent-50"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                        Approuver le produit
                                      </button>
                                    )}

                                    {/* Suspendre (si approuvé/actif) */}
                                    {product.status === 'active' && (
                                      <button
                                        onClick={() => handleSuspend(product.id)}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50"
                                      >
                                        <Ban className="w-4 h-4" />
                                        Retirer de la vente
                                      </button>
                                    )}

                                    {/* Réactiver (si suspendu) */}
                                    {product.status === 'suspended' && (
                                      <button
                                        onClick={() => handleReactivate(product.id)}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-accent-600 hover:bg-accent-50"
                                      >
                                        <RotateCcw className="w-4 h-4" />
                                        Remettre en vente
                                      </button>
                                    )}

                                    {/* Rejeter */}
                                    {product.status !== 'rejected' && (
                                      <button
                                        onClick={() => {
                                          setRejectingProduct(product)
                                          setOpenMenuId(null)
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warning-600 hover:bg-warning-50"
                                      >
                                        <XCircle className="w-4 h-4" />
                                        Rejeter le produit
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
                                      Supprimer définitivement
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
                  <p className="text-gray-500">Aucun produit trouvé</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal de visualisation */}
      <AnimatePresence>
        {viewingProduct && (
          <ViewProductModal 
            product={viewingProduct} 
            onClose={() => setViewingProduct(null)}
            onApprove={() => {
              handleApprove(viewingProduct.id)
              setViewingProduct(null)
            }}
            onReject={() => {
              setRejectingProduct(viewingProduct)
              setViewingProduct(null)
            }}
            currency={currency}
          />
        )}
      </AnimatePresence>

      {/* Modal de rejet */}
      <AnimatePresence>
        {rejectingProduct && (
          <RejectProductModal 
            product={rejectingProduct} 
            onClose={() => setRejectingProduct(null)}
            onReject={(reason) => handleReject(rejectingProduct.id, reason)}
          />
        )}
      </AnimatePresence>

      {/* Modal de suppression */}
      <AnimatePresence>
        {deletingProduct && (
          <DeleteProductModal 
            product={deletingProduct} 
            onClose={() => setDeletingProduct(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Modal de visualisation du produit
function ViewProductModal({ 
  product, 
  onClose,
  onApprove,
  onReject,
  currency
}: { 
  product: Product
  onClose: () => void
  onApprove: () => void
  onReject: () => void
  currency: 'EUR' | 'XOF'
}) {
  const status = statusConfig[product.status]
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-48 bg-gray-100">
          <Image src={product.image} alt={product.title} fill className="object-cover" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Contenu */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{product.title}</h2>
              <p className="text-gray-500">{product.category}</p>
            </div>
            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
              <status.icon className="w-4 h-4" />
              {status.label}
            </span>
          </div>

          {/* Info Vendeur */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-blue-700 font-medium mb-1">Vendeur</p>
            <p className="text-blue-900 font-semibold">{product.vendor.name}</p>
            <a href={`mailto:${product.vendor.email}`} className="text-sm text-blue-600 hover:underline">
              {product.vendor.email}
            </a>
          </div>

          {product.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-red-700">
                <strong>Raison du rejet :</strong> {product.rejectionReason}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{formatPrice(product.price, currency)}</p>
              <p className="text-sm text-gray-500">Prix</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{product.sales}</p>
              <p className="text-sm text-gray-500">Ventes</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {product.submittedAt ? new Date(product.submittedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '-'}
              </p>
              <p className="text-sm text-gray-500">Soumis le</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{formatPrice(product.price * product.sales, currency)}</p>
              <p className="text-sm text-gray-500">Revenus</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href={`/produit/${product.slug}`} className="flex-1">
              <Button variant="secondary" className="w-full" leftIcon={<Eye className="w-4 h-4" />}>
                Voir sur le site
              </Button>
            </Link>
            {(product.status === 'pending' || product.status === 'pending-review') && (
              <>
                <Button onClick={onApprove} className="flex-1" leftIcon={<CheckCircle className="w-4 h-4" />}>
                  Approuver
                </Button>
                <Button 
                  onClick={onReject} 
                  variant="secondary" 
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  leftIcon={<XCircle className="w-4 h-4" />}
                >
                  Rejeter
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Modal de rejet
function RejectProductModal({ 
  product, 
  onClose,
  onReject
}: { 
  product: Product
  onClose: () => void
  onReject: (reason: string) => void
}) {
  const [reason, setReason] = useState('')
  const [selectedReason, setSelectedReason] = useState('')

  const commonReasons = [
    'Qualité des fichiers insuffisante',
    'Description incomplète ou trompeuse',
    'Images de prévisualisation de mauvaise qualité',
    'Contenu dupliqué ou plagié',
    'Non conforme aux standards de la plateforme',
    'Problèmes de licence ou droits d\'auteur',
  ]

  const handleSubmit = () => {
    const finalReason = selectedReason === 'other' ? reason : selectedReason
    if (finalReason) {
      onReject(finalReason)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Rejeter le produit</h2>
              <p className="text-sm text-gray-500">{product.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Sélectionnez ou saisissez la raison du rejet. Le vendeur recevra cette information.
          </p>

          <div className="space-y-2 mb-4">
            {commonReasons.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedReason(r)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                  selectedReason === r
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {r}
              </button>
            ))}
            <button
              onClick={() => setSelectedReason('other')}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                selectedReason === 'other'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              Autre raison...
            </button>
          </div>

          {selectedReason === 'other' && (
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Décrivez la raison du rejet..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 resize-none mb-4"
            />
          )}

          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedReason || (selectedReason === 'other' && !reason)}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Rejeter le produit
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Modal de suppression
function DeleteProductModal({ 
  product, 
  onClose,
  onConfirm
}: { 
  product: Product
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
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
          Vous êtes sur le point de supprimer définitivement :
        </p>
        <p className="font-semibold text-gray-900 text-center mb-4">
          "{product.title}"
        </p>
        
        {product.sales > 0 && (
          <div className="bg-warning-50 border border-warning-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-warning-700 text-center">
              ⚠️ Ce produit a généré <strong>{product.sales} vente(s)</strong>. 
              Les clients ayant acheté ce produit conserveront leur accès.
            </p>
          </div>
        )}
        
        <p className="text-sm text-gray-500 text-center mb-6">
          Cette action est irréversible.
        </p>
        
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button 
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            Supprimer
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
