/**
 * 📌 Plugin de ENV: carrega variáveis e valida mínimas.
 */
import fp from "fastify-plugin";
import dotenv from "dotenv";

export default fp(async function envPlugin(fastify) {
  dotenv.config();

  const required = ["PORT", "JWT_SECRET", "DATABASE_URL"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    fastify.log.error({ missing }, "Variáveis de ambiente ausentes");
    throw new Error("Env incompleto: " + missing.join(", "));
  }

  fastify.decorate("config", {
    port: Number(process.env.PORT || 3000),
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    corsOrigin: process.env.CORS_ORIGIN || "*",
  });
});
