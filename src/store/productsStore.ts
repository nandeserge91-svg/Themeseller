import { create } from 'zustand'

export interface ProductReview {
  id: string
  rating: number
  title?: string
  comment?: string
  createdAt: string
  user: {
    name: string
    avatar?: string | null
  }
}

export interface Product {
  id: string
  title: string
  slug: string
  image: string
  images?: string[]
  price: number
  salePrice?: number | null
  sales: number
  revenue?: number
  status: 'active' | 'pending' | 'pending-review' | 'rejected' | 'suspended' | 'draft' | 'approved' | 'archived'
  rating: number
  reviewCount?: number
  views: number
  createdAt: string
  publishedAt?: string
  submittedAt?: string
  category: string
  categoryId: string
  categorySlug?: string
  description: string
  shortDescription?: string
  previewUrl?: string
  version: string
  features: string[]
  tags: string[]
  filesIncluded: string[]
  rejectionReason?: string | null
  fileName?: string
  fileSize?: number
  isFeatured?: boolean
  reviews?: ProductReview[]
  isNew?: boolean
  vendor: {
    id: string
    name: string
    email: string
    slug?: string
    userId?: string
  }
}

interface ProductsState {
  products: Product[]
  isLoading: boolean
  error: string | null
  lastFetch: number | null
  
  // Actions API
  fetchProducts: (filters?: { status?: string; vendorId?: string; category?: string }) => Promise<void>
  fetchProduct: (idOrSlug: string) => Promise<Product | null>
  createProduct: (product: Partial<Product>) => Promise<{ success: boolean; product?: Product; error?: string }>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<{ success: boolean; error?: string }>
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>
  
  // Aliases pour la compatibilité
  addProduct: (product: Partial<Product>) => Promise<{ success: boolean; product?: Product; error?: string }>
  saveDraft: (product: Partial<Product>) => Promise<{ success: boolean; product?: Product; error?: string }>
  
  // Actions admin
  approveProduct: (id: string) => Promise<{ success: boolean; error?: string }>
  rejectProduct: (id: string, reason: string) => Promise<{ success: boolean; error?: string }>
  suspendProduct: (id: string) => Promise<{ success: boolean; error?: string }>
  reactivateProduct: (id: string) => Promise<{ success: boolean; error?: string }>
  
  // Actions vendeur
  submitProduct: (id: string) => Promise<{ success: boolean; error?: string }>
  resubmitProduct: (id: string) => Promise<{ success: boolean; error?: string }>
  
  // Helpers
  getVendorProducts: (vendorId: string) => Product[]
  getPendingProducts: () => Product[]
  getActiveProducts: () => Product[]
  getProductBySlug: (slug: string) => Product | undefined
}

// Mapper le statut de l'API vers le format frontend
const mapStatus = (status: string): Product['status'] => {
  const statusMap: Record<string, Product['status']> = {
    'approved': 'active',
    'pending-review': 'pending',
    'pending_review': 'pending',
    'rejected': 'rejected',
    'archived': 'suspended',
    'draft': 'draft',
  }
  return statusMap[status] || status as Product['status']
}

// Mapper le statut du frontend vers l'API
const mapStatusToApi = (status: string): string => {
  const statusMap: Record<string, string> = {
    'active': 'APPROVED',
    'pending': 'PENDING_REVIEW',
    'rejected': 'REJECTED',
    'suspended': 'ARCHIVED',
    'draft': 'DRAFT',
  }
  return statusMap[status] || status.toUpperCase()
}

export const useProductsStore = create<ProductsState>()((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  lastFetch: null,

  fetchProducts: async (filters) => {
    set({ isLoading: true, error: null })
    
    try {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', mapStatusToApi(filters.status))
      if (filters?.vendorId) params.append('vendorId', filters.vendorId)
      if (filters?.category) params.append('category', filters.category)
      
      const url = `/api/products${params.toString() ? `?${params}` : ''}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des produits')
      }
      
      const data = await response.json()
      
      // Transformer les produits
      const products = data.products.map((p: any) => ({
        ...p,
        status: mapStatus(p.status),
        sales: p.sales || 0,
        revenue: (p.sales || 0) * p.price,
        image: p.image || p.images?.[0] || '',
      }))
      
      set({ products, isLoading: false, lastFetch: Date.now() })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur inconnue', 
        isLoading: false 
      })
    }
  },

  fetchProduct: async (idOrSlug) => {
    try {
      const response = await fetch(`/api/products/${idOrSlug}`)
      
      if (!response.ok) {
        return null
      }
      
      const data = await response.json()
      const product = {
        ...data.product,
        status: mapStatus(data.product.status),
        sales: data.product.sales || 0,
        revenue: (data.product.sales || 0) * data.product.price,
        image: data.product.image || data.product.images?.[0] || '',
      }
      
      return product
    } catch {
      return null
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productData,
          status: productData.status ? mapStatusToApi(productData.status) : undefined,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Erreur lors de la création' }
      }
      
      // Rafraîchir la liste
      await get().fetchProducts()
      
      return { success: true, product: data.product }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
  },

  // Alias pour addProduct - soumet pour review
  addProduct: async (productData) => {
    return get().createProduct({ ...productData, status: 'pending' })
  },

  // Alias pour saveDraft - sauvegarde comme brouillon
  saveDraft: async (productData) => {
    return get().createProduct({ ...productData, status: 'draft' })
  },

  updateProduct: async (id, updates) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Erreur lors de la mise à jour' }
      }
      
      // Mettre à jour localement
      set({
        products: get().products.map(p => 
          p.id === id ? { ...p, ...updates } : p
        )
      })
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const data = await response.json()
        return { success: false, error: data.error || 'Erreur lors de la suppression' }
      }
      
      // Supprimer localement
      set({
        products: get().products.filter(p => p.id !== id)
      })
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
  },

  approveProduct: async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        return { success: false, error: data.error }
      }
      
      // Mettre à jour localement
      set({
        products: get().products.map(p => 
          p.id === id ? { ...p, status: 'active' as const, rejectionReason: null } : p
        )
      })
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
  },

  rejectProduct: async (id, reason) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', reason }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        return { success: false, error: data.error }
      }
      
      set({
        products: get().products.map(p => 
          p.id === id ? { ...p, status: 'rejected' as const, rejectionReason: reason } : p
        )
      })
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
  },

  suspendProduct: async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'suspend' }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        return { success: false, error: data.error }
      }
      
      set({
        products: get().products.map(p => 
          p.id === id ? { ...p, status: 'suspended' as const } : p
        )
      })
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
  },

  reactivateProduct: async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reactivate' }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        return { success: false, error: data.error }
      }
      
      set({
        products: get().products.map(p => 
          p.id === id ? { ...p, status: 'active' as const, rejectionReason: null } : p
        )
      })
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
  },

  submitProduct: async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit' }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        return { success: false, error: data.error }
      }
      
      set({
        products: get().products.map(p => 
          p.id === id ? { ...p, status: 'pending' as const, submittedAt: new Date().toISOString() } : p
        )
      })
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
  },

  resubmitProduct: async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resubmit' }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        return { success: false, error: data.error }
      }
      
      set({
        products: get().products.map(p => 
          p.id === id ? { ...p, status: 'pending' as const, rejectionReason: null } : p
        )
      })
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
  },

  getVendorProducts: (vendorId) => {
    return get().products.filter(p => p.vendor.id === vendorId || p.vendor.userId === vendorId)
  },

  getPendingProducts: () => {
    return get().products.filter(p => p.status === 'pending' || p.status === 'pending-review')
  },

  getActiveProducts: () => {
    return get().products.filter(p => p.status === 'active' || p.status === 'approved')
  },

  getProductBySlug: (slug) => {
    return get().products.find(p => p.slug === slug)
  },
}))
