"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { registerAttendee } from "../actions";
import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

const schema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Email inválido"),
});

export function RegistrationForm({ eventId }: { eventId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof schema>) => {
        setIsLoading(true);
        try {
            const ticketCode = await registerAttendee(eventId, values.name, values.email);
            toast.success("Registro exitoso");
            router.push(`/ticket/${ticketCode}`);
        } catch (error) {
            toast.error("Error al registrarse. Posiblemente ya estés registrado con este email.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" {...form.register("name")} placeholder="Tu nombre" />
                {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} placeholder="tu@email.com" />
                {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
            </div>
            <Button type="submit" className="w-full gap-2" size="lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Registrarse y Obtener Ticket
            </Button>
        </form>
    );
}
