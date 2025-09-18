/**
 * 📌 FASTIFY - SERVIDOR BÁSICO
 * -----------------------------------
 * Fastify é um framework para construir APIs rápidas e
 * eficientes em Node.js. Parecido com Express, porem mais
 * performático e com suporte nativo a TypeScript.
 *
 * Instalação:
 * 👉 npm init -y
 * 👉 npm install fastify
 *
 * Para rodar:
 * 👉 node server-basic.js
 * 
 *    { logger: true }
 *    - Esse é um objeto de configuração passado como argumento
 *      para a função `fastify()`.
 *    - A opção `logger: true` habilita o sistema de logs interno
 *      do Fastify.
 *    - Com isso, toda vez que o servidor receber uma requisição
 *      ou acontecer algum evento importante (como erro, inicialização,
 *      start/stop), o Fastify vai registrar automaticamente no console.
 * 
 */

const fastify = require("fastify")({ logger: true });

// Rota principal
fastify.get("/", async (request, reply) => {
  return { mensagem: "🚀 Olá, Fastify está rodando!" };
});

// Rota Contato
fastify.get("/contato", async (request, reply) => {
  return { mensagem: "Email: contato@meusite.com" };
});

// Inicia o servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("✅ Servidor Fastify rodando em http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
