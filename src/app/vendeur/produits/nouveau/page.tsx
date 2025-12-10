'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  Trash2
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useProductsStore } from '@/store/productsStore'

interface Category {
  id: string
  name: string
  slug: string
}

interface UploadedFile {
  file: File
  name: string
  size: number
  progress: number
  status: 'uploading' | 'success' | 'error'
  url?: string
}

export default function NouveauProduitPage() {
  const router = useRouter()
  const { addProduct, saveDraft } = useProductsStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [features, setFeatures] = useState<string[]>([''])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [mainFile, setMainFile] = useState<UploadedFile | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Vérifier l'authentification et charger les catégories au chargement
  useEffect(() => {
    const init = async () => {
      try {
        // Vérifier l'authentification
        const authResponse = await fetch('/api/auth/me')
        if (!authResponse.ok) {
          setAuthError('Vous devez être connecté pour accéder à cette page.')
          return
        }
        const authData = await authResponse.json()
        if (authData.user?.role !== 'VENDOR' && authData.user?.role !== 'ADMIN') {
          setAuthError('Vous devez avoir un compte vendeur pour soumettre des produits.')
          return
        }
        
        // Charger les catégories
        const catResponse = await fetch('/api/categories')
        if (catResponse.ok) {
          const catData = await catResponse.json()
          setCategories(catData.categories || [])
        }
        
        setAuthError(null)
      } catch {
        setAuthError('Erreur de vérification. Veuillez vous reconnecter.')
      } finally {
        setIsCheckingAuth(false)
      }
    }
    init()
  }, [])

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
    // Vérifier le type de fichier
    const validTypes = ['application/zip', 'application/x-zip-compressed', 'application/x-rar-compressed', 'application/vnd.rar']
    if (!validTypes.includes(file.type) && !file.name.match(/\.(zip|rar)$/i)) {
      setNotification({ type: 'error', message: 'Format de fichier non valide. Utilisez ZIP ou RAR.' })
      return
    }

    // Vérifier la taille (50 MB max)
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

    // Simuler la progression de l'upload
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Upload d'images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remainingSlots = 6 - images.length
    const filesToAdd = files.slice(0, remainingSlots)

    filesToAdd.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        setImages((prev) => [...prev, url])
        setImageFiles((prev) => [...prev, file])
      }
    })
  }

  const handleAddFeature = () => {
    setFeatures([...features, ''])
  }

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title.trim()) {
      setNotification({ type: 'error', message: 'Veuillez entrer un titre pour votre produit.' })
      return
    }

    if (!formData.categoryId) {
      setNotification({ type: 'error', message: 'Veuillez sélectionner une catégorie.' })
      return
    }

    if (!formData.price) {
      setNotification({ type: 'error', message: 'Veuillez définir un prix.' })
      return
    }

    if (!mainFile || mainFile.status !== 'success') {
      setNotification({ type: 'error', message: 'Veuillez uploader le fichier de votre template.' })
      return
    }

    if (images.length === 0) {
      setNotification({ type: 'error', message: 'Veuillez ajouter au moins une image de prévisualisation.' })
      return
    }

    setIsLoading(true)

    try {
      // Simuler l'envoi à l'API
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Trouver le nom de la catégorie
      const selectedCategory = categories.find(c => c.id === formData.categoryId)
      
      // Ajouter le produit au store avec statut "pending"
      const result = await addProduct({
        title: formData.title,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop'],
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        categoryId: formData.categoryId,
        description: formData.description || '<p>Description du produit</p>',
        shortDescription: formData.shortDescription,
        previewUrl: formData.previewUrl,
        version: formData.version,
        features: features.filter(f => f.trim() !== ''),
        tags: tags,
        filesIncluded: formData.filesIncluded,
        mainFile: mainFile.url || '',
      })

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la soumission')
      }

      setNotification({ type: 'success', message: 'Produit soumis avec succès ! En attente d\'approbation.' })
      
      setTimeout(() => {
        router.push('/vendeur/produits?filter=pending')
      }, 1500)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la soumission'
      // Messages d'erreur spécifiques
      if (errorMessage.includes('Non authentifié') || errorMessage.includes('Token invalide')) {
        setNotification({ type: 'error', message: 'Vous devez être connecté pour soumettre un produit.' })
      } else if (errorMessage.includes('Profil vendeur requis')) {
        setNotification({ type: 'error', message: 'Vous devez avoir un compte vendeur pour soumettre un produit. Inscrivez-vous en tant que vendeur.' })
      } else if (errorMessage.includes('Champs requis')) {
        setNotification({ type: 'error', message: 'Veuillez remplir tous les champs requis (titre, description, prix, catégorie).' })
      } else {
        setNotification({ type: 'error', message: errorMessage })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    try {
      const result = await saveDraft({
        title: formData.title || 'Brouillon sans titre',
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop'],
        price: formData.price ? parseFloat(formData.price) : 0,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        categoryId: formData.categoryId || categories[0]?.id,
        description: formData.description || '<p>Description à compléter</p>',
        shortDescription: formData.shortDescription,
        previewUrl: formData.previewUrl,
        version: formData.version,
        features: features.filter(f => f.trim() !== ''),
        tags: tags,
        filesIncluded: formData.filesIncluded,
        mainFile: mainFile?.url || '',
      })

      if (!result.success) {
        setNotification({ type: 'error', message: result.error || 'Erreur lors de l\'enregistrement' })
        return
      }
      
      setNotification({ type: 'success', message: 'Brouillon enregistré !' })
      
      setTimeout(() => {
        router.push('/vendeur/produits?filter=draft')
      }, 1500)
    } catch (error) {
      setNotification({ type: 'error', message: 'Erreur lors de l\'enregistrement du brouillon' })
    }
  }

  // Afficher un loader pendant la vérification d'authentification
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Vérification en cours...</p>
        </div>
      </div>
    )
  }

  // Afficher un message d'erreur si l'utilisateur n'est pas autorisé
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
          <p className="text-gray-600 mb-6">{authError}</p>
          <div className="flex gap-4 justify-center">
            <Link href="/connexion">
              <Button>Se connecter</Button>
            </Link>
            <Link href="/devenir-vendeur">
              <Button variant="secondary">Devenir vendeur</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
                <h1 className="text-xl font-bold text-gray-900">Nouveau produit</h1>
                <p className="text-sm text-gray-500">Remplissez les informations de votre template</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" type="button" onClick={handleSaveDraft}>
                Enregistrer le brouillon
              </Button>
              <Button onClick={handleSubmit} isLoading={isLoading}>
                Soumettre pour révision
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations de base</h2>
            
            <div className="space-y-6">
              <Input
                label="Titre du produit"
                placeholder="Ex: SaaSify - Admin Dashboard Premium"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, previewUrl: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Images de prévisualisation</h2>
            <p className="text-sm text-gray-500 mb-6">
              Ajoutez jusqu'à 6 images de votre produit. La première sera l'image principale.
            </p>

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
                      setImageFiles(imageFiles.filter((_, i) => i !== index))
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
                <label className="aspect-video border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Ajouter une image</span>
                  <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
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
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />

              <Input
                label="Prix promotionnel (€) - Optionnel"
                type="number"
                placeholder="49"
                min="1"
                step="0.01"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
              />
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-xl flex gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Commission plateforme : 15%</p>
                <p>Vous recevrez 85% du prix de vente sur chaque transaction.</p>
              </div>
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

          {/* Files - Section principale améliorée */}
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
                        Fichier uploadé avec succès
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
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
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

            {/* Info supplémentaire */}
            <div className="mt-6 p-4 bg-amber-50 rounded-xl flex gap-3">
              <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700">
                <p className="font-medium mb-1">Conseils pour vos fichiers :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Incluez un fichier README avec les instructions d'installation</li>
                  <li>Organisez vos fichiers dans des dossiers clairs</li>
                  <li>Compressez les images pour réduire la taille du fichier</li>
                  <li>Testez votre archive avant de la soumettre</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t">
            <p className="text-sm text-gray-500">
              Votre produit sera examiné par notre équipe avant publication.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" type="button" onClick={handleSaveDraft}>
                Enregistrer le brouillon
              </Button>
              <Button type="submit" isLoading={isLoading} disabled={!mainFile || mainFile.status !== 'success'}>
                Soumettre pour révision
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
