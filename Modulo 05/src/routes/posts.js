/**
 * 📌 Rotas de Posts — CRUD com paginação, ordenação e published
 */
import { createPostBody, listPostsQuery, postIdParam } from "../utils/validators.js";

export default async function postRoutes(fastify) {
  // Criar post (protegido)
  fastify.post("/posts", { preHandler: [fastify.auth] }, async (req, reply) => {
    const parsed = createPostBody.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "ValidationError", details: parsed.error.errors });

    const post = await fastify.prisma.post.create({
      data: {
        ...parsed.data,
        authorId: req.user.sub
      }
    });
    return reply.code(201).send(post);
  });

  // Listar posts (público): filtros + paginação + ordenação
  fastify.get("/posts", async (req, reply) => {
    const parsed = listPostsQuery.safeParse(req.query);
    if (!parsed.success) return reply.code(400).send({ error: "ValidationError", details: parsed.error.errors });

    const { page, perPage, published, sortBy = "createdAt", sortDir = "desc" } = parsed.data;
    const where = typeof published === "boolean" ? { published } : {};

    const [items, total] = await Promise.all([
      fastify.prisma.post.findMany({
        where,
        orderBy: { [sortBy]: sortDir },
        skip: (page - 1) * perPage,
        take: perPage,
        include: { author: { select: { id: true, name: true } } }
      }),
      fastify.prisma.post.count({ where })
    ]);

    return { page, perPage, total, items };
  });

  // Publicar post (protegido; só do autor)
  fastify.patch("/posts/:id/publish", { preHandler: [fastify.auth] }, async (req, reply) => {
    const parsed = postIdParam.safeParse(req.params);
    if (!parsed.success) return reply.code(400).send({ error: "ValidationError", details: parsed.error.errors });

    const post = await fastify.prisma.post.findUnique({ where: { id: parsed.data.id } });
    if (!post) return reply.code(404).send({ error: "NotFound" });
    if (post.authorId !== req.user.sub) return reply.code(403).send({ error: "Forbidden" });

    const updated = await fastify.prisma.post.update({
      where: { id: post.id },
      data: { published: true }
    });
    return updated;
  });

  // Deletar post (protegido; só do autor)
  fastify.delete("/posts/:id", { preHandler: [fastify.auth] }, async (req, reply) => {
    const parsed = postIdParam.safeParse(req.params);
    if (!parsed.success) return reply.code(400).send({ error: "ValidationError", details: parsed.error.errors });

    const post = await fastify.prisma.post.findUnique({ where: { id: parsed.data.id } });
    if (!post) return reply.code(404).send({ error: "NotFound" });
    if (post.authorId !== req.user.sub) return reply.code(403).send({ error: "Forbidden" });

    await fastify.prisma.post.delete({ where: { id: post.id } });
    return reply.code(204).send();
  });
}
