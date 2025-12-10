'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus,
  Image as ImageIcon,
  FileArchive,
  Info,
  CheckCircle,
  AlertCircle,
  Loader2,
  File,
  Trash2,
  Clock,
  RotateCcw
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useProductsStore, Product } from '@/store/productsStore'

interface Category {
  id: string
  name: string
  slug: string
}

interface UploadedFile {
  file?: File
  name: string
  size: number
  progress: number
  status: 'uploading' | 'success' | 'error'
  url?: string
}

// Config des statuts
const statusConfig: Record<string, { label: string; icon: typeof CheckCircle; color: string; bgColor: string }> = {
  active: { label: 'En vente', icon: CheckCircle, color: 'text-accent-600', bgColor: 'bg-accent-50' },
  approved: { label: 'En vente', icon: CheckCircle, color: 'text-accent-600', bgColor: 'bg-accent-50' },
  pending: { label: 'En attente de validation', icon: Clock, color: 'text-warning-600', bgColor: 'bg-warning-50' },
  'pending-review': { label: 'En attente de validation', icon: Clock, color: 'text-warning-600', bgColor: 'bg-warning-50' },
  rejected: { label: 'Rejeté', icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
  suspended: { label: 'Suspendu', icon: AlertCircle, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  draft: { label: 'Brouillon', icon: Clock, color: 'text-gray-600', bgColor: 'bg-gray-100' },
}

export default function ModifierProduitPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const { fetchProduct, updateProduct, resubmitProduct, submitProduct } = useProductsStore()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([''])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [mainFile, setMainFile] = useState<UploadedFile | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    price: '',
    salePrice: '',
    categoryId: '',
    version: '1.0.0',
    previewUrl: '',
    filesIncluded: [] as string[],
  })

  // Charger le produit et les catégories
  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les catégories
        const catResponse = await fetch('/api/categories')
        if (catResponse.ok) {
          const catData = await catResponse.json()
          setCategories(catData.categories || [])
        }
        
        // Charger le produit
        const productData = await fetchProduct(productId)
        
        if (!productData) {
          setLoadError('Produit non trouvé')
          return
        }
        
        setProduct(productData)
        
        // Pré-remplir le formulaire
        setFormData({
          title: productData.title || '',
          shortDescription: productData.shortDescription || '',
          description: productData.description || '',
          price: productData.price?.toString() || '',
          salePrice: productData.salePrice?.toString() || '',
          categoryId: productData.categoryId || '',
          version: productData.version || '1.0.0',
          previewUrl: productData.previewUrl || '',
          filesIncluded: productData.filesIncluded || [],
        })
        
        setImages(productData.images || [])
        setFeatures(productData.features?.length > 0 ? productData.features : [''])
        setTags(productData.tags || [])
        
        if (productData.mainFile) {
          setMainFile({
            name: productData.fileName || 'fichier.zip',
            size: productData.fileSize || 0,
            progress: 100,
            status: 'success',
            url: productData.mainFile,
          })
        }
        
      } catch (error) {
        setLoadError('Erreur lors du chargement du produit')
      } finally {
        setIsLoadingProduct(false)
      }
    }
    
    loadData()
  }, [productId, fetchProduct])

  // Détecter les changements
  useEffect(() => {
    if (product) {
      const changed = 
        formData.title !== product.title ||
        formData.description !== product.description ||
        formData.price !== product.price?.toString() ||
        images.length !== (product.images?.length || 0)
      setHasChanges(changed)
    }
  }, [formData, images, product])

  // Fonction pour formater la taille du fichier
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Simuler l'upload du fichier principal
  const uploadMainFile = async (file: File) => {
    const validTypes = ['application/zip', 'application/x-zip-compressed', 'application/x-rar-compressed', 'application/vnd.rar']
    if (!validTypes.includes(file.type) && !file.name.match(/\.(zip|rar)$/i)) {
      setNotification({ type: 'error', message: 'Format de fichier non valide. Utilisez ZIP ou RAR.' })
      return
    }

    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      setNotification({ type: 'error', message: 'Le fichier est trop volumineux. Maximum 50 MB.' })
      return
    }

    const uploadedFile: UploadedFile = {
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading',
    }

    setMainFile(uploadedFile)
    setHasChanges(true)

    const interval = setInterval(() => {
      setMainFile((prev) => {
        if (!prev) return null
        const newProgress = Math.min(prev.progress + Math.random() * 30, 100)
        
        if (newProgress >= 100) {
          clearInterval(interval)
          return {
            ...prev,
            progress: 100,
            status: 'success',
            url: URL.createObjectURL(file),
          }
        }
        
        return { ...prev, progress: newProgress }
      })
    }, 300)
  }

  // Gestionnaire de drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      uploadMainFile(files[0])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      uploadMainFile(files[0])
    }
  }

  const handleRemoveMainFile = () => {
    setMainFile(null)
    setHasChanges(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // État pour l'upload en cours
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Upload d'images vers le serveur
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remainingSlots = 6 - images.length
    const filesToAdd = files.slice(0, remainingSlots)

    if (filesToAdd.length === 0) return

    setIsUploading(true)
    setUploadError(null)

    for (const file of filesToAdd) {
      if (!file.type.startsWith('image/')) continue

      try {
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        })

        const data = await response.json()

        if (response.ok && data.url) {
          setImages((prev) => [...prev, data.url])
          setHasChanges(true)
        } else {
          const localUrl = URL.createObjectURL(file)
          setImages((prev) => [...prev, localUrl])
          setUploadError(data.error || 'Upload échoué, image locale utilisée')
          setHasChanges(true)
        }
      } catch (error) {
        const localUrl = URL.createObjectURL(file)
        setImages((prev) => [...prev, localUrl])
        setUploadError('Erreur réseau, image locale utilisée')
        setHasChanges(true)
      }
    }

    setIsUploading(false)
  }

  const handleAddFeature = () => {
    setFeatures([...features, ''])
    setHasChanges(true)
  }

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
    setHasChanges(true)
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
    setHasChanges(true)
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
        setHasChanges(true)
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
    setHasChanges(true)
  }

  // Enregistrer les modifications
  const handleSave = async () => {
    setIsLoading(true)

    try {
      const result = await updateProduct(productId, {
        title: formData.title,
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        images: images,
        previewUrl: formData.previewUrl,
        version: formData.version,
        features: features.filter(f => f.trim() !== ''),
        tags: tags,
        filesIncluded: formData.filesIncluded,
      })

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la sauvegarde')
      }

      setNotification({ type: 'success', message: 'Modifications enregistrées !' })
      setHasChanges(false)
      
      // Recharger le produit
      const updatedProduct = await fetchProduct(productId)
      if (updatedProduct) {
        setProduct(updatedProduct)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la sauvegarde'
      setNotification({ type: 'error', message: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  // Enregistrer et resoumettre
  const handleSaveAndResubmit = async () => {
    setIsLoading(true)

    try {
      // D'abord sauvegarder les modifications
      const saveResult = await updateProduct(productId, {
        title: formData.title,
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        images: images,
        previewUrl: formData.previewUrl,
        version: formData.version,
        features: features.filter(f => f.trim() !== ''),
        tags: tags,
        filesIncluded: formData.filesIncluded,
      })

      if (!saveResult.success) {
        throw new Error(saveResult.error || 'Erreur lors de la sauvegarde')
      }

      // Puis resoumettre
      const resubmitResult = await resubmitProduct(productId)

      if (!resubmitResult.success) {
        throw new Error(resubmitResult.error || 'Erreur lors de la resoumission')
      }

      setNotification({ type: 'success', message: 'Produit modifié et resoumis pour validation !' })
      
      setTimeout(() => {
        router.push('/vendeur/produits?filter=pending')
      }, 1500)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la resoumission'
      setNotification({ type: 'error', message: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  // Soumettre un brouillon
  const handleSubmitDraft = async () => {
    setIsLoading(true)

    try {
      // D'abord sauvegarder les modifications
      await updateProduct(productId, {
        title: formData.title,
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        images: images,
        previewUrl: formData.previewUrl,
        version: formData.version,
        features: features.filter(f => f.trim() !== ''),
        tags: tags,
        filesIncluded: formData.filesIncluded,
      })

      // Puis soumettre
      const submitResult = await submitProduct(productId)

      if (!submitResult.success) {
        throw new Error(submitResult.error || 'Erreur lors de la soumission')
      }

      setNotification({ type: 'success', message: 'Produit soumis pour validation !' })
      
      setTimeout(() => {
        router.push('/vendeur/produits?filter=pending')
      }, 1500)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la soumission'
      setNotification({ type: 'error', message: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  // Afficher un loader pendant le chargement
  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  // Afficher une erreur si le produit n'est pas trouvé
  if (loadError || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Produit non trouvé</h1>
          <p className="text-gray-600 mb-6">{loadError || 'Ce produit n\'existe pas ou vous n\'avez pas les droits pour le modifier.'}</p>
          <Link href="/vendeur/produits">
            <Button>Retour à mes produits</Button>
          </Link>
        </div>
      </div>
    )
  }

  const status = statusConfig[product.status] || statusConfig.pending
  const StatusIcon = status.icon
  const canResubmit = product.status === 'rejected'
  const canSubmitDraft = product.status === 'draft'
  const isPending = product.status === 'pending' || product.status === 'pending-review'

  return (
    <div className="min-h-screen bg-gray-50">
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
            <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/vendeur/produits">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-gray-900">Modifier le produit</h1>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{product.title}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {canSubmitDraft && (
                <Button variant="primary" onClick={handleSubmitDraft} isLoading={isLoading}>
                  Soumettre pour révision
                </Button>
              )}
              {canResubmit && (
                <Button 
                  variant="primary" 
                  onClick={handleSaveAndResubmit} 
                  isLoading={isLoading}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                >
                  Enregistrer et resoumettre
                </Button>
              )}
              {!canResubmit && !canSubmitDraft && (
                <Button onClick={handleSave} isLoading={isLoading} disabled={!hasChanges && !isPending}>
                  Enregistrer les modifications
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Message pour produit rejeté */}
      {product.status === 'rejected' && product.rejectionReason && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800 mb-1">Produit rejeté - Raison :</p>
                <p className="text-red-700">{product.rejectionReason}</p>
                <p className="text-sm text-red-600 mt-2">
                  Corrigez les problèmes mentionnés ci-dessus, puis cliquez sur "Enregistrer et resoumettre" pour soumettre à nouveau votre produit.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message pour produit en attente */}
      {isPending && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-warning-50 border border-warning-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-warning-800 mb-1">Produit en cours de validation</p>
                <p className="text-warning-700">
                  Votre produit est actuellement en cours de vérification par notre équipe. Vous pouvez toujours modifier les informations, mais les changements seront également soumis à validation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
          {/* Basic Info */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations de base</h2>
            
            <div className="space-y-6">
              <Input
                label="Titre du produit"
                placeholder="Ex: SaaSify - Admin Dashboard Premium"
                value={formData.title}
                onChange={(e) => { setFormData({ ...formData, title: e.target.value }); setHasChanges(true); }}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description courte
                </label>
                <textarea
                  rows={2}
                  placeholder="Résumez votre produit en 1-2 phrases..."
                  value={formData.shortDescription}
                  onChange={(e) => { setFormData({ ...formData, shortDescription: e.target.value }); setHasChanges(true); }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formData.shortDescription.length}/500 caractères
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description complète (HTML supporté)
                </label>
                <textarea
                  rows={10}
                  placeholder="Décrivez en détail votre produit, ses fonctionnalités, ce qui est inclus..."
                  value={formData.description}
                  onChange={(e) => { setFormData({ ...formData, description: e.target.value }); setHasChanges(true); }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => { setFormData({ ...formData, categoryId: e.target.value }); setHasChanges(true); }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="URL de prévisualisation"
                  type="url"
                  placeholder="https://preview.votresite.com"
                  value={formData.previewUrl}
                  onChange={(e) => { setFormData({ ...formData, previewUrl: e.target.value }); setHasChanges(true); }}
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Images de prévisualisation</h2>
            <p className="text-sm text-gray-500 mb-4">
              Ajoutez jusqu'à 6 images de votre produit. La première sera l'image principale.
            </p>

            {/* Champ pour coller une URL d'image */}
            <div className="mb-4 flex gap-2">
              <input
                type="url"
                placeholder="Collez une URL d'image (https://...)"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const input = e.target as HTMLInputElement
                    const url = input.value.trim()
                    if (url && images.length < 6 && (url.startsWith('http://') || url.startsWith('https://'))) {
                      setImages([...images, url])
                      setHasChanges(true)
                      input.value = ''
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement
                  const url = input?.value?.trim()
                  if (url && images.length < 6 && (url.startsWith('http://') || url.startsWith('https://'))) {
                    setImages([...images, url])
                    setHasChanges(true)
                    input.value = ''
                  }
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Ajouter
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden group"
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImages(images.filter((_, i) => i !== index))
                      setHasChanges(true)
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs rounded-full">
                      Principale
                    </span>
                  )}
                </motion.div>
              ))}
              
              {images.length < 6 && (
                <label className={`aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${isUploading ? 'border-primary-400 bg-primary-50' : 'border-gray-200 cursor-pointer hover:border-primary-500 hover:bg-primary-50'}`}>
                  {isUploading ? (
                    <>
                      <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-2" />
                      <span className="text-sm text-primary-600">Upload en cours...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Ou uploadez</span>
                      <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (max 4.5MB)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              )}
              
              {uploadError && (
                <div className="col-span-full text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                  ⚠️ {uploadError}
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Tarification</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Prix (€)"
                type="number"
                placeholder="59"
                min="1"
                step="0.01"
                value={formData.price}
                onChange={(e) => { setFormData({ ...formData, price: e.target.value }); setHasChanges(true); }}
                required
              />

              <Input
                label="Prix promotionnel (€) - Optionnel"
                type="number"
                placeholder="49"
                min="1"
                step="0.01"
                value={formData.salePrice}
                onChange={(e) => { setFormData({ ...formData, salePrice: e.target.value }); setHasChanges(true); }}
              />
            </div>
          </div>

          {/* Features */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Fonctionnalités</h2>
            <p className="text-sm text-gray-500 mb-6">
              Listez les principales fonctionnalités de votre produit
            </p>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Ex: 100+ composants inclus"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1"
                  />
                  {features.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddFeature}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Ajouter une fonctionnalité
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Tags</h2>
            <p className="text-sm text-gray-500 mb-6">
              Ajoutez des tags pour améliorer la découvrabilité (appuyez sur Entrée pour ajouter)
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-primary-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <Input
              placeholder="Tapez un tag et appuyez sur Entrée..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
          </div>

          {/* Files */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Fichiers du template</h2>
            <p className="text-sm text-gray-500 mb-6">
              Uploadez votre fichier principal (ZIP, RAR) contenant tous les fichiers du template
            </p>

            {/* Zone de drop */}
            {!mainFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-500 hover:bg-primary-50'
                }`}
              >
                <motion.div
                  animate={{ scale: isDragging ? 1.05 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary-600" />
                  </div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {isDragging ? 'Déposez votre fichier ici' : 'Glissez-déposez votre fichier ici'}
                  </p>
                  <p className="text-gray-500 mb-4">ou</p>
                  <Button type="button" variant="secondary">
                    Parcourir les fichiers
                  </Button>
                  <p className="text-sm text-gray-400 mt-4">
                    Formats acceptés : ZIP, RAR • Taille maximale : 50 MB
                  </p>
                </motion.div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".zip,.rar,application/zip,application/x-zip-compressed,application/x-rar-compressed"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-xl p-6"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    mainFile.status === 'success' 
                      ? 'bg-accent-100' 
                      : mainFile.status === 'error'
                      ? 'bg-red-100'
                      : 'bg-primary-100'
                  }`}>
                    {mainFile.status === 'uploading' ? (
                      <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
                    ) : mainFile.status === 'success' ? (
                      <CheckCircle className="w-6 h-6 text-accent-600" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FileArchive className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-900 truncate">{mainFile.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{formatFileSize(mainFile.size)}</p>
                    
                    {mainFile.status === 'uploading' && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-500">Upload en cours...</span>
                          <span className="text-primary-600 font-medium">{Math.round(mainFile.progress)}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${mainFile.progress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {mainFile.status === 'success' && (
                      <p className="text-sm text-accent-600 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Fichier prêt
                      </p>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleRemoveMainFile}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer le fichier"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Input
                label="Version"
                placeholder="1.0.0"
                value={formData.version}
                onChange={(e) => { setFormData({ ...formData, version: e.target.value }); setHasChanges(true); }}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Types de fichiers inclus
                </label>
                <div className="flex flex-wrap gap-2">
                  {['HTML', 'CSS', 'JavaScript', 'TypeScript', 'PHP', 'Liquid', 'Figma', 'PSD', 'Sketch', 'React', 'Vue', 'Next.js'].map((type) => (
                    <label
                      key={type}
                      className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors ${
                        formData.filesIncluded.includes(type)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={formData.filesIncluded.includes(type)}
                        onChange={(e) => {
                          setHasChanges(true)
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              filesIncluded: [...formData.filesIncluded, type],
                            })
                          } else {
                            setFormData({
                              ...formData,
                              filesIncluded: formData.filesIncluded.filter((t) => t !== type),
                            })
                          }
                        }}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t">
            <div>
              {hasChanges && (
                <p className="text-sm text-warning-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Modifications non enregistrées
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Link href="/vendeur/produits">
                <Button variant="secondary" type="button">
                  Annuler
                </Button>
              </Link>
              {canResubmit ? (
                <Button 
                  onClick={handleSaveAndResubmit} 
                  isLoading={isLoading}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                >
                  Enregistrer et resoumettre
                </Button>
              ) : canSubmitDraft ? (
                <Button onClick={handleSubmitDraft} isLoading={isLoading}>
                  Soumettre pour révision
                </Button>
              ) : (
                <Button type="submit" isLoading={isLoading} disabled={!hasChanges}>
                  Enregistrer les modifications
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

