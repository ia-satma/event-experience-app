"use server";

import { db } from "@/lib/db";
import { events } from "./schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";

import { eventSchema } from "./schema";

export async function createEvent(data: z.infer<typeof eventSchema>) {
    const validated = eventSchema.parse(data);

    await db.insert(events).values({
        name: validated.name,
        date: new Date(validated.date),
        location: validated.location,
        slug: validated.slug,
        status: "draft",
    });

    revalidatePath("/events");
}

export async function getEvents() {
    return await db.select().from(events).orderBy(events.date);
}
