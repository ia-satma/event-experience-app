import { db } from "@/db";
import { events } from "@/db/schema";
import { z } from "zod";

export const eventSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    description: z.string().optional(),
    location: z.string().optional(),
    date: z.string().or(z.date()),
});

export async function createEventAction(data: z.infer<typeof eventSchema>) {
    const validated = eventSchema.parse(data);

    await db.insert(events).values({
        name: validated.name,
        description: validated.description,
        location: validated.location,
        date: new Date(validated.date),
    });

    // revalidatePath("/events"); // Only for Next.js
}

export async function getEventsAction() {
    return await db.select().from(events).orderBy(events.date);
}
