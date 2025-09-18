/**
 * 📌 MÓDULO FS (File System)
 * -----------------------------------
 * O módulo `fs` permite criar, ler e escrever arquivos.
 * Muito útil para salvar logs, gerar relatórios, etc.
 */

const fs = require("fs");

// Criar/Escrever em um arquivo (sobrescreve se já existir)
fs.writeFileSync("mensagem.txt", "Olá, este arquivo foi criado com Node.js! 🚀");

// Ler o conteúdo do arquivo
const conteudo = fs.readFileSync("mensagem.txt", "utf-8");
console.log("📄 Conteúdo do arquivo:", conteudo);

// Adicionar texto ao final do arquivo
fs.appendFileSync("mensagem.txt", "\nNova linha adicionada com append.");
console.log("✅ Texto adicionado!");

// Ler novamente para conferir
const atualizado = fs.readFileSync("mensagem.txt", "utf-8");
console.log("📄 Conteúdo atualizado:", atualizado);
