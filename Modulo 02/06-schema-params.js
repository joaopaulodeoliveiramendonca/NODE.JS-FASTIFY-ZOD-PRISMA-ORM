/**
 * 📌 FASTIFY - VALIDANDO PARAMS
 * -----------------------------------
 * Exemplo: http://localhost:3000/produto/123
 */

const fastify = require("fastify")({ logger: true });

fastify.get("/produto/:id", {
  schema: {
    params: {
      type: "object",
      properties: {
        id: { type: "number" }
      }
    }
  }
}, async (req, reply) => {
  const { id } = req.params;
  return { produto: id, status: "🔧 Produto encontrado com sucesso!" };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("✅ Params validados em http://localhost:3000/produto/123");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
