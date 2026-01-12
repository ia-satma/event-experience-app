"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { bulkImportAttendees } from "../actions";
import { Upload, Loader2 } from "lucide-react";

export function ExcelUploader({ eventId, onComplete }: { eventId: string; onComplete?: () => void }) {
    const [isPending, setIsPending] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsPending(true);
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet) as any[];

                const formattedData = json
                    .map((row) => ({
                        name: row.Nombre || row.name || row.NAME,
                        email: row.Email || row.email || row.EMAIL,
                    }))
                    .filter((item) => item.name && item.email);

                if (formattedData.length === 0) {
                    toast.error("No se encontraron datos válidos en el Excel (se requiere 'Nombre' y 'Email')");
                    return;
                }

                await bulkImportAttendees(eventId, formattedData);
                toast.success(`${formattedData.length} asistentes importados correctamente`);
                onComplete?.();
            } catch (error) {
                toast.error("Error al procesar el archivo Excel");
                console.error(error);
            } finally {
                setIsPending(false);
                e.target.value = ""; // Clear input
            }
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="excel-upload" className="sr-only">Importar desde Excel</Label>
            <div className="flex gap-2">
                <Input
                    id="excel-upload"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    disabled={isPending}
                    className="max-w-xs"
                />
                <Button variant="outline" disabled={isPending} className="gap-2">
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Importar
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">
                Columnas requeridas: "Nombre", "Email".
            </p>
        </div>
    );
}
