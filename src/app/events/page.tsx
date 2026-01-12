import { useState, useEffect } from "react";
import { getEventsAction } from "@/features/events/actions";
import { EventList } from "@/features/events/components/event-list";
import { CreateEventForm } from "@/features/events/components/create-event-form";
import type { Event } from "@/db/schema";
import { Loader2 } from "lucide-react";

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const data = await getEventsAction();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Próximos Eventos</h1>
                    <p className="text-muted-foreground">
                        Gestiona y visualiza todos los eventos disponibles.
                    </p>
                </div>
                <CreateEventForm onEventCreated={fetchEvents} />
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <EventList events={events} />
            )}
        </div>
    );
}
