/**
 * 📌 API COMPLETA — FASTIFY + ZOD + PRISMA
 * -----------------------------------------
 * - CRUD de User e Post (exemplo)
 * - Validação com Zod (body, query, params)
 * - Prisma para persistência
 *
 * Para rodar:
 * 👉 node api-fastify-prisma.js
 * Rotas exemplares:
 *  - POST   /users
 *  - GET    /users
 *  - GET    /users/:id
 *  - POST   /posts
 *  - GET    /posts?published=true&page=1&perPage=10
 *  - PATCH  /posts/:id/publish
 *  - DELETE /posts/:id
 */

const fastify = require("fastify")({ logger: true });
const { z } = require("zod");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/** Helpers: validar e responder 400 */
function zValidateOr400(reply, schema, data) {
  const r = schema.safeParse(data);
  if (!r.success) {
    reply.code(400).send({
      error: "ValidationError",
      details: r.error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
    return null;
  }
  return r.data;
}

/** Schemas Zod */
const createUserBody = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

const idParam = z.object({
  id: z.string().min(1),
});

const createPostBody = z.object({
  title: z.string().min(3),
  content: z.string().optional(),
  authorId: z.string().min(1),
});

const listPostsQuery = z.object({
  published: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(10),
});

/** Rotas USER */
fastify.post("/users", async (req, reply) => {
  const valid = zValidateOr400(reply, createUserBody, req.body);
  if (!valid) return;

  const exists = await prisma.user.findUnique({ where: { email: valid.email } });
  if (exists) {
    return reply.code(409).send({ error: "Conflict", message: "Email já cadastrado." });
  }

  const user = await prisma.user.create({ data: valid });
  return reply.code(201).send(user);
});

fastify.get("/users", async () => {
  return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
});

fastify.get("/users/:id", async (req, reply) => {
  const valid = zValidateOr400(reply, idParam, req.params);
  if (!valid) return;

  const user = await prisma.user.findUnique({
    where: { id: valid.id },
    include: { posts: true, comments: true },
  });
  if (!user) return reply.code(404).send({ error: "NotFound" });
  return user;
});

/** Rotas POST */
fastify.post("/posts", async (req, reply) => {
  const valid = zValidateOr400(reply, createPostBody, req.body);
  if (!valid) return;

  // Garante autor existente
  const author = await prisma.user.findUnique({ where: { id: valid.authorId } });
  if (!author) return reply.code(400).send({ error: "InvalidAuthor" });

  const post = await prisma.post.create({
    data: {
      title: valid.title,
      content: valid.content,
      authorId: valid.authorId,
    },
  });
  return reply.code(201).send(post);
});

fastify.get("/posts", async (req, reply) => {
  const valid = zValidateOr400(reply, listPostsQuery, req.query);
  if (!valid) return;

  const { page, perPage, published } = valid;
  const where = typeof published === "boolean" ? { published } : {};

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { author: true, comments: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    page,
    perPage,
    total,
    items,
  };
});

fastify.patch("/posts/:id/publish", async (req, reply) => {
  const valid = zValidateOr400(reply, idParam, req.params);
  if (!valid) return;

  const post = await prisma.post.update({
    where: { id: valid.id },
    data: { published: true },
  });
  return post;
});

fastify.delete("/posts/:id", async (req, reply) => {
  const valid = zValidateOr400(reply, idParam, req.params);
  if (!valid) return;

  await prisma.post.delete({ where: { id: valid.id } });
  return reply.code(204).send();
});

/** Start */
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("✅ API on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
