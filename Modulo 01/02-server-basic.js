/**
 * 📌 SERVIDOR HTTP BÁSICO EM NODE
 * -----------------------------------
 * Node.js vem com módulos nativos (já embutidos).
 * O módulo `http` permite criar um servidor web.
 * 
 * Aqui estamos criando um servidor que responde
 * "Olá Node.js" para qualquer requisição.
 * 
 * Para rodar:
 * 👉 node server-basic.js
 * Abra no navegador: http://localhost:3000
 */

const http = require("http"); // importa o módulo nativo http

// Criando o servidor
const server = http.createServer((req, res) => {
  // Configura o cabeçalho da resposta (status e tipo de conteúdo)
  res.writeHead(200, { "Content-Type": "text/plain" });

  // Corpo da resposta
  res.end("Olá Node.js 🚀 - Servidor básico funcionando!");
});

// Define a porta de escuta
server.listen(3000, () => {
  console.log("Servidor rodando em: http://localhost:3000");
});
