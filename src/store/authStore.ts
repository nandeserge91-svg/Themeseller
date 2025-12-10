import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Role } from '@prisma/client'

interface VendorProfile {
  id: string
  storeName: string
  slug: string
  isVerified?: boolean
}

interface User {
  id: string
  email: string
  role: Role
  firstName?: string
  lastName?: string
  avatar?: string
  vendorProfile?: VendorProfile | null
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  fetchUser: () => Promise<void>
  
  // Computed
  isAuthenticated: () => boolean
  isVendor: () => boolean
  isAdmin: () => boolean
  getVendorId: () => string | null
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,

      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),

      logout: () => {
        set({ user: null })
        // Appeler l'API de déconnexion
        fetch('/api/auth/logout', { method: 'POST' })
      },

      fetchUser: async () => {
        try {
          set({ isLoading: true })
          const response = await fetch('/api/auth/me')
          if (response.ok) {
            const data = await response.json()
            set({ user: data.user, isLoading: false })
          } else {
            set({ user: null, isLoading: false })
          }
        } catch {
          set({ user: null, isLoading: false })
        }
      },

      isAuthenticated: () => get().user !== null,
      isVendor: () => get().user?.role === 'VENDOR' || get().user?.role === 'ADMIN',
      isAdmin: () => get().user?.role === 'ADMIN',
      getVendorId: () => get().user?.vendorProfile?.id || null,
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)







