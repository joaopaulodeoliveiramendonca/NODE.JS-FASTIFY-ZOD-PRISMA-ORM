/**
 * 📌 Fila simples com Redis Lists
 * - pushJob: LPUSH (entrada)
 * - worker: BRPOP (consumo bloqueante)
 * - Canal pub/sub opcional p/ notificar novos jobs
 */
export class RedisQueue {
  constructor(redis, name = "jobs") {
    this.redis = redis;
    this.name = name;
  }

  async pushJob(payload) {
    await this.redis.lpush(this.name, JSON.stringify({ payload, ts: Date.now() }));
  }

  async popJobBlocking(timeoutSec = 10) {
    // BRPOP retorna [list, value] ou null em timeout
    const res = await this.redis.brpop(this.name, timeoutSec);
    if (!res) return null;
    const [, raw] = res;
    return JSON.parse(raw);
  }
}
