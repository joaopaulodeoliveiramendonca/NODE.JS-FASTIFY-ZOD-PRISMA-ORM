/**
 * 📌 Redis (ioredis) — cache e pub/sub
 */
import fp from "fastify-plugin";
import Redis from "ioredis";

export default fp(async function redisPlugin(fastify) {
  const url = process.env.REDIS_URL;
  const client = new Redis(url);

  client.on("connect", () => fastify.log.info("Redis conectado"));
  client.on("error", (err) => fastify.log.error({ err }, "Redis erro"));

  fastify.decorate("redis", client);

  fastify.addHook("onClose", async (app) => {
    await app.redis.quit();
  });
});
