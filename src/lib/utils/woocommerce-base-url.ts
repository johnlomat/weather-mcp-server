// WooCommerce base URL utility

export function getWcBaseUrl(): string {
  const baseUrl = process.env.WOOCOMMERCE_URL;

  if (!baseUrl) {
    throw new Error("WOOCOMMERCE_URL environment variable is not set");
  }

  return `${baseUrl}/wp-json/wc/store/v1`;
}
