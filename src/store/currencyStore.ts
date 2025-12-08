import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Currency } from '@/lib/utils'

interface CurrencyStore {
  currency: Currency
  setCurrency: (currency: Currency) => void
  toggleCurrency: () => void
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currency: 'EUR',
      
      setCurrency: (currency) => set({ currency }),
      
      toggleCurrency: () => {
        const { currency } = get()
        set({ currency: currency === 'EUR' ? 'XOF' : 'EUR' })
      },
    }),
    {
      name: 'currency-storage',
    }
  )
)







