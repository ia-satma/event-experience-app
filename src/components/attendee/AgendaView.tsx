import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Clock, Users, AlertTriangle, Calendar, GraduationCap, Users2 as Users2Icon } from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Session, SessionType, TicketType } from '@/types';

export function AgendaView() {
  const { currentUser } = useAuth();
  const attendee = currentUser ? dataService.getAttendeeByUserId(currentUser.id) : null;
  const sessions = dataService.getSessions();
  const [favorites, setFavorites] = useState<string[]>(
    currentUser ? dataService.getUserFavorites(currentUser.id) : []
  );
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  const canAccessSession = (sessionType: SessionType, ticketType: TicketType): boolean => {
    if (sessionType === 'ALL') return true;
    if (ticketType === 'FULL') return true;
    if (sessionType === 'ACADEMIC' && ticketType === 'ACADEMIC') return true;
    if (sessionType === 'SOCIAL' && ticketType === 'SOCIAL') return true;
    return false;
  };

  const handleToggleFavorite = (sessionId: string, session: Session) => {
    if (!currentUser || !attendee) return;

    const canAccess = canAccessSession(session.type, attendee.ticketType);
    
    if (!canAccess && !favorites.includes(sessionId)) {
      toast.error(
        `Tu entrada ${attendee.ticketType} no incluye acceso a sesiones ${session.type === 'ACADEMIC' ? 'académicas' : 'sociales'}`,
        {
          description: 'Considera actualizar tu entrada para acceder a este contenido',
        }
      );
      return;
    }

    dataService.toggleFavorite(currentUser.id, sessionId);
    
    const newFavorites = favorites.includes(sessionId)
      ? favorites.filter(id => id !== sessionId)
      : [...favorites, sessionId];
    
    setFavorites(newFavorites);

    if (newFavorites.includes(sessionId)) {
      toast.success('Sesión agregada a favoritos');
    } else {
      toast.success('Sesión removida de favoritos');
    }
  };

  const filteredSessions = useMemo(() => {
    if (activeTab === 'favorites') {
      return sessions.filter(s => favorites.includes(s.id));
    }
    return sessions;
  }, [sessions, favorites, activeTab]);

  const getSessionTypeIcon = (type: SessionType) => {
    switch (type) {
      case 'ACADEMIC': return GraduationCap;
      case 'SOCIAL': return Users2Icon;
      case 'ALL': return Users;
    }
  };

  const getSessionTypeBadge = (type: SessionType) => {
    switch (type) {
      case 'ACADEMIC':
        return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400';
      case 'SOCIAL':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'ALL':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
    }
  };

  if (!attendee) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron datos del asistente</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mi Agenda</h2>
        <p className="text-muted-foreground mt-1">
          Explora las sesiones y marca tus favoritas
        </p>
      </div>

      {attendee.ticketType === 'SOCIAL' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Tu entrada <strong>Social</strong> no incluye acceso a sesiones académicas. 
            Solo puedes agregar eventos sociales a tus favoritos.
          </AlertDescription>
        </Alert>
      )}

      {attendee.ticketType === 'ACADEMIC' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Tu entrada <strong>Académica</strong> no incluye acceso a eventos sociales exclusivos. 
            Solo puedes agregar sesiones académicas a tus favoritos.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'favorites')}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="all">
            Todas las Sesiones ({sessions.length})
          </TabsTrigger>
          <TabsTrigger value="favorites">
            Mis Favoritos ({favorites.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <SessionList 
            sessions={filteredSessions}
            favorites={favorites}
            attendee={attendee}
            onToggleFavorite={handleToggleFavorite}
            getSessionTypeIcon={getSessionTypeIcon}
            getSessionTypeBadge={getSessionTypeBadge}
            canAccessSession={canAccessSession}
          />
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          {favorites.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  Aún no has marcado sesiones favoritas
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Explora la agenda y marca las sesiones que te interesan
                </p>
              </CardContent>
            </Card>
          ) : (
            <SessionList 
              sessions={filteredSessions}
              favorites={favorites}
              attendee={attendee}
              onToggleFavorite={handleToggleFavorite}
              getSessionTypeIcon={getSessionTypeIcon}
              getSessionTypeBadge={getSessionTypeBadge}
              canAccessSession={canAccessSession}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface SessionListProps {
  sessions: Session[];
  favorites: string[];
  attendee: { ticketType: TicketType };
  onToggleFavorite: (id: string, session: Session) => void;
  getSessionTypeIcon: (type: SessionType) => typeof GraduationCap;
  getSessionTypeBadge: (type: SessionType) => string;
  canAccessSession: (sessionType: SessionType, ticketType: TicketType) => boolean;
}

function SessionList({ 
  sessions, 
  favorites, 
  attendee, 
  onToggleFavorite,
  getSessionTypeIcon,
  getSessionTypeBadge,
  canAccessSession 
}: SessionListProps) {
  return (
    <div className="grid gap-4">
      {sessions.map((session) => {
        const isFavorite = favorites.includes(session.id);
        const canAccess = canAccessSession(session.type, attendee.ticketType);
        const SessionIcon = getSessionTypeIcon(session.type);

        return (
          <Card 
            key={session.id} 
            className={`transition-all ${!canAccess ? 'opacity-60' : ''}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <CardTitle className="text-xl">{session.title}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={getSessionTypeBadge(session.type)}>
                      <SessionIcon className="h-3 w-3 mr-1" />
                      {session.type}
                    </Badge>
                    {!canAccess && (
                      <Badge variant="destructive" className="text-xs">
                        No incluido en tu entrada
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  variant={isFavorite ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => onToggleFavorite(session.id, session)}
                  className={isFavorite ? 'bg-accent hover:bg-accent/90' : ''}
                >
                  <Star 
                    className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
                  />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{session.description}</p>

              {session.speaker && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{session.speaker}</span>
                </div>
              )}

              <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(session.date).toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'long' 
                  })}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{session.startTime} - {session.endTime}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{session.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
