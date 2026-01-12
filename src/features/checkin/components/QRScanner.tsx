"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyCheckIn } from "../actions";
import { toast } from "sonner";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QRScanner() {
    const [result, setResult] = useState<{ success: boolean; name: string; message?: string } | null>(null);
    const [isScanning, setIsScanning] = useState(true);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        if (isScanning && !scannerRef.current) {
            scannerRef.current = new Html5QrcodeScanner(
                "reader",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                },
        /* verbose= */ false
            );

            scannerRef.current.render(onScanSuccess, onScanFailure);
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear();
                scannerRef.current = null;
            }
        };
    }, [isScanning]);

    async function onScanSuccess(decodedText: string) {
        setIsScanning(false);
        if (scannerRef.current) {
            await scannerRef.current.clear();
            scannerRef.current = null;
        }

        try {
            const response = await verifyCheckIn(decodedText);
            setResult({ success: true, name: response.name });
            toast.success(`Check-in exitoso: ${response.name}`);
        } catch (error: any) {
            setResult({ success: false, name: decodedText, message: error.message });
            toast.error(error.message);
        }
    }

    function onScanFailure(error: any) {
        // Usually ignoring scan failures is fine
    }

    function resetScanner() {
        setResult(null);
        setIsScanning(true);
    }

    return (
        <div className="flex flex-col items-center gap-6">
            {isScanning ? (
                <Card className="w-full max-w-sm overflow-hidden">
                    <CardHeader className="bg-primary py-3">
                        <CardTitle className="text-center text-sm text-primary-foreground font-light uppercase tracking-widest">Escáner de Acreditación</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div id="reader" className="w-full" />
                    </CardContent>
                </Card>
            ) : (
                <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
                    {result?.success ? (
                        <Card className="border-4 border-green-500 overflow-hidden shadow-2xl">
                            <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
                                <CheckCircle2 className="w-20 h-20 text-green-500" />
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-extrabold uppercase text-green-600">ACCESO PERMITIDO</h2>
                                    <p className="text-2xl font-semibold">{result.name}</p>
                                </div>
                                <Button onClick={resetScanner} size="lg" className="w-full h-16 text-xl mt-4">
                                    ESCANEAR SIGUIENTE
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-4 border-destructive overflow-hidden shadow-2xl">
                            <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
                                <XCircle className="w-20 h-20 text-destructive" />
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-extrabold uppercase text-destructive">ACCESO DENEGADO</h2>
                                    <p className="text-lg text-muted-foreground">{result?.message || "Error desconocido"}</p>
                                </div>
                                <Button onClick={resetScanner} variant="destructive" size="lg" className="w-full h-16 text-xl mt-4">
                                    REINTENTAR
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}
