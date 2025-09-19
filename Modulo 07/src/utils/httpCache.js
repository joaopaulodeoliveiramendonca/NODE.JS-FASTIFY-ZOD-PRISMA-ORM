import crypto from "node:crypto";

/** Gera ETag fraco a partir do payload JSON (stringificado) */
export function makeETag(obj) {
  const json = typeof obj === "string" ? obj : JSON.stringify(obj);
  const hash = crypto.createHash("sha1").update(json).digest("base64url");
  return `W/"${hash}"`;
}

/**
 * Aplica ETag/Cache-Control e responde 304 se If-None-Match bater.
 * usage:
 *   const payload = {...};
 *   return sendCached(reply, payload, 30); // TTL 30s
 */
export function sendCached(request, reply, payload, ttlSec = 30) {
  const etag = makeETag(payload);

  reply.header("ETag", etag);
  reply.header("Cache-Control", `public, max-age=${ttlSec}`);

  const inm = request.headers["if-none-match"];
  if (inm && inm === etag) {
    return reply.code(304).send();
  }
  return reply.send(payload);
}
