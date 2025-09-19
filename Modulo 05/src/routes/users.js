/**
 * 📌 Rotas de Usuários (exemplos protegidos)
 */
import { userIdParam } from "../utils/validators.js";

export default async function userRoutes(fastify) {
  // Listar usuários (protegido)
  fastify.get("/users", { preHandler: [fastify.auth] }, async () => {
    return fastify.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, createdAt: true }
    });
  });

  // Buscar por id (protegido)
  fastify.get("/users/:id", { preHandler: [fastify.auth] }, async (req, reply) => {
    const parsed = userIdParam.safeParse(req.params);
    if (!parsed.success) return reply.code(400).send({ error: "ValidationError", details: parsed.error.errors });

    const user = await fastify.prisma.user.findUnique({
      where: { id: parsed.data.id },
      select: { id: true, name: true, email: true, createdAt: true }
    });
    if (!user) return reply.code(404).send({ error: "NotFound" });
    return user;
  });
}
