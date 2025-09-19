/**
 * 📌 SEED — POPULA O BANCO COM DADOS DE EXEMPLO
 * ------------------------------------------------
 * Executa inserts iniciais para facilitar os testes.
 * Para rodar:
 * 👉 node seed/seed.js
 */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Cria 2 usuários
  const nathan = await prisma.user.upsert({
    where: { email: "nathan@example.com" },
    update: {},
    create: {
      name: "Nathan",
      email: "nathan@example.com",
    },
  });

  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      name: "Alice",
      email: "alice@example.com",
    },
  });

  // Cria posts do Nathan
  const post1 = await prisma.post.create({
    data: {
      title: "Primeiro post",
      content: "Conteúdo do primeiro post.",
      published: true,
      authorId: nathan.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Rascunho secreto",
      content: "Ainda não publicado.",
      authorId: nathan.id,
    },
  });

  // Comentários
  await prisma.comment.create({
    data: {
      text: "Top demais!",
      postId: post1.id,
      authorId: alice.id,
    },
  });

  console.log("✅ Seed concluído!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
