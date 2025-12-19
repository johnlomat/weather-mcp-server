// Fetch single product by ID from WooCommerce Store API

import { WooProduct } from "../types";

export async function fetchProductById(id: number): Promise<WooProduct> {
  const baseUrl = process.env.WOOCOMMERCE_URL;

  if (!baseUrl) {
    throw new Error("WOOCOMMERCE_URL environment variable is not set");
  }

  const response = await fetch(
    `${baseUrl}/wp-json/wc/store/v1/products/${id}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  const product: WooProduct = await response.json();
  return product;
}
