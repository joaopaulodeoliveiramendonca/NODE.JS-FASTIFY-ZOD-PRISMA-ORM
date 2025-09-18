/**
 * 📌 SERVIDOR HTTP COM JSON
 * -----------------------------------
 * Neste exemplo vamos devolver dados JSON.
 * Muito útil para criar APIs.
 * 
 * Para testar:
 * 👉 node http-json.js
 * 👉 acessar: http://localhost:3000/api
 */

const http = require("http");

const server = http.createServer((req, res) => {
  // Rota principal
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>🌍 Bem-vindo ao servidor Node.js!</h1>");
  }

  // Rota JSON
  else if (req.url === "/api") {
    const dados = {
      nome: "Nathan",
      curso: "Node.js v23",
      mensagem: "🚀 JSON vindo do servidor Node.js"
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(dados));
  }

  // Rota não encontrada
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("❌ Página não encontrada!");
  }
});

server.listen(3000, () => {
  console.log("Servidor rodando em: http://localhost:3000");
});
