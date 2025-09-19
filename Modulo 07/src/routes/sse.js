/**
 * 📌 SSE — alternativa ao WebSocket para stream unidirecional
 * - Conecte em: http://localhost:3000/sse
 * - No publish de posts, dispare fastify.sseBroadcast(...)
 */
export default async function sseRoutes(fastify) {
  const clients = new Set();

  fastify.decorate("sseBroadcast", (type, data) => {
    const raw = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const res of clients) {
      try { res.write(raw); } catch {}
    }
  });

  fastify.get("/sse", async (req, reply) => {
    reply.raw.setHeader("Content-Type", "text/event-stream");
    reply.raw.setHeader("Cache-Control", "no-cache");
    reply.raw.setHeader("Connection", "keep-alive");
    reply.raw.flushHeaders?.();

    clients.add(reply.raw);
    // ping inicial
    reply.raw.write(`event: hello\ndata: ${JSON.stringify({ ok: true })}\n\n`);

    req.raw.on("close", () => {
      clients.delete(reply.raw);
    });
  });
}
