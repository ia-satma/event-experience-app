import { db } from "@/lib/db";
import { attendees, events } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Parser } from "json2csv";
import { NextResponse } from "next/server";
import { format } from "date-fns";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const eventId = params.id;

        // 1. Verificar evento
        const event = await db.query.events.findFirst({
            where: eq(events.id, eventId),
        });

        if (!event) {
            return new NextResponse("Evento no encontrado", { status: 404 });
        }

        // 2. Obtener asistentes
        const attendeesList = await db.select().from(attendees).where(eq(attendees.eventId, eventId));

        if (attendeesList.length === 0) {
            return new NextResponse("No hay asistentes para exportar", { status: 400 });
        }

        // 3. Preparar datos para CSV
        const data = attendeesList.map((attendee) => ({
            Nombre: attendee.name,
            Email: attendee.email,
            Ticket: attendee.ticketCode,
            Estado: attendee.status === "checked_in" ? "Asistió" : "Registrado",
            "Fecha Registro": format(new Date(attendee.createdAt), "yyyy-MM-dd HH:mm:ss"),
            "Hora Check-in": attendee.checkinAt ? format(new Date(attendee.checkinAt), "yyyy-MM-dd HH:mm:ss") : "-",
        }));

        // 4. Generar CSV
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);

        // 5. Retornar respuesta con headers de descarga
        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="asistentes-${event.slug}.csv"`,
            },
        });

    } catch (error) {
        console.error("Error exportando CSV:", error);
        return new NextResponse("Error interno del servidor", { status: 500 });
    }
}
