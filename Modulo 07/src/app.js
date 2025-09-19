import Fastify from "fastify";
import dotenv from "dotenv";
dotenv.config();

import envPlugin from "./plugins/env.js";
import prismaPlugin from "./plugins/prisma.js";
import securityPlugin from "./plugins/security.js";
import jwtPlugin from "./plugins/jwt.js";
import loggerPlugin from "./plugins/logger.js";
import swaggerPlugin from "./plugins/swagger.js";
import redisPlugin from "./plugins/redis.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import wsRoutes from "./routes/ws.js";

import websocket from "@fastify/websocket";

import swaggerZodPlugin from "./plugins/swagger-zod.js";
import metricsPlugin from "./plugins/metrics.js";

import pingRoutes from "./routes/ping.js";
import jobsRoutes from "./routes/jobs.js";
import sseRoutes from "./routes/sse.js";

const app = Fastify({
  logger: {
    transport: process.env.NODE_ENV === "development" ? { target: "pino-pretty" } : undefined,
    level: "info"
  }
});

// Plugins base
await app.register(envPlugin);
await app.register(loggerPlugin);
await app.register(securityPlugin);
await app.register(prismaPlugin);
await app.register(jwtPlugin);
await app.register(redisPlugin);

// Swagger
await app.register(swaggerPlugin);

// WebSocket
await app.register(websocket);

// Rotas
await app.register(authRoutes);
await app.register(userRoutes);
await app.register(postRoutes);
await app.register(wsRoutes);




// ... topo igual


// ... plugins base
await app.register(envPlugin);
await app.register(loggerPlugin);
await app.register(securityPlugin);
await app.register(prismaPlugin);
await app.register(jwtPlugin);
await app.register(redisPlugin);

// Swagger Zod-first
await app.register(swaggerZodPlugin);

// Métricas
await app.register(metricsPlugin);

// WebSocket (mantém)
await app.register(websocket);

// Rotas existentes
await app.register(authRoutes);
await app.register(userRoutes);
await app.register(postRoutes);
await app.register(wsRoutes);

// Novas rotas
await app.register(pingRoutes);
await app.register(jobsRoutes);
await app.register(sseRoutes);

// Health
app.get("/health", async () => ({ ok: true, uptime: process.uptime() }));

app.listen({ port: app.config.port, host: "0.0.0.0" })
  .then(() => app.log.info(`✅ API v6 em http://localhost:${app.config.port} | Docs: /docs`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
