import { QRScanner } from "@/features/checkin/components/QRScanner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function CheckInPage() {
    return (
        <div className="space-y-6 flex flex-col items-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Check-in de Asistentes</h1>
                <p className="text-muted-foreground">Utiliza la cámara para escanear el código QR del ticket.</p>
            </div>

            <div className="w-full max-w-lg">
                <QRScanner />
            </div>
        </div>
    );
}
