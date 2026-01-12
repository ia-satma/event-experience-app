"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, createEventAction } from "../actions";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { PlusCircle, Loader2 } from "lucide-react";

type FormValues = z.infer<typeof eventSchema>;

export function CreateEventForm({ onEventCreated }: { onEventCreated?: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            name: "",
            description: "",
            location: "",
            date: new Date().toISOString().slice(0, 16),
        },
    });

    const onSubmit = async (data: FormValues) => {
        setIsPending(true);
        try {
            await createEventAction(data);
            toast.success("Evento creado correctamente");
            setIsOpen(false);
            reset();
            onEventCreated?.();
        } catch (error) {
            toast.error("Error al crear el evento");
            console.error(error);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Nuevo Evento
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Evento</DialogTitle>
                    <DialogDescription>
                        Ingresa los detalles del evento a continuación.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre del Evento</Label>
                        <Input id="name" {...register("name")} placeholder="Ej. Taller de IA" />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="date">Fecha y Hora</Label>
                        <Input id="date" type="datetime-local" {...register("date")} />
                        {errors.date && (
                            <p className="text-sm text-destructive">{errors.date.message}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="location">Ubicación</Label>
                        <Input id="location" {...register("location")} placeholder="Salón A / Virtual" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Input id="description" {...register("description")} placeholder="Breve descripción..." />
                    </div>
                    <Button type="submit" disabled={isPending} className="mt-4">
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            "Crear Evento"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
