/**
 * 📌 Worker independente (node worker.js)
 * - Consome jobs da fila "email" e loga o processamento
 */
import dotenv from "dotenv";
dotenv.config();

import Redis from "ioredis";
import { RedisQueue } from "./src/queue/queue.js";

const redis = new Redis(process.env.REDIS_URL);
const emailQueue = new RedisQueue(redis, "email");

console.log("👷 Worker iniciado. Aguardando jobs da fila 'email'...");

(async function loop() {
  while (true) {
    const job = await emailQueue.popJobBlocking(30); // espera até 30s
    if (!job) continue;
    try {
      // Simula envio
      const { to, subject } = job.payload;
      console.log("📧 Enviando e-mail →", to, "Assunto:", subject);
      await new Promise(r => setTimeout(r, 500)); // fake IO
      console.log("✅ E-mail enviado!");
    } catch (err) {
      console.error("❌ Falha no job:", err);
    }
  }
})();
