import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Event } from "@/db/schema";
import { format } from "date-fns";
import { MapPin, Calendar } from "lucide-react";

interface EventListProps {
    events: Event[];
}

export function EventList({ events }: EventListProps) {
    if (events.length === 0) {
        return (
            <div className="text-center p-10 bg-muted/50 rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground">No hay eventos programados.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                        <CardTitle>{event.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location || "Ubicación no especificada"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(event.date), "PPP p")}
                        </div>
                        <p className="text-sm line-clamp-3">{event.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
