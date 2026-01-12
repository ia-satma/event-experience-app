import { db } from "@/lib/db";
import { attendees, events } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import QRCode from "react-qr-code";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function PublicTicketPage({ params }: { params: { code: string } }) {
    const attendee = await db.query.attendees.findFirst({
        where: eq(attendees.ticketCode, params.code),
    });

    if (!attendee) notFound();

    const event = await db.query.events.findFirst({
        where: eq(events.id, attendee.eventId),
    });

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
            <Card className="w-full max-w-md overflow-hidden shadow-2xl">
                <div className="h-2 bg-primary" />
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl uppercase tracking-widest">{event?.name}</CardTitle>
                    <CardDescription>Ticket Digital d'Acreditació</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6 p-8">
                    <div className="bg-white p-4 rounded-xl shadow-inner">
                        <QRCode value={attendee.ticketCode} size={200} />
                    </div>

                    <div className="text-center space-y-1">
                        <h2 className="text-2xl font-bold">{attendee.name}</h2>
                        <p className="text-muted-foreground font-mono text-sm">{attendee.ticketCode}</p>
                    </div>

                    <Badge variant={attendee.status === 'checked_in' ? "default" : "outline"} className="px-4 py-1 text-base">
                        {attendee.status === 'checked_in' ? "YA INGRESÓ" : "VALIDO PARA INGRESAR"}
                    </Badge>

                    <p className="text-[10px] text-muted-foreground text-center uppercase tracking-tighter">
                        PRESENTA ESTE CÓDIGO EN LA ENTRADA PARA TU ACREDITACIÓN
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
