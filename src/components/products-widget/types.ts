// Products widget types

export interface ProductImage {
  src: string
  alt: string
}

export interface ProductCategory {
  name: string
}

export interface ProductPrices {
  price: string
  regular_price: string
  sale_price: string
  currency_symbol: string
  currency_minor_unit: number
}

export interface Product {
  id: number
  name: string
  short_description: string
  permalink: string
  prices: ProductPrices
  on_sale: boolean
  average_rating: string
  review_count: number
  images: ProductImage[]
  categories: ProductCategory[]
  is_in_stock: boolean
}

export interface ProductsWidgetProps {
  products: Product[]
}
