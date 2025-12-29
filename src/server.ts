// Shared MCP server factory
// Used by both local dev server and serverless

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchWeather } from "@/tools/weather";
import { fetchProducts, fetchProductById } from "@/tools/woocommerce";
import { formatProductText } from "@/lib/utils";

// Base URL for widget assets (set via environment or default)
const WIDGET_BASE_URL = process.env.WIDGET_BASE_URL || "https://mcp.johnquery.com";

// Generate widget HTML with proper AINativeKit setup
function getWidgetHtml(widgetType: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MCP Widget</title>
</head>
<body>
  <div id="root"></div>
  <script>window.__WIDGET_TYPE__ = "${widgetType}";</script>
  <script type="module" src="${WIDGET_BASE_URL}/widget/assets/index.js"></script>
</body>
</html>`;
}

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "mcp-ainativekit-playground",
    version: "1.0.0",
  });

  // Register weather widget resource for ChatGPT Apps
  server.registerResource(
    "weather-widget",
    "ui://widget/weather.html",
    { mimeType: "text/html+skybridge" },
    async () => ({
      contents: [
        {
          uri: "ui://widget/weather.html",
          mimeType: "text/html+skybridge",
          text: getWidgetHtml("weather"),
        },
      ],
    })
  );

  // Register products widget resource for ChatGPT Apps
  server.registerResource(
    "products-widget",
    "ui://widget/products.html",
    { mimeType: "text/html+skybridge" },
    async () => ({
      contents: [
        {
          uri: "ui://widget/products.html",
          mimeType: "text/html+skybridge",
          text: getWidgetHtml("products"),
        },
      ],
    })
  );

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
        "openai/outputTemplate": "ui://widget/weather.html",
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
        "openai/outputTemplate": "ui://widget/products.html",
        "openai/toolInvocation/invoking": "Fetching products...",
        "openai/toolInvocation/invoked": "Products loaded!",
      },
    },
    async ({ search, category, perPage }) => {
      try {
        const products = await fetchProducts({ search, category, perPage });
        const productList = products.map(formatProductText).join("\n\n");
        return {
          structuredContent: { type: "array", items: products },
          content: [
            {
              type: "text" as const,
              text: `Found ${products.length} products:\n\n${productList}`,
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
        "openai/outputTemplate": "ui://widget/products.html",
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
              text: `Product Details:\n\n${formatProductText(product)}`,
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
