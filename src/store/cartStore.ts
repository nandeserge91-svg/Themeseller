import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartProduct {
  id: string
  title: string
  slug: string
  price: number
  salePrice?: number
  image: string
  vendorName: string
  vendorId: string
}

interface CartStore {
  items: CartProduct[]
  isOpen: boolean
  
  // Actions
  addItem: (product: CartProduct) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  
  // Computed
  getTotal: () => number
  getItemCount: () => number
  isInCart: (productId: string) => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product) => {
        const { items } = get()
        const exists = items.find((item) => item.id === product.id)
        
        if (!exists) {
          set({ items: [...items, product] })
        }
      },

      removeItem: (productId) => {
        const { items } = get()
        set({ items: items.filter((item) => item.id !== productId) })
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          const price = item.salePrice || item.price
          return total + price
        }, 0)
      },

      getItemCount: () => get().items.length,

      isInCart: (productId) => {
        const { items } = get()
        return items.some((item) => item.id === productId)
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
)







