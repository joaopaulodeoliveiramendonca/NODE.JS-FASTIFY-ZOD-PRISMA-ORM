/**
 * 📌 Swagger/OpenAPI + UI
 * - Documentação automática acessível em /docs
 */
import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

export default fp(async function swaggerPlugin(fastify) {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "API - Fase 6",
        description: "Fastify + Zod + Prisma + JWT + Redis + WS",
        version: "1.0.0"
      },
      servers: [{ url: "http://localhost:3000" }]
    }
  });

  await fastify.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "list", deepLinking: false }
  });
});
