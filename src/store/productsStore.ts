import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
  id: string
  title: string
  slug: string
  image: string
  price: number
  salePrice?: number
  sales: number
  revenue: number
  status: 'active' | 'pending' | 'rejected' | 'suspended' | 'draft'
  rating: number
  views: number
  createdAt: string
  submittedAt?: string
  category: string
  categoryId: string
  description: string
  shortDescription: string
  previewUrl?: string
  version: string
  features: string[]
  tags: string[]
  filesIncluded: string[]
  rejectionReason?: string
  fileName?: string
  fileSize?: number
  // Info vendeur
  vendor: {
    id: string
    name: string
    email: string
  }
}

interface ProductsState {
  products: Product[]
  addProduct: (product: Omit<Product, 'id' | 'slug' | 'sales' | 'revenue' | 'rating' | 'views' | 'createdAt' | 'submittedAt'>) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  approveProduct: (id: string) => void
  rejectProduct: (id: string, reason: string) => void
  suspendProduct: (id: string) => void
  reactivateProduct: (id: string) => void
  submitProduct: (id: string) => void
  resubmitProduct: (id: string) => void
  saveDraft: (product: Omit<Product, 'id' | 'slug' | 'sales' | 'revenue' | 'rating' | 'views' | 'createdAt' | 'status'>) => void
  getVendorProducts: (vendorId: string) => Product[]
  getPendingProducts: () => Product[]
}

// Générer un slug à partir du titre
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

// Produits initiaux de démonstration (admin et vendeurs)
const initialProducts: Product[] = [
  // Produits du vendeur "current-vendor" (vendeur connecté en démo)
  {
    id: 'v1',
    title: 'ProBusiness - Template WordPress Premium',
    slug: 'probusiness-template-wordpress',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=200&h=150&fit=crop',
    price: 59,
    sales: 124,
    revenue: 6076,
    status: 'active',
    rating: 4.8,
    views: 3420,
    createdAt: '2024-01-01',
    submittedAt: '2023-12-28',
    category: 'WordPress',
    categoryId: 'cat1',
    description: 'Un template WordPress premium pour les entreprises.',
    shortDescription: 'Template business moderne et responsive.',
    version: '2.1.0',
    features: ['Responsive', '50+ pages', 'SEO optimisé'],
    tags: ['business', 'corporate', 'professional'],
    filesIncluded: ['HTML', 'CSS', 'JavaScript', 'PHP'],
    vendor: { id: 'current-vendor', name: 'Mon Entreprise', email: 'vendeur@demo.com' },
  },
  {
    id: 'v2',
    title: 'SaaS Landing Page - HTML5 Template',
    slug: 'saas-landing-page-html5',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop',
    price: 39,
    sales: 89,
    revenue: 3471,
    status: 'active',
    rating: 4.6,
    views: 2156,
    createdAt: '2024-01-05',
    submittedAt: '2024-01-02',
    category: 'HTML',
    categoryId: 'cat4',
    description: 'Landing page moderne pour les applications SaaS.',
    shortDescription: 'Landing page SaaS avec animations.',
    version: '1.5.0',
    features: ['Animations CSS', 'Mobile first', 'Fast loading'],
    tags: ['saas', 'startup', 'landing'],
    filesIncluded: ['HTML', 'CSS', 'JavaScript'],
    vendor: { id: 'current-vendor', name: 'Mon Entreprise', email: 'vendeur@demo.com' },
  },
  // Produits d'autres vendeurs (visibles par l'admin)
  {
    id: 'a1',
    title: 'Dashboard UI Kit - Figma',
    slug: 'dashboard-ui-kit-figma',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=150&fit=crop',
    price: 79,
    sales: 0,
    revenue: 0,
    status: 'pending',
    rating: 0,
    views: 0,
    createdAt: '2024-01-15',
    submittedAt: '2024-01-15',
    category: 'Figma',
    categoryId: 'cat5',
    description: 'Kit UI complet pour tableaux de bord.',
    shortDescription: 'Dashboard UI Kit professionnel.',
    version: '1.0.0',
    features: ['100+ composants', 'Dark mode', 'Responsive'],
    tags: ['figma', 'dashboard', 'ui-kit'],
    filesIncluded: ['Figma'],
    vendor: { id: 'vendor-2', name: 'FigmaDesigns', email: 'team@figmadesigns.com' },
  },
  {
    id: 'a2',
    title: 'E-commerce Funnel Pack',
    slug: 'ecommerce-funnel-pack',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=200&h=150&fit=crop',
    price: 149,
    sales: 0,
    revenue: 0,
    status: 'rejected',
    rating: 0,
    views: 0,
    createdAt: '2024-01-12',
    submittedAt: '2024-01-12',
    category: 'Funnels',
    categoryId: 'cat6',
    description: 'Pack complet de funnels e-commerce.',
    shortDescription: 'Funnels de vente e-commerce.',
    version: '1.0.0',
    features: ['5 funnels', 'Pages de vente', 'Upsells'],
    tags: ['funnel', 'ecommerce', 'sales'],
    filesIncluded: ['HTML', 'CSS'],
    rejectionReason: 'Qualité des fichiers insuffisante. Veuillez améliorer les images de prévisualisation.',
    vendor: { id: 'vendor-3', name: 'FunnelMasters', email: 'hello@funnelmasters.io' },
  },
  {
    id: 'a3',
    title: 'ShopifyPro - Thème E-commerce Premium',
    slug: 'shopifypro-ecommerce',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=150&fit=crop',
    price: 149,
    sales: 0,
    revenue: 0,
    status: 'pending',
    rating: 0,
    views: 0,
    createdAt: '2024-01-18',
    submittedAt: '2024-01-18',
    category: 'Shopify',
    categoryId: 'cat2',
    description: 'Thème Shopify premium pour boutiques e-commerce.',
    shortDescription: 'Thème Shopify moderne et optimisé.',
    version: '1.0.0',
    features: ['Responsive', 'Fast', 'SEO ready'],
    tags: ['shopify', 'ecommerce', 'theme'],
    filesIncluded: ['Liquid', 'CSS', 'JavaScript'],
    vendor: { id: 'vendor-4', name: 'ShopifyExperts', email: 'support@shopifyexperts.com' },
  },
  {
    id: 'a4',
    title: 'SystemePro - Tunnel de Vente',
    slug: 'systemepro-tunnel',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=200&h=150&fit=crop',
    price: 97,
    sales: 45,
    revenue: 3706,
    status: 'suspended',
    rating: 4.2,
    views: 1890,
    createdAt: '2023-12-20',
    submittedAt: '2023-12-15',
    category: 'Systeme.io',
    categoryId: 'cat3',
    description: 'Tunnel de vente complet pour Systeme.io.',
    shortDescription: 'Tunnel de vente optimisé.',
    version: '2.0.0',
    features: ['Pages de capture', 'Séquence email', 'Checkout'],
    tags: ['systeme.io', 'funnel', 'sales'],
    filesIncluded: ['HTML', 'CSS'],
    rejectionReason: 'Produit suspendu suite à plusieurs plaintes clients.',
    vendor: { id: 'vendor-5', name: 'FunnelExperts', email: 'team@funnelexperts.com' },
  },
  {
    id: 'a5',
    title: 'CoachingFunnel - Pack Coach Systeme.io',
    slug: 'coachingfunnel-pack-coach',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=150&fit=crop',
    price: 127,
    sales: 0,
    revenue: 0,
    status: 'pending',
    rating: 0,
    views: 0,
    createdAt: '2024-01-19',
    submittedAt: '2024-01-19',
    category: 'Systeme.io',
    categoryId: 'cat3',
    description: 'Pack complet pour coachs sur Systeme.io.',
    shortDescription: 'Tout pour lancer votre activité de coaching.',
    version: '1.0.0',
    features: ['Tunnel complet', 'Espace membre', 'Emails'],
    tags: ['coaching', 'systeme.io', 'formation'],
    filesIncluded: ['HTML', 'CSS'],
    vendor: { id: 'vendor-5', name: 'FunnelExperts', email: 'team@funnelexperts.com' },
  },
  {
    id: 'a6',
    title: 'FashionStore - Thème Mode Shopify',
    slug: 'fashionstore-shopify',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200&h=150&fit=crop',
    price: 159,
    sales: 0,
    revenue: 0,
    status: 'pending',
    rating: 0,
    views: 0,
    createdAt: '2024-01-20',
    submittedAt: '2024-01-20',
    category: 'Shopify',
    categoryId: 'cat2',
    description: 'Thème Shopify spécialisé mode et fashion.',
    shortDescription: 'Thème élégant pour boutiques de mode.',
    version: '1.0.0',
    features: ['Lookbook', 'Quick view', 'Wishlist'],
    tags: ['shopify', 'fashion', 'mode'],
    filesIncluded: ['Liquid', 'CSS', 'JavaScript'],
    vendor: { id: 'vendor-4', name: 'ShopifyExperts', email: 'support@shopifyexperts.com' },
  },
  {
    id: 'a7',
    title: 'EmailPro - Collection Templates Email',
    slug: 'emailpro-templates',
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=200&h=150&fit=crop',
    price: 29,
    sales: 234,
    revenue: 5746,
    status: 'active',
    rating: 4.9,
    views: 4520,
    createdAt: '2023-11-15',
    submittedAt: '2023-11-10',
    category: 'Email',
    categoryId: 'cat7',
    description: 'Collection de templates email professionnels.',
    shortDescription: '50+ templates email responsive.',
    version: '3.0.0',
    features: ['50+ templates', 'Compatible tous clients', 'Responsive'],
    tags: ['email', 'newsletter', 'marketing'],
    filesIncluded: ['HTML', 'CSS'],
    vendor: { id: 'vendor-6', name: 'DesignHub', email: 'hello@designhub.io' },
  },
]

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      
      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: `prod-${Date.now()}`,
          slug: generateSlug(product.title),
          sales: 0,
          revenue: 0,
          rating: 0,
          views: 0,
          createdAt: new Date().toISOString().split('T')[0],
          submittedAt: new Date().toISOString().split('T')[0],
        }
        set({ products: [newProduct, ...get().products] })
      },
      
      updateProduct: (id, updates) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })
      },
      
      deleteProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) })
      },
      
      approveProduct: (id) => {
        set({
          products: get().products.map((p) =>
            p.id === id
              ? { ...p, status: 'active' as const, rejectionReason: undefined }
              : p
          ),
        })
      },
      
      rejectProduct: (id, reason) => {
        set({
          products: get().products.map((p) =>
            p.id === id
              ? { ...p, status: 'rejected' as const, rejectionReason: reason }
              : p
          ),
        })
      },
      
      suspendProduct: (id) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, status: 'suspended' as const } : p
          ),
        })
      },
      
      reactivateProduct: (id) => {
        set({
          products: get().products.map((p) =>
            p.id === id
              ? { ...p, status: 'active' as const, rejectionReason: undefined }
              : p
          ),
        })
      },
      
      submitProduct: (id) => {
        set({
          products: get().products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: 'pending' as const,
                  submittedAt: new Date().toISOString().split('T')[0],
                  rejectionReason: undefined,
                }
              : p
          ),
        })
      },
      
      resubmitProduct: (id) => {
        set({
          products: get().products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: 'pending' as const,
                  submittedAt: new Date().toISOString().split('T')[0],
                  rejectionReason: undefined,
                }
              : p
          ),
        })
      },
      
      saveDraft: (product) => {
        const newProduct: Product = {
          ...product,
          id: `draft-${Date.now()}`,
          slug: generateSlug(product.title || 'brouillon'),
          sales: 0,
          revenue: 0,
          rating: 0,
          views: 0,
          createdAt: new Date().toISOString().split('T')[0],
          status: 'draft',
        }
        set({ products: [newProduct, ...get().products] })
      },
      
      getVendorProducts: (vendorId) => {
        return get().products.filter((p) => p.vendor.id === vendorId)
      },
      
      getPendingProducts: () => {
        return get().products.filter((p) => p.status === 'pending')
      },
    }),
    {
      name: 'products-storage',
    }
  )
)


