/**
 * 📌 MÓDULO PATH
 * -----------------------------------
 * O módulo `path` ajuda a manipular caminhos de arquivos
 * de forma compatível com qualquer sistema operacional.
 */

const path = require("path");

// Nome completo do arquivo atual
console.log("📌 Caminho do arquivo atual:", __filename);

// Diretório atual
console.log("📂 Diretório atual:", __dirname);

// Usando funções do path
const arquivo = "server-basic.js";
console.log("🔎 Extensão:", path.extname(arquivo));
console.log("📛 Nome base:", path.basename(arquivo));
console.log("🛣️ Caminho absoluto:", path.resolve(arquivo));

// Juntar caminhos
const caminhoCompleto = path.join(__dirname, "pasta", "subpasta", "arquivo.txt");
console.log("🔗 Caminho juntado:", caminhoCompleto);
