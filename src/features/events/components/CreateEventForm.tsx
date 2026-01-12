"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createEvent } from "../actions";
import { eventSchema } from "../schema";
import { useState } from "react";
import { Loader2, Plus, Calendar } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type FormValues = z.infer<typeof eventSchema>;

export function CreateEventForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            name: "",
            location: "",
            date: new Date().toISOString().split("T")[0],
            slug: "",
        },
    });

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);
        try {
            await createEvent(data);
            toast.success("Evento creado correctamente");
            setIsOpen(false);
            form.reset();
        } catch (error) {
            toast.error("Error al crear el evento. Verifica que el slug sea único.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nuevo Evento
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Evento</DialogTitle>
                    <DialogDescription>
                        Completa los detalles del evento para el congreso.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Evento</Label>
                        <Input id="name" {...form.register("name")} placeholder="Congreso de Medicina 2026" />
                        {form.formState.errors.name && (
                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date">Fecha</Label>
                        <Input id="date" type="date" {...form.register("date")} />
                        {form.formState.errors.date && (
                            <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Ubicación</Label>
                        <Input id="location" {...form.register("location")} placeholder="Salón Real, Hotel Hilton" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input id="slug" {...form.register("slug")} placeholder="congreso-medicina-2026" />
                        <p className="text-[10px] text-muted-foreground">Único, solo letras, números y guiones.</p>
                        {form.formState.errors.slug && (
                            <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
                        )}
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Crear Evento
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
