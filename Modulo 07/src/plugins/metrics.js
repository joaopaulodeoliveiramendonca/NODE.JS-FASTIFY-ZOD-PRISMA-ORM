/**
 * 📌 Métricas Prometheus com prom-client
 * - /metrics expõe métricas default + http_request_duration_ms
 */
import fp from "fastify-plugin";
import client from "prom-client";

export default fp(async function metricsPlugin(fastify) {
  client.collectDefaultMetrics();

  const httpHistogram = new client.Histogram({
    name: "http_request_duration_ms",
    help: "Duração das requisições em ms",
    labelNames: ["method", "route", "status_code"],
    buckets: [5, 15, 50, 100, 300, 800, 2000]
  });

  fastify.addHook("onResponse", async (req, reply) => {
    const route = reply.context?.config?.url || req.url;
    httpHistogram.labels({
      method: req.method,
      route,
      status_code: String(reply.statusCode)
    }).observe(reply.getResponseTime?.() || 0);
  });

  fastify.get("/metrics", async (req, reply) => {
    reply.header("Content-Type", client.register.contentType);
    return client.register.metrics();
  });
});
