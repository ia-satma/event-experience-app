import { db } from "@/lib/db";
import { events } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { RegistrationForm } from "@/features/attendees/components/RegistrationForm";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default async function PublicRegistrationPage({ params }: { params: { eventSlug: string } }) {
    const event = await db.query.events.findFirst({
        where: eq(events.slug, params.eventSlug),
    });

    if (!event) notFound();

    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Registro al Evento</CardTitle>
                    <CardDescription>{event.name}</CardDescription>
                </CardHeader>
                <CardContent>
                    <RegistrationForm eventId={event.id} />
                </CardContent>
            </Card>
        </div>
    );
}
