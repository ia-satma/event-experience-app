import { getEvents } from "@/features/events/actions";
import { CreateEventForm } from "@/features/events/components/CreateEventForm";
import { EventList } from "@/features/events/components/EventList";

export default async function EventsAdminPage() {
    const events = await getEvents();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
                    <p className="text-muted-foreground">Gestiona la lista de eventos y asistentes.</p>
                </div>
                <CreateEventForm />
            </div>

            <EventList events={events} />
        </div>
    );
}

