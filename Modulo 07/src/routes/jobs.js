import { z } from "zod";
import { RedisQueue } from "../queue/queue.js";

export default async function jobsRoutes(fastify) {
  const emailQueue = new RedisQueue(fastify.redis, "email");

  fastify.post("/jobs/email", {
    schema: {
      body: z.object({
        to: z.string().email(),
        subject: z.string().min(3),
        body: z.string().min(1)
      }),
      response: {
        202: z.object({ enqueued: z.boolean() })
      }
    }
  }, async (req, reply) => {
    await emailQueue.pushJob(req.body);
    return reply.code(202).send({ enqueued: true });
  });
}
