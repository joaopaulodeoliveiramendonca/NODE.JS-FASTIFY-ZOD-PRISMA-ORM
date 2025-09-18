/**
 * 📌 FASTIFY - QUERY E PARAMS
 * -----------------------------------
 * Capturando parâmetros da URL e query strings.
 *
 * Exemplos:
 * 👉 http://localhost:3000/usuario/123
 * 👉 http://localhost:3000/search?term=fastify
 */

const fastify = require("fastify")({ logger: true });

// Rota com parâmetro na URL
fastify.get("/usuario/:id", async (req, reply) => {
  const { id } = req.params;
  return { usuario: id, status: "ativo" };
});

// Rota com query string (?term=)
fastify.get("/search", async (req, reply) => {
  const { term } = req.query;
  return { resultado: `🔎 Você pesquisou por: ${term}` };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("✅ Servidor rodando em http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
