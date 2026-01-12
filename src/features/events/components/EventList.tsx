import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Event {
    id: string;
    name: string;
    date: Date;
    location: string | null;
    status: string;
    slug: string;
}

interface EventListProps {
    events: Event[];
}

export function EventList({ events }: EventListProps) {
    if (events.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                    <p className="mb-2">No hay eventos registrados.</p>
                    <p className="text-sm">Crea uno nuevo para comenzar.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Ubicación</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{event.name}</span>
                                        <span className="text-xs text-muted-foreground md:hidden">
                                            {format(new Date(event.date), "dd/MM/yyyy")}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>{format(new Date(event.date), "PPP")}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{event.location || "Sin ubicación"}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={event.status === "active" ? "default" : "secondary"}>
                                        {event.status === "active" ? "Activo" : "Borrador"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`events/${event.id}`}>
                                            Ver
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
