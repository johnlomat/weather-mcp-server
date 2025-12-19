// WooCommerce types

export interface WooProductImage {
  id: number;
  src: string;
  thumbnail: string;
  srcset: string;
  sizes: string;
  name: string;
  alt: string;
}

export interface WooProductCategory {
  id: number;
  name: string;
  slug: string;
  link: string;
}

export interface WooProductPrices {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_code: string;
  currency_symbol: string;
  currency_prefix: string;
  currency_suffix: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
}

export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  type: string;
  sku: string;
  description: string;
  short_description: string;
  permalink: string;
  prices: WooProductPrices;
  on_sale: boolean;
  average_rating: string;
  review_count: number;
  images: WooProductImage[];
  categories: WooProductCategory[];
  is_in_stock: boolean;
  is_purchasable: boolean;
}
