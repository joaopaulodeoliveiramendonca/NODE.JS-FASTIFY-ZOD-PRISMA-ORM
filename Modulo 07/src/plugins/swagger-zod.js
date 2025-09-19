/**
 * 📌 Swagger a partir do Zod
 * - Usa fastify-type-provider-zod para transformar Zod → JSON Schema
 * - Usa zod-to-openapi para enriquecer o OpenAPI (opcional)
 *
 * Como usar:
 *  - Em app.js, defina o type provider do Fastify p/ Zod.
 *  - Em cada rota, exporte schemas Zod e passe em schema: { body, querystring, params, response } com .openapi() opcional.
 */
import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { jsonSchemaTransform, ZodTypeProvider } from "fastify-type-provider-zod";

// Dica: você pode opcionalmente registrar com zod-to-openapi se quiser tags e refs
export default fp(async function swaggerZodPlugin(fastify) {
  // Ativa provider de tipos em nível de instância (routes podem usar .withTypeProvider<ZodTypeProvider>())
  fastify.setValidatorCompiler(({ schema }) => schema);
  fastify.setSerializerCompiler(({ schema }) => schema);

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "API - Zod First",
        description: "Esquemas derivados do Zod",
        version: "1.0.0"
      },
      servers: [{ url: "http://localhost:3000" }]
    },
    transform: jsonSchemaTransform
  });

  await fastify.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "list" }
  });

  // Marca a instância para usar Zod nas rotas
  fastify.withTypeProvider = () => fastify.withTypeProvider?.(ZodTypeProvider) ?? fastify;
});
