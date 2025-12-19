// Shared MCP server factory
// Used by both local dev server and serverless

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchWeather } from "./tools/weather";
import { fetchProducts, fetchProductById } from "./tools/woocommerce";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "mcp-ainativekit-playground",
    version: "1.0.0",
  });

  // Register weather tool
  server.registerTool(
    "get-weather",
    {
      title: "Get Weather",
      description: "Get current weather information for a city",
      inputSchema: {
        city: z.string().describe("City name to get weather for (e.g., 'London', 'New York', 'Tokyo')"),
      },
      _meta: {
        "openai/outputTemplate": "ui://widget/index.html?type=weather",
        "openai/toolInvocation/invoking": "Checking the weather...",
        "openai/toolInvocation/invoked": "Weather data ready!",
      },
    },
    async ({ city }) => {
      try {
        const weather = await fetchWeather(city);
        return {
          structuredContent: { type: "object", properties: weather },
          content: [
            {
              type: "text" as const,
              text: `Current weather in ${weather.location}: ${weather.temperature}°C, humidity ${weather.humidity}%, wind ${weather.windSpeed} km/h`,
            },
          ],
          _meta: { ...weather } as Record<string, unknown>,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch weather";
        return {
          structuredContent: { error: errorMessage },
          content: [{ type: "text" as const, text: errorMessage }],
          _meta: { error: errorMessage } as Record<string, unknown>,
        };
      }
    }
  );

  // Register get-products tool
  server.registerTool(
    "get-products",
    {
      title: "Get Products",
      description: "Get a list of products from the WooCommerce store",
      inputSchema: {
        search: z.string().optional().describe("Search term to filter products"),
        category: z.string().optional().describe("Category slug to filter products"),
        perPage: z.number().optional().describe("Number of products to return (default: 10)"),
      },
      _meta: {
        "openai/outputTemplate": "ui://widget/index.html?type=products",
        "openai/toolInvocation/invoking": "Fetching products...",
        "openai/toolInvocation/invoked": "Products loaded!",
      },
    },
    async ({ search, category, perPage }) => {
      try {
        const products = await fetchProducts({ search, category, perPage });
        const productSummary = products.map(p => p.name).join(", ");
        return {
          structuredContent: { type: "array", items: products },
          content: [
            {
              type: "text" as const,
              text: `Found ${products.length} products: ${productSummary}`,
            },
          ],
          _meta: { products } as Record<string, unknown>,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch products";
        return {
          structuredContent: { error: errorMessage },
          content: [{ type: "text" as const, text: errorMessage }],
          _meta: { error: errorMessage } as Record<string, unknown>,
        };
      }
    }
  );

  // Register get-product-by-id tool
  server.registerTool(
    "get-product-by-id",
    {
      title: "Get Product by ID",
      description: "Get detailed information about a specific product by its ID",
      inputSchema: {
        id: z.number().describe("The product ID to fetch"),
      },
      _meta: {
        "openai/outputTemplate": "ui://widget/index.html?type=products",
        "openai/toolInvocation/invoking": "Fetching product details...",
        "openai/toolInvocation/invoked": "Product details loaded!",
      },
    },
    async ({ id }) => {
      try {
        const product = await fetchProductById(id);
        return {
          structuredContent: { type: "object", properties: product },
          content: [
            {
              type: "text" as const,
              text: `Product: ${product.name} - ${product.is_in_stock ? "In Stock" : "Out of Stock"}`,
            },
          ],
          _meta: { ...product } as Record<string, unknown>,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch product";
        return {
          structuredContent: { error: errorMessage },
          content: [{ type: "text" as const, text: errorMessage }],
          _meta: { error: errorMessage } as Record<string, unknown>,
        };
      }
    }
  );

  return server;
}
