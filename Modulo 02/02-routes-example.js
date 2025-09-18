/**
 * 📌 FASTIFY - ROTAS BÁSICAS
 * -----------------------------------
 * Aqui criamos algumas rotas simples
 * para entender GET, POST, PUT, DELETE.
 */

const fastify = require("fastify")({ logger: true });

// Rota GET
fastify.get("/hello", async (req, reply) => {
  return { mensagem: "👋 Olá do GET!" };
});

// Rota POST (enviar dados no corpo da requisição)
fastify.post("/dados", async (req, reply) => {
  const body = req.body;
  return { recebido: body };
});

// Rota PUT (atualizar dados)
fastify.put("/atualizar/:id", async (req, reply) => {
  const { id } = req.params;
  return { mensagem: `🔄 Atualizando item ${id}` };
});

// Rota DELETE (remover dados)
fastify.delete("/remover/:id", async (req, reply) => {
  const { id } = req.params;
  return { mensagem: `🗑️ Removendo item ${id}` };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("✅ Rotas ativas em http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
