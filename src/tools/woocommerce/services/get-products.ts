// Fetch products from WooCommerce Store API

import { WooProduct } from "../types";
import { getWcBaseUrl } from "../../../lib/utils";

interface FetchProductsOptions {
  search?: string;
  category?: string;
  perPage?: number;
}

export async function fetchProducts(options: FetchProductsOptions = {}): Promise<WooProduct[]> {
  const wcBaseUrl = getWcBaseUrl();
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
    `${wcBaseUrl}/products?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const products: WooProduct[] = await response.json();
  return products;
}
