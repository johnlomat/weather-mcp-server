// Local development server with Express
// Supports both Streamable HTTP (ChatGPT) and SSE (MCP Inspector)

import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import express from "express";
import { randomUUID } from "node:crypto";
import { createMcpServer } from "./server";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

// Store servers and transports by session ID
const mcpServers = new Map<string, McpServer>();
const streamableTransports = new Map<string, StreamableHTTPServerTransport>();
const sseTransports = new Map<string, SSEServerTransport>();

// Streamable HTTP MCP endpoint (for ChatGPT)
app.all("/mcp", async (req, res) => {
  const sessionId = "streamable-default";
  let transport = streamableTransports.get(sessionId);

  if (!transport) {
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
    });
    streamableTransports.set(sessionId, transport);

    const server = createMcpServer();
    mcpServers.set(sessionId, server);
    await server.connect(transport);
  }

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
