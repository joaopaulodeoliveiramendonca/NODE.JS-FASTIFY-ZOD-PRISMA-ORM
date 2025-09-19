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

// Health
app.get("/health", async () => ({ ok: true, uptime: process.uptime() }));

app.listen({ port: app.config.port, host: "0.0.0.0" })
  .then(() => app.log.info(`✅ API v6 em http://localhost:${app.config.port} | Docs: /docs`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
