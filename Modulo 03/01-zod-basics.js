/**
 * 📌 ZOD BÁSICO — VALIDAÇÃO E TIPAGEM EM RUNTIME
 * ------------------------------------------------
 * 
 * Biblioteca para validação e tipagem de dados. 
 * Garante que o que chega em uma API ou função 
 * esteja no formato esperado.
 * 
 * O Zod valida dados em tempo de execução (runtime) e,
 * quando usado com TypeScript, também gera tipos em compile-time.
 * Aqui vamos focar na validação em JS puro (sem TS).
 *
 * Para instalar:
 * 👉 npm i zod
 */

const { z } = require("zod");

// 1) Esquemas primitivos
const nomeSchema = z.string().min(3, "Nome deve ter ao menos 3 caracteres");
const idadeSchema = z.number().int().min(0, "Idade não pode ser negativa");

// 2) Esquema de objeto (ex.: usuário)
const usuarioSchema = z.object({
  nome: nomeSchema,
  idade: idadeSchema,
  email: z.string().email("Email inválido"),
  ativo: z.boolean().default(true), // default aplicado em parse()
});

// 3) parse() lança exceção se inválido; safeParse() não lança
const entradaValida = { nome: "Nathan", idade: 25, email: "nathan@ex.com" };
const entradaInvalida = { nome: "Na", idade: -3, email: "errado" };

// ✅ Com parse() — lança erro se inválido
try {
  const user = usuarioSchema.parse(entradaValida);
  console.log("✅ Usuário válido:", user);
} catch (e) {
  console.error("❌ Erro (parse válido não deveria cair aqui):", e.errors);
}

// ❗ Com safeParse() — não lança, retorna { success, data|error }
const result = usuarioSchema.safeParse(entradaInvalida);
if (!result.success) {
  console.log("🔎 Erros de validação:", result.error.errors);
} else {
  console.log("✅ Usuário:", result.data);
}

// 4) Transformações (ex.: normalizar string)
const produtoSchema = z.object({
  titulo: z.string().transform((s) => s.trim()),
  preco: z.number().positive("Preço deve ser > 0"),
});

const prod = produtoSchema.safeParse({ titulo: "  Camiseta  ", preco: 79.9 });
console.log("🧼 Transform:", prod.success ? prod.data : prod.error.errors);

// 5) Refinements (regras personalizadas)
const senhaSchema = z
  .string()
  .min(8, "Senha curta")
  .refine((s) => /[A-Z]/.test(s), "Deve conter letra maiúscula")
  .refine((s) => /\d/.test(s), "Deve conter número");

console.log("🔐 Senha ok?", senhaSchema.safeParse("Super123").success);
console.log("🔐 Senha ruim?", senhaSchema.safeParse("fraca").success);
