import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Role } from '@prisma/client'

interface User {
  id: string
  email: string
  role: Role
  firstName?: string
  lastName?: string
  avatar?: string
}

interface AuthStore {
  user: User | null
  isLoading: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  
  // Computed
  isAuthenticated: () => boolean
  isVendor: () => boolean
  isAdmin: () => boolean
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

      isAuthenticated: () => get().user !== null,
      isVendor: () => get().user?.role === 'VENDOR' || get().user?.role === 'ADMIN',
      isAdmin: () => get().user?.role === 'ADMIN',
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)







