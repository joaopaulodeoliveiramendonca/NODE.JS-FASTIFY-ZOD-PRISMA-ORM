/**
 * 📌 FORMATAÇÃO DE ERROS DO ZOD
 * ------------------------------
 * Como transformar os erros em um formato simples para API.
 */

const { z } = require("zod");

const schema = z.object({
  nome: z.string().min(3),
  idade: z.number().int().min(0),
  email: z.string().email(),
});

function formatZodErrors(zodError) {
  // Retorna: [{ path: "campo.subcampo", message: "mensagem" }, ...]
  return zodError.errors.map((e) => ({
    path: e.path.join("."),
    message: e.message,
  }));
}

// Exemplo
const result = schema.safeParse({ nome: "Na", idade: -1, email: "x" });
if (!result.success) {
  console.log("❌ Erros formatados:", formatZodErrors(result.error));
} else {
  console.log("✅ OK:", result.data);
}
