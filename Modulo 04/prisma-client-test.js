/**
 * 📌 TESTE RÁPIDO DO PRISMA CLIENT
 * ---------------------------------
 * Para rodar:
 * 👉 node prisma-client-test.js
 * (Dica: rode antes `node seed/seed.js` para ter dados)
 */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
  // 1) Listar usuários
  const users = await prisma.user.findMany();
  console.log("👥 Usuários:", users);

  // 2) Criar usuário
  const novo = await prisma.user.create({
    data: { name: "João", email: `joao_${Date.now()}@ex.com` },
  });
  console.log("✨ Criado:", novo);

  // 3) Buscar com relações (posts, comments)
  const userWithRelations = await prisma.user.findUnique({
    where: { id: users[0]?.id },
    include: { posts: true, comments: true },
  });
  console.log("🔗 Usuário com relações:", userWithRelations);

  // 4) Paginação e filtro em posts
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 5,
    skip: 0,
    include: { author: true, comments: true },
  });
  console.log("📰 Posts publicados (últimos 5):", posts);

  // 5) Transação simples
  const [p1, p2] = await prisma.$transaction([
    prisma.post.create({
      data: { title: "Transação 1", authorId: users[0].id },
    }),
    prisma.post.create({
      data: { title: "Transação 2", authorId: users[0].id },
    }),
  ]);
  console.log("💱 Transação criada:", p1.id, p2.id);
}

run()
  .catch((e) => console.error("Erro:", e))
  .finally(async () => {
    await prisma.$disconnect();
  });
