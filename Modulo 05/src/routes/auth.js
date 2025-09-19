/**
 * 📌 Rotas de Autenticação: /auth/register, /auth/login, /auth/me
 */
import bcrypt from "bcryptjs";
import { registerBody, loginBody } from "../utils/validators.js";

export default async function authRoutes(fastify) {
  // Registrar usuário
  fastify.post("/auth/register", async (req, reply) => {
    const parsed = registerBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: "ValidationError",
        details: parsed.error.errors
      });
    }

    const { name, email, password } = parsed.data;

    const exists = await fastify.prisma.user.findUnique({ where: { email } });
    if (exists) return reply.code(409).send({ error: "Conflict", message: "Email já cadastrado" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await fastify.prisma.user.create({
      data: { name, email, passwordHash }
    });

    return reply.code(201).send({ id: user.id, name: user.name, email: user.email });
  });

  // Login
  fastify.post("/auth/login", async (req, reply) => {
    const parsed = loginBody.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: "ValidationError",
        details: parsed.error.errors
      });
    }

    const { email, password } = parsed.data;
    const user = await fastify.prisma.user.findUnique({ where: { email } });
    if (!user) return reply.code(401).send({ error: "InvalidCredentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return reply.code(401).send({ error: "InvalidCredentials" });

    const token = fastify.jwt.sign({ sub: user.id }, { expiresIn: fastify.config.jwtExpiresIn });
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  });

  // Perfil (protegido)
  fastify.get("/auth/me", { preHandler: [fastify.auth] }, async (req) => {
    const id = req.user.sub;
    const user = await fastify.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true }
    });
    return user;
  });
}
