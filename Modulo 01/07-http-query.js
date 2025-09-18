/**
 * 📌 USANDO QUERY PARAMETERS
 * -----------------------------------
 * Podemos capturar parâmetros da URL
 * (ex: http://localhost:3000/saudacao?nome=Joao).
 */

const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  // Analisar a URL
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === "/saudacao") {
    const nome = parsedUrl.query.nome || "Visitante";

    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`👋 Olá, ${nome}! Seja bem-vindo ao servidor Node.js 🚀`);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Rota não encontrada.");
  }
});

server.listen(3000, () => {
  console.log("Servidor com query rodando em: http://localhost:3000/saudacao?nome=Joao");
});
