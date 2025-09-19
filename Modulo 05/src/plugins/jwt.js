/**
 * 📌 JWT: gera/verifica tokens; preHandler de proteção.
 */
import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

export default fp(async function jwtPlugin(fastify) {
  await fastify.register(fastifyJwt, {
    secret: fastify.config.jwtSecret
  });

  fastify.decorate("auth", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  });
});
