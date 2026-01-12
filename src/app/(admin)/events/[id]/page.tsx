import { db } from "@/lib/db";
import { events, attendees } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExcelUploader } from "@/features/attendees/components/ExcelUploader";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Users, Mail, Ticket, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function EventDetailPage({ params }: { params: { id: string } }) {
    const event = await db.query.events.findFirst({
        where: eq(events.id, params.id),
    });

    if (!event) notFound();

    const eventAttendees = await db.select().from(attendees).where(eq(attendees.eventId, params.id));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">{event.name}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(event.date), "PPP", { locale: es })}
                        </span>
                        {event.location && (
                            <span>• {event.location}</span>
                        )}
                    </div>
                </div>
                <Button variant="outline" asChild>
                    <a href={`/api/events/${event.id}/export`} download>
                        <Download className="mr-2 h-4 w-4" />
                        Exportar CSV
                    </a>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Importar Asistentes</CardTitle>
                        <CardDescription>Sube un archivo Excel para cargar asistentes de forma masiva.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ExcelUploader eventId={event.id} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Resumen</CardTitle>
                        <CardDescription>Estadísticas rápidas del evento.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-around py-6">
                        <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground">Total Asistentes</p>
                            <p className="text-3xl font-bold">{eventAttendees.length}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground">Check-ins</p>
                            <p className="text-3xl font-bold text-green-600">
                                {eventAttendees.filter(a => a.status === 'checked_in').length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listado de Asistentes</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Código Ticket</TableHead>
                                <TableHead>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {eventAttendees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                        No hay asistentes registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                eventAttendees.map((attendee) => (
                                    <TableRow key={attendee.id}>
                                        <TableCell className="font-medium">{attendee.name}</TableCell>
                                        <TableCell>{attendee.email}</TableCell>
                                        <TableCell className="font-mono text-xs">{attendee.ticketCode}</TableCell>
                                        <TableCell>
                                            <Badge variant={attendee.status === 'checked_in' ? "default" : "secondary"}>
                                                {attendee.status === 'checked_in' ? "Acreditado" : "Registrado"}
                                            </Badge>
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

