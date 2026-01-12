import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, GraduationCap, Users2, QrCode as QrCodeIcon, CheckCircle2, Clock } from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { useAuth } from '@/contexts/AuthContext';
import QRCode from 'react-qr-code';
import type { Attendee } from '@/types';

export function ProfileView() {
  const { currentUser } = useAuth();
  const attendee = currentUser ? dataService.getAttendeeByUserId(currentUser.id) : null;

  if (!attendee) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron datos del asistente</p>
      </div>
    );
  }

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
        return 'bg-gradient-to-br from-amber-500 to-orange-600';
      case 'ACADEMIC':
        return 'bg-gradient-to-br from-blue-500 to-cyan-600';
      case 'SOCIAL':
        return 'bg-gradient-to-br from-purple-500 to-pink-600';
    }
  };

  const getTicketBadgeColor = (type: Attendee['ticketType']) => {
    switch (type) {
      case 'FULL':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      case 'ACADEMIC':
        return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400';
      case 'SOCIAL':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
    }
  };

  const TicketIcon = getTicketIcon(attendee.ticketType);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
        <p className="text-muted-foreground mt-1">
          Información de tu registro y código QR de entrada
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden">
          <div className={`h-2 ${getTicketColor(attendee.ticketType)}`} />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TicketIcon className="h-5 w-5" />
              Información del Asistente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nombre Completo</p>
              <p className="text-lg font-semibold">{attendee.name}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-lg">{attendee.email}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Tipo de Entrada</p>
              <Badge className={getTicketBadgeColor(attendee.ticketType)}>
                <TicketIcon className="h-3 w-3 mr-1" />
                {attendee.ticketType}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Estado de Check-in</p>
              {attendee.checkedIn ? (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Ingresado {attendee.checkInTime && 
                    `a las ${new Date(attendee.checkInTime).toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}`
                  }
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <Clock className="h-3 w-3 mr-1" />
                  Pendiente de Check-in
                </Badge>
              )}
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground font-mono">
                Código: {attendee.qrCode}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCodeIcon className="h-5 w-5" />
              Código QR de Entrada
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <QRCode
                value={attendee.qrCode}
                size={256}
                level="H"
                className="w-full h-auto"
              />
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">
                Presenta este código en la entrada
              </p>
              <p className="text-xs text-muted-foreground">
                También puedes usar el código: <span className="font-mono font-semibold">{attendee.qrCode}</span>
              </p>
            </div>

            {!attendee.checkedIn && (
              <div className="w-full p-3 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="text-xs text-center text-accent-foreground">
                  💡 Mantén este código disponible para agilizar tu ingreso al evento
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
