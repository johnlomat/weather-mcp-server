// Fetch products from WooCommerce Store API

import { WooProduct } from "../types";

interface FetchProductsOptions {
  search?: string;
  category?: string;
  perPage?: number;
}

export async function fetchProducts(options: FetchProductsOptions = {}): Promise<WooProduct[]> {
  const baseUrl = process.env.WOOCOMMERCE_URL;

  if (!baseUrl) {
    throw new Error("WOOCOMMERCE_URL environment variable is not set");
  }

  const { search, category, perPage = 10 } = options;

  const params = new URLSearchParams();
  params.set("per_page", String(perPage));

  if (search) {
    params.set("search", search);
  }

  if (category) {
    params.set("category", category);
  }

  const response = await fetch(
    `${baseUrl}/wp-json/wc/store/v1/products?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const products: WooProduct[] = await response.json();
  return products;
}
