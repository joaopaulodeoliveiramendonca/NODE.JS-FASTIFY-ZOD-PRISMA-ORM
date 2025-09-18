/**
 * 📌 FASTIFY - VALIDAÇÃO DE SCHEMA
 * -----------------------------------
 * Usando JSON Schema para validar entradas.
 * Isso ajuda a evitar que dados inválidos cheguem na sua lógica.
 *
 * Teste:
 * POST http://localhost:3000/register
 * Body: { "username": "Nathan", "idade": 25 }
 */

const fastify = require("fastify")({ logger: true });

fastify.post("/register", {
  schema: {
    body: {
      type: "object",
      required: ["username", "idade"],
      properties: {
        username: { type: "string", minLength: 3 },
        idade: { type: "number", minimum: 18 }
      }
    }
  }
}, async (req, reply) => {
  const { username, idade } = req.body;
  return { mensagem: `✅ Usuário ${username} cadastrado com ${idade} anos.` };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("✅ Validação ativa em http://localhost:3000/register");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
