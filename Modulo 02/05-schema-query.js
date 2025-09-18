/**
 * 📌 FASTIFY - VALIDANDO QUERY STRINGS
 * -----------------------------------
 * Exemplo: http://localhost:3000/search?term=node&page=2
 */

const fastify = require("fastify")({ logger: true });

fastify.get("/search", {
  schema: {
    querystring: {
      type: "object",
      required: ["term"],
      properties: {
        term: { type: "string" },
        page: { type: "number", minimum: 1 }
      }
    }
  }
}, async (req, reply) => {
  const { term, page = 1 } = req.query;
  return { resultado: `🔎 Pesquisando por "${term}" na página ${page}` };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("✅ Query validada em http://localhost:3000/search?term=fastify&page=1");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
