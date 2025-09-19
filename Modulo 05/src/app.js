/**
 * 📌 APP BOOTSTRAP — Registra plugins e rotas.
 * Rode com: npm run dev
 */
import Fastify from "fastify";
import envPlugin from "./plugins/env.js";
import prismaPlugin from "./plugins/prisma.js";
import securityPlugin from "./plugins/security.js";
import jwtPlugin from "./plugins/jwt.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";

const app = Fastify({ logger: true });

// Plugins
await app.register(envPlugin);
await app.register(prismaPlugin);
await app.register(securityPlugin);
await app.register(jwtPlugin);

// Rotas
await app.register(authRoutes);
await app.register(userRoutes);
await app.register(postRoutes);

// Healthcheck
app.get("/health", async () => ({ ok: true, uptime: process.uptime() }));

// Start
app.listen({ port: app.config.port }).then(() => {
  app.log.info(`✅ API rodando em http://localhost:${app.config.port}`);
}).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
