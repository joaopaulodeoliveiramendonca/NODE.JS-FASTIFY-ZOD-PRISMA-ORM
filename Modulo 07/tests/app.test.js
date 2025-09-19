/**
 * 📌 Teste de integração mínimo com Fastify
 * - Não sobe servidor real; usa 'inject' (light-my-request)
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Fastify from "fastify";
import dotenv from "dotenv";
dotenv.config();

// Importa plugins e rotas como no app principal
import envPlugin from "../src/plugins/env.js";
import prismaPlugin from "../src/plugins/prisma.js";
import securityPlugin from "../src/plugins/security.js";
import jwtPlugin from "../src/plugins/jwt.js";
import swaggerPlugin from "../src/plugins/swagger.js";
import redisPlugin from "../src/plugins/redis.js";

import authRoutes from "../src/routes/auth.js";

let app;

beforeAll(async () => {
  app = Fastify({ logger: false });
  await app.register(envPlugin);
  await app.register(securityPlugin);
  await app.register(prismaPlugin);
  await app.register(jwtPlugin);
  await app.register(swaggerPlugin);
  await app.register(redisPlugin);
  await app.register(authRoutes);
});

afterAll(async () => {
  await app.close();
});

describe("Auth", () => {
  it("deve registrar e logar", async () => {
    const email = `test_${Date.now()}@ex.com`;

    const reg = await app.inject({
      method: "POST",
      url: "/auth/register",
      payload: { name: "Teste", email, password: "Super1234" }
    });
    expect(reg.statusCode).toBe(201);

    const login = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email, password: "Super1234" }
    });
    expect(login.statusCode).toBe(200);
    const body = login.json();
    expect(body.token).toBeDefined();
  });
});
