import { getEvents } from "@/features/events/actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CreateEventForm } from "@/features/events/components/CreateEventForm";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, ChevronRight } from "lucide-react";

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

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Ubicación</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No hay eventos creados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                events.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell className="font-medium">{event.name}</TableCell>
                                        <TableCell>{format(new Date(event.date), "PPP")}</TableCell>
                                        <TableCell>{event.location || "N/A"}</TableCell>
                                        <TableCell className="font-mono text-xs">{event.slug}</TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={`/dashboard/events/${event.id}`} className="gap-2">
                                                    Ver detalles
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
