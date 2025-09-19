/**
 * 📌 Segurança: Helmet, CORS e Rate-Limit
 */
import fp from "fastify-plugin";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";

export default fp(async function securityPlugin(fastify) {
  await fastify.register(helmet);
  await fastify.register(cors, {
    origin: fastify.config.corsOrigin,
    credentials: true
  });
  await fastify.register(rateLimit, {
    max: 200,            // máx. requisições por janela
    timeWindow: "1 minute"
  });
});
