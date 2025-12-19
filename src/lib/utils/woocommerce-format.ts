// WooCommerce formatting utilities

import { stripHtml } from "./strip-html";

// Minimal interface for price formatting (works with both full WooProductPrices and widget ProductPrices)
interface PriceInfo {
  price: string;
  currency_symbol: string;
  currency_minor_unit: number;
}

// Minimal interface for product text formatting
interface ProductInfo {
  id: number;
  name: string;
  prices: PriceInfo;
  on_sale: boolean;
  is_in_stock: boolean;
  average_rating: string;
  review_count: number;
  categories: { name: string }[];
}

/**
 * Format a price string using currency info
 * @param price - The price string (e.g., "1999" for $19.99)
 * @param priceInfo - Object containing currency_symbol and currency_minor_unit
 */
export function formatPrice(price: string, priceInfo: Pick<PriceInfo, 'currency_symbol' | 'currency_minor_unit'>): string {
  const amount = parseInt(price, 10) / Math.pow(10, priceInfo.currency_minor_unit);
  return `${priceInfo.currency_symbol}${amount.toFixed(2)}`;
}

/**
 * Format a product for text response (used by MCP tool responses)
 */
export function formatProductText(product: ProductInfo): string {
  const name = stripHtml(product.name);
  const price = formatPrice(product.prices.price, product.prices);
  const saleInfo = product.on_sale ? " (On Sale)" : "";
  const stock = product.is_in_stock ? "In Stock" : "Out of Stock";
  const rating = product.average_rating !== "0"
    ? `${product.average_rating}/5 (${product.review_count} reviews)`
    : "No reviews";
  const category = stripHtml(product.categories[0]?.name || "Uncategorized");

  return `• ${name}
  ID: ${product.id}
  Price: ${price}${saleInfo}
  Stock: ${stock}
  Category: ${category}
  Rating: ${rating}`;
}
