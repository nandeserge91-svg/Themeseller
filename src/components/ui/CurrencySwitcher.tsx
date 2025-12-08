'use client'

import { useState, useEffect } from 'react'
import { useCurrencyStore } from '@/store/currencyStore'
import { Currency } from '@/lib/utils'

export default function CurrencySwitcher() {
  const [mounted, setMounted] = useState(false)
  const { currency, setCurrency } = useCurrencyStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center bg-gray-100 rounded-lg p-1">
        <button className="px-3 py-1.5 rounded-md text-sm font-medium bg-white shadow-sm">
          €
        </button>
        <button className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600">
          CFA
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setCurrency('EUR')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          currency === 'EUR'
            ? 'bg-white shadow-sm text-primary-600'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        € EUR
      </button>
      <button
        onClick={() => setCurrency('XOF')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          currency === 'XOF'
            ? 'bg-white shadow-sm text-primary-600'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        CFA
      </button>
    </div>
  )
}







