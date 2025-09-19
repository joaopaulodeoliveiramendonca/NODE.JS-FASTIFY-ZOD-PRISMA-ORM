/**
 * 📌 Logger Pino com requestId
 * - Adiciona correlação por requisição.
 * - Log estruturado ajuda em produção + observabilidade.
 */
import fp from "fastify-plugin";

export default fp(async function loggerPlugin(fastify) {
  fastify.addHook("onRequest", async (req, reply) => {
    // Gera um requestId simples; em prod pode usar @fastify/request-id
    const rid = (Math.random() + 1).toString(36).substring(2, 10);
    req.requestId = rid;
    reply.header("x-request-id", rid);
  });

  fastify.addHook("preHandler", async (req) => {
    req.log.info({ rid: req.requestId, url: req.url, method: req.method }, "incoming");
  });

  fastify.addHook("onResponse", async (req, reply) => {
    req.log.info(
      { rid: req.requestId, statusCode: reply.statusCode, durationMs: reply.getResponseTime?.() },
      "completed"
    );
  });
});
