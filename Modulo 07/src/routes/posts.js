// imports adicionais:
import { sendCached } from "../utils/httpCache.js";

// ... dentro do handler GET /posts, após montar o payload:
const payload = { page, perPage, total, items };
await cacheSet(fastify.redis, key, payload, 30);

// Substitui `return payload;` por:
return sendCached(req, reply, payload, 30);





/**
 * 📌 Posts com cache (lista) + publish dispara WS
 * - GET /posts (cache por query)
 * - PATCH /posts/:id/publish (notifica via WS)
 */
import { createPostBody, listPostsQuery, postIdParam } from "../utils/validators.js";
import { cacheKey, cacheGet, cacheSet } from "../utils/cache.js";

export default async function postRoutes(fastify) {
  // Criar post (protegido)
  fastify.post("/posts", { preHandler: [fastify.auth] }, async (req, reply) => {
    const parsed = createPostBody.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: "ValidationError", details: parsed.error.errors });

    const post = await fastify.prisma.post.create({
      data: { ...parsed.data, authorId: req.user.sub }
    });

    // Invalida caches comuns (simplista)
    await fastify.redis.del("posts:published:true"); // exemplo básico
    return reply.code(201).send(post);
  });

  // Listar posts com cache
  fastify.get("/posts", async (req, reply) => {
    const parsed = listPostsQuery.safeParse(req.query);
    if (!parsed.success) return reply.code(400).send({ error: "ValidationError", details: parsed.error.errors });

    const { page, perPage, published, sortBy = "createdAt", sortDir = "desc" } = parsed.data;
    const where = typeof published === "boolean" ? { published } : {};

    const key = cacheKey("posts", { page, perPage, published, sortBy, sortDir });
    const cached = await cacheGet(fastify.redis, key);
    if (cached) return cached;

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

    const payload = { page, perPage, total, items };
    await cacheSet(fastify.redis, key, payload, 30); // TTL 30s
    return payload;
  });

  // Publicar post — notifica via WS
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

    // Invalida alguns caches (simplista)
    await fastify.redis.flushdb();

    // Notifica assinantes WS
    fastify.websocketBroadcast({
      type: "post_published",
      data: { id: updated.id, title: updated.title }
    });

    return updated;
  });
}
