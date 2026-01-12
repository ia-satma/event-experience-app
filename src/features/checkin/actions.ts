"use server";

import { db } from "@/lib/db";
import { attendees } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function verifyCheckIn(ticketCode: string) {
    const attendee = await db.query.attendees.findFirst({
        where: eq(attendees.ticketCode, ticketCode),
        with: {
            event: true
        }
    });

    if (!attendee) {
        throw new Error("Ticket Inválido");
    }

    if (attendee.status === "checked_in") {
        throw new Error(`Este ticket YA FUE USADO por ${attendee.name}`);
    }

    // Update status
    await db.update(attendees)
        .set({
            status: "checked_in",
            checkinAt: new Date()
        })
        .where(eq(attendees.ticketCode, ticketCode));

    return {
        name: attendee.name,
        timestamp: new Date().toISOString()
    };
}
