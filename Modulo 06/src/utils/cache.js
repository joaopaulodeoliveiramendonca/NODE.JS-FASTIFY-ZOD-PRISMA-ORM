/**
 * 📌 Cache helper
 * - get/set com TTL em segundos
 * - key pode incluir parâmetros para evitar colisão
 */
export function cacheKey(prefix, params = {}) {
  const p = Object.entries(params).sort().map(([k, v]) => `${k}:${v}`).join("|");
  return `${prefix}:${p}`;
}

export async function cacheGet(redis, key) {
  const raw = await redis.get(key);
  return raw ? JSON.parse(raw) : null;
}

export async function cacheSet(redis, key, value, ttlSec = 60) {
  await redis.set(key, JSON.stringify(value), "EX", ttlSec);
}
