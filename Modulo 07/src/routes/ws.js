/**
 * 📌 WebSocket básico
 * - Conecta em ws://localhost:3000/ws
 * - Mensagens de broadcast quando post é publicado
 */
export default async function wsRoutes(fastify) {
  // Repositório simples de conexões ativas
  const peers = new Set();

  // Utilitário global para outros módulos
  fastify.decorate("websocketBroadcast", (msgObj) => {
    const raw = JSON.stringify(msgObj);
    for (const sock of peers) {
      try { sock.send(raw); } catch {}
    }
  });

  fastify.get("/ws", { websocket: true }, (connection /* Socket */, req) => {
    peers.add(connection.socket);

    // Mensagem de boas-vindas
    connection.socket.send(JSON.stringify({ type: "welcome", data: { ok: true } }));

    connection.socket.on("message", (raw) => {
      // Echo opcional: o cliente pode enviar 'ping'
      // connection.socket.send(raw);
    });

    connection.socket.on("close", () => {
      peers.delete(connection.socket);
    });
  });
}
