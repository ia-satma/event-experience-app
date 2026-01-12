"use server";

import { db } from "@/lib/db";
import { attendees } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";

export async function bulkImportAttendees(eventId: string, data: { name: string; email: string }[]) {
    const attendeesToInsert = data.map((item) => ({
        eventId,
        name: item.name,
        email: item.email,
        ticketCode: Math.random().toString(36).substring(2, 10).toUpperCase(), // 8-char random code
        status: "registered" as const,
    }));

    // Batch insert
    await db.insert(attendees).values(attendeesToInsert).onConflictDoNothing();

    revalidatePath(`/dashboard/events/${eventId}`);
}

export async function getAttendeesByEvent(eventId: string) {
    return await db.select().from(attendees).where(eq(attendees.eventId, eventId));
}

export async function registerAttendee(eventId: string, name: string, email: string) {
    const ticketCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    await db.insert(attendees).values({
        eventId,
        name,
        email,
        ticketCode,
        status: "registered",
    });

    return ticketCode;
}
