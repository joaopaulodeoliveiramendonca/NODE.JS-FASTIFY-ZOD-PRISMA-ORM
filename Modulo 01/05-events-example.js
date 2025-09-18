/**
 * 📌 MÓDULO EVENTS
 * -----------------------------------
 * O Node.js é baseado em eventos.
 * O módulo `events` permite criar emissores/ouvintes de eventos.
 */

const EventEmitter = require("events");

// Criando um emissor
const meuEmissor = new EventEmitter();

// Definindo um ouvinte (listener)
meuEmissor.on("mensagem", (dados) => {
  console.log("📢 Evento recebido:", dados);
});

// Disparando (emitindo) um evento
meuEmissor.emit("mensagem", { usuario: "João", texto: "Aprendendo Node.js 🚀" });

// Outro evento
meuEmissor.on("login", (user) => {
  console.log(`✅ Usuário logado: ${user}`);
});

meuEmissor.emit("login", "admin123");
