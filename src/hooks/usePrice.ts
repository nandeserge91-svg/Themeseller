'use client'

import { useCurrencyStore } from '@/store/currencyStore'
import { formatPrice as formatPriceUtil, formatPriceDual, EUR_TO_CFA_RATE } from '@/lib/utils'

export function usePrice() {
  const { currency } = useCurrencyStore()

  const formatPrice = (price: number | string) => {
    return formatPriceUtil(price, currency)
  }

  const formatPriceBoth = (price: number | string) => {
    return formatPriceDual(price)
  }

  const convertToCFA = (eurPrice: number) => {
    return Math.round(eurPrice * EUR_TO_CFA_RATE)
  }

  const convertToEUR = (cfaPrice: number) => {
    return cfaPrice / EUR_TO_CFA_RATE
  }

  return {
    currency,
    formatPrice,
    formatPriceBoth,
    convertToCFA,
    convertToEUR,
  }
}







