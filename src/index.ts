// Local development server with Express
// Supports both Streamable HTTP (ChatGPT) and SSE (MCP Inspector)

import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import express from "express";
import { createMcpServer } from "@/server";

const PORT = process.env.PORT || 3000;
const app = express();

// CORS headers for ChatGPT
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Accept, Mcp-Session-Id");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Only use JSON parsing for non-MCP routes
app.use((req, res, next) => {
  if (req.path === "/mcp") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Store servers and transports by session ID (for SSE)
const mcpServers = new Map<string, McpServer>();
const sseTransports = new Map<string, SSEServerTransport>();

// Streamable HTTP MCP endpoint (for ChatGPT)
// Using stateless mode for better compatibility
app.all("/mcp", async (req, res) => {
  // Create new transport for each request (stateless mode)
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // Stateless mode
  });

  const server = createMcpServer();
  await server.connect(transport);
  await transport.handleRequest(req, res);
});

// SSE endpoint for MCP Inspector (GET to establish SSE connection)
app.get("/sse", async (_req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  const sessionId = transport.sessionId;

  sseTransports.set(sessionId, transport);

  // Create a new MCP server for this SSE session
  const server = createMcpServer();
  mcpServers.set(sessionId, server);

  res.on("close", () => {
    sseTransports.delete(sessionId);
    mcpServers.delete(sessionId);
  });

  await server.connect(transport);
});

// SSE messages endpoint (POST to send messages)
app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId as string;
  const transport = sseTransports.get(sessionId);

  if (!transport) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  await transport.handlePostMessage(req, res, req.body);
});

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", server: "mcp-ainativekit-playground" });
});

app.listen(PORT, () => {
  console.log(`MCP AINativeKit Playground running on http://localhost:${PORT}`);
  console.log(`MCP endpoint (ChatGPT): http://localhost:${PORT}/mcp`);
  console.log(`SSE endpoint (Inspector): http://localhost:${PORT}/sse`);
});
