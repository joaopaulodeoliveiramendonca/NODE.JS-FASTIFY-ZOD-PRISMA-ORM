/**
 * 📌 Zod Schemas — centralizados
 */
import { z } from "zod";

export const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),     // ex: "createdAt"
  sortDir: z.enum(["asc", "desc"]).optional()
});

export const registerBody = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8, "Mínimo 8 caracteres")
});

export const loginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const userIdParam = z.object({ id: z.string().min(1) });

export const createPostBody = z.object({
  title: z.string().min(3),
  content: z.string().optional()
});

export const postIdParam = z.object({ id: z.string().min(1) });

export const listPostsQuery = paginationQuery.extend({
  published: z.coerce.boolean().optional()
});
