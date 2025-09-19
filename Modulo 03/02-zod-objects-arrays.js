/**
 * 📌 ZOD — OBJETOS COMPLEXOS, ARRAYS, ENUMS, UNIONS
 * --------------------------------------------------
 * Exemplos de validações mais ricas e composições.
 */

const { z } = require("zod");

// Enum de status
const Status = z.enum(["PENDING", "PAID", "CANCELED"]);

// Endereço aninhado
const enderecoSchema = z.object({
  rua: z.string().min(3),
  numero: z.number().int().positive(),
  cidade: z.string(),
  uf: z.string().length(2, "UF deve ter 2 letras").toUpperCase(),
});

// Cliente com múltiplos endereços
const clienteSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)), // exemplo flexível para estudo
  nome: z.string().min(3),
  emails: z.array(z.string().email()).min(1, "Pelo menos um e-mail"),
  enderecoEntrega: enderecoSchema,
  enderecosAdicionais: z.array(enderecoSchema).optional(),
});

// Pedido com itens e union
const itemSchema = z.object({
  sku: z.string(),
  qtd: z.number().int().min(1),
  precoUnit: z.number().nonnegative(),
});

const cupomSchema = z.union([
  z.object({ tipo: z.literal("percentual"), valor: z.number().min(1).max(100) }),
  z.object({ tipo: z.literal("fixo"), valor: z.number().positive() }),
]);

const pedidoSchema = z.object({
  clienteId: z.string(),
  itens: z.array(itemSchema).min(1),
  status: Status.default("PENDING"),
  cupom: cupomSchema.optional(),
  total: z.number().nonnegative(),
});

// Teste
const pedido = {
  clienteId: "123",
  itens: [{ sku: "ABC-001", qtd: 2, precoUnit: 49.9 }],
  cupom: { tipo: "percentual", valor: 10 },
  total: 89.82,
};

const r = pedidoSchema.safeParse(pedido);
console.log("🧾 Pedido válido?", r.success, r.success ? r.data : r.error.errors);
