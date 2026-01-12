import { z } from "zod";

export const eventSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    date: z.string().or(z.date()),
    location: z.string().optional(),
    slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug inválido (solo minúsculas, números y guiones)"),
});
