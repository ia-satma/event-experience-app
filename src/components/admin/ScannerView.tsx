import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { QrCode, Camera, CameraOff, CheckCircle2, XCircle, Crown, GraduationCap, Users2 } from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { toast } from 'sonner';
import type { Attendee } from '@/types';

export function ScannerView() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedAttendee, setLastScannedAttendee] = useState<Attendee | null>(null);
  const [scanResult, setScanResult] = useState<'success' | 'error' | 'duplicate' | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerElementId = 'qr-reader';

  const startScanning = async () => {
    try {
      const html5QrCode = new Html5Qrcode(scannerElementId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScan(decodedText);
        },
        () => {}
      );

      setIsScanning(true);
    } catch (error) {
      console.error('Error starting scanner:', error);
      toast.error('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScan = (qrCode: string) => {
    const attendee = dataService.getAttendeeByQR(qrCode);

    if (!attendee) {
      setScanResult('error');
      setLastScannedAttendee(null);
      toast.error('Código QR no válido');
      return;
    }

    if (attendee.checkedIn) {
      setScanResult('duplicate');
      setLastScannedAttendee(attendee);
      const checkInTime = attendee.checkInTime 
        ? new Date(attendee.checkInTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        : '';
      toast.warning(`${attendee.name} ya ingresó a las ${checkInTime}`);
      return;
    }

    const success = dataService.checkInAttendee(attendee.id);
    
    if (success) {
      const updatedAttendee = dataService.getAttendeeByQR(qrCode);
      setScanResult('success');
      setLastScannedAttendee(updatedAttendee || attendee);
      toast.success(`✓ Check-in exitoso: ${attendee.name}`);
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const getTicketIcon = (type: Attendee['ticketType']) => {
    switch (type) {
      case 'FULL': return Crown;
      case 'ACADEMIC': return GraduationCap;
      case 'SOCIAL': return Users2;
    }
  };

  const getTicketColor = (type: Attendee['ticketType']) => {
    switch (type) {
      case 'FULL':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      case 'ACADEMIC':
        return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400';
      case 'SOCIAL':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Escáner de Check-in</h2>
        <p className="text-muted-foreground mt-1">
          Escanea los códigos QR de los asistentes para registrar su entrada
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Lector QR
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              id={scannerElementId} 
              className="rounded-lg overflow-hidden bg-black min-h-[300px] flex items-center justify-center"
            >
              {!isScanning && (
                <div className="text-center p-8">
                  <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Activa la cámara para comenzar a escanear
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {!isScanning ? (
                <Button onClick={startScanning} className="flex-1 gap-2">
                  <Camera className="h-4 w-4" />
                  Activar Cámara
                </Button>
              ) : (
                <Button onClick={stopScanning} variant="destructive" className="flex-1 gap-2">
                  <CameraOff className="h-4 w-4" />
                  Detener Escáner
                </Button>
              )}
            </div>

            {isScanning && (
              <Alert>
                <Camera className="h-4 w-4" />
                <AlertDescription>
                  Apunta la cámara hacia el código QR del asistente
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultado del Escaneo</CardTitle>
          </CardHeader>
          <CardContent>
            {!lastScannedAttendee && !scanResult && (
              <div className="text-center py-12 text-muted-foreground">
                <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Esperando escaneo...</p>
              </div>
            )}

            {scanResult === 'error' && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Código QR no válido. Este código no corresponde a ningún asistente registrado.
                </AlertDescription>
              </Alert>
            )}

            {lastScannedAttendee && scanResult === 'success' && (
              <div className="space-y-4">
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    Check-in registrado exitosamente
                  </AlertDescription>
                </Alert>

                <div className="p-4 rounded-lg border bg-card space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getTicketColor(lastScannedAttendee.ticketType)}`}>
                      {(() => {
                        const Icon = getTicketIcon(lastScannedAttendee.ticketType);
                        return <Icon className="h-5 w-5" />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{lastScannedAttendee.name}</h3>
                      <p className="text-sm text-muted-foreground">{lastScannedAttendee.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={getTicketColor(lastScannedAttendee.ticketType)}>
                      {lastScannedAttendee.ticketType}
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Ingresado
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground font-mono pt-2 border-t">
                    {lastScannedAttendee.qrCode}
                  </div>
                </div>
              </div>
            )}

            {lastScannedAttendee && scanResult === 'duplicate' && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Este asistente ya realizó el check-in a las{' '}
                    {lastScannedAttendee.checkInTime &&
                      new Date(lastScannedAttendee.checkInTime).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                  </AlertDescription>
                </Alert>

                <div className="p-4 rounded-lg border bg-card space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getTicketColor(lastScannedAttendee.ticketType)}`}>
                      {(() => {
                        const Icon = getTicketIcon(lastScannedAttendee.ticketType);
                        return <Icon className="h-5 w-5" />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{lastScannedAttendee.name}</h3>
                      <p className="text-sm text-muted-foreground">{lastScannedAttendee.email}</p>
                    </div>
                  </div>

                  <Badge variant="outline" className={getTicketColor(lastScannedAttendee.ticketType)}>
                    {lastScannedAttendee.ticketType}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
