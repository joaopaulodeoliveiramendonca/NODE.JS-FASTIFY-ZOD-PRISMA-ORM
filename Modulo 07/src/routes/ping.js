/**
 * 📌 Exemplo de rota com Zod-first + resposta tipada para Swagger
 */
import { z } from "zod";

export default async function pingRoutes(fastify) {
  const route = fastify.withTypeProvider?.() ?? fastify;

  route.get("/ping", {
    schema: {
      response: {
        200: z.object({
          ok: z.literal(true),
          now: z.string().datetime()
        })
      }
    }
  }, async () => {
    return { ok: true, now: new Date().toISOString() };
  });
}
