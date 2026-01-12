import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Crown, GraduationCap, Users2, CheckCircle2, Clock } from 'lucide-react';
import { dataService } from '@/lib/dataService';
import type { Attendee } from '@/types';

export function AttendeesView() {
  const [searchQuery, setSearchQuery] = useState('');
  const attendees = dataService.getAttendees();

  const filteredAttendees = useMemo(() => {
    if (!searchQuery.trim()) return attendees;
    
    const query = searchQuery.toLowerCase();
    return attendees.filter(
      (attendee) =>
        attendee.name.toLowerCase().includes(query) ||
        attendee.email.toLowerCase().includes(query) ||
        attendee.qrCode.toLowerCase().includes(query)
    );
  }, [attendees, searchQuery]);

  const getTicketIcon = (type: Attendee['ticketType']) => {
    switch (type) {
      case 'FULL':
        return Crown;
      case 'ACADEMIC':
        return GraduationCap;
      case 'SOCIAL':
        return Users2;
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

  const formatCheckInTime = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Asistentes</h2>
        <p className="text-muted-foreground mt-1">
          Buscar y administrar todos los asistentes registrados
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, email o código QR..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Asistentes Registrados ({filteredAttendees.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAttendees.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron asistentes con ese criterio</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAttendees.map((attendee) => {
                const TicketIcon = getTicketIcon(attendee.ticketType);
                return (
                  <div
                    key={attendee.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-2 rounded-full ${getTicketColor(attendee.ticketType)} bg-opacity-20`}>
                        <TicketIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{attendee.name}</h3>
                        <p className="text-sm text-muted-foreground">{attendee.email}</p>
                        <p className="text-xs text-muted-foreground mt-1 font-mono">
                          {attendee.qrCode}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className={getTicketColor(attendee.ticketType)}>
                        {attendee.ticketType}
                      </Badge>
                      
                      {attendee.checkedIn ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Check-in: {formatCheckInTime(attendee.checkInTime)}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Pendiente
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
