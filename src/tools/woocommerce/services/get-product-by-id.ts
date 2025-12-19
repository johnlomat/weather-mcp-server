// Fetch single product by ID from WooCommerce Store API

import { WooProduct } from "../types";
import { getWcBaseUrl } from "@/lib/utils";

export async function fetchProductById(id: number): Promise<WooProduct> {
  const wcBaseUrl = getWcBaseUrl();

  const response = await fetch(
    `${wcBaseUrl}/products/${id}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  const product: WooProduct = await response.json();
  return product;
}
