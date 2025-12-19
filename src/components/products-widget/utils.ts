// Products widget utility functions

import { ProductPrices } from './types'

export const formatPrice = (price: string, prices: ProductPrices): string => {
  const amount = parseInt(price, 10) / Math.pow(10, prices.currency_minor_unit)
  return `${prices.currency_symbol}${amount.toFixed(2)}`
}

export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '')
}
