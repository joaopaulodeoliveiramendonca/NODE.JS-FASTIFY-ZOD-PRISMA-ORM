/**
 * 📌 SIMULANDO ROTAS MANUAIS
 * -----------------------------------
 * Aqui criamos um roteamento simples
 * (sem frameworks como Express ou Fastify).
 */

const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

  switch (req.url) {
    case "/":
      res.end("<h1>🏠 Página Inicial</h1>");
      break;
    case "/sobre":
      res.end("<h1>ℹ️ Sobre nós</h1><p>Aprendendo Node.js sem framework</p>");
      break;
    case "/contato":
      res.end("<h1>📞 Contato</h1><p>Email: contato@meusite.com</p>");
      break;
    default:
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("❌ Página não encontrada.");
  }
});

server.listen(3000, () => {
  console.log("Servidor rodando em: http://localhost:3000");
});
