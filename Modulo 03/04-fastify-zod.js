/**
 * 📌 FASTIFY + ZOD — VALIDAÇÃO EM ROTAS
 * --------------------------------------
 * Integração simples sem plugins adicionais:
 * - Usamos Zod dentro da rota (ou via helper) e
 *   retornamos 400 em caso de dados inválidos.
 *
 * Instalação:
 * 👉 npm i fastify zod
 *
 * Rotas de exemplo:
 * - POST /users        { nome, idade, email }
 * - GET  /search       ?term&page
 * - GET  /orders/:id
 */

const fastify = require("fastify")({ logger: true });
const { z } = require("zod");

// Helpers genéricos para validar e padronizar erro 400
function validateOr400(reply, schema, data) {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    reply.code(400).send({
      error: "ValidationError",
      details: parsed.error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
    return null; // indica falha
  }
  return parsed.data;
}

// Schemas Zod
const createUserBody = z.object({
  nome: z.string().min(3, "Nome mínimo 3 caracteres"),
  idade: z.number().int().min(18, "Idade mínima: 18"),
  email: z.string().email("Email inválido"),
});

const searchQuery = z.object({
  term: z.string().min(1, "term obrigatório"),
  page: z.coerce.number().int().min(1).default(1), // coerce converte string→número
});

const orderParams = z.object({
  id: z.string().min(1, "id obrigatório"),
});

// Rotas
fastify.post("/users", async (req, reply) => {
  const valid = validateOr400(reply, createUserBody, req.body);
  if (!valid) return; // já respondeu 400
  // Simula criação
  return { id: "u_1", ...valid, createdAt: new Date().toISOString() };
});

fastify.get("/search", async (req, reply) => {
  const valid = validateOr400(reply, searchQuery, req.query);
  if (!valid) return;
  return { query: valid.term, page: valid.page, items: [] };
});

fastify.get("/orders/:id", async (req, reply) => {
  const valid = validateOr400(reply, orderParams, req.params);
  if (!valid) return;
  // Simula busca
  return { id: valid.id, status: "PENDING", total: 123.45 };
});

// Start
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("✅ Fastify + Zod em http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
