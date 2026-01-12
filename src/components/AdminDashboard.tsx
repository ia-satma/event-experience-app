import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, QrCode, Calendar, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MetricsView } from './admin/MetricsView';
import { AttendeesView } from './admin/AttendeesView';
import { ScannerView } from './admin/ScannerView';
import EventsPage from '@/app/events/page';

export function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-bold text-primary">XX Congreso Nacional</h1>
              <p className="text-xs text-muted-foreground">Panel de Administración</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.role}</p>
              </div>

              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Button variant="outline" size="sm" onClick={logout} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="metrics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Métricas</span>
            </TabsTrigger>
            <TabsTrigger value="attendees" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Asistentes</span>
            </TabsTrigger>
            <TabsTrigger value="scanner" className="gap-2">
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">Escáner</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Eventos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4">
            <MetricsView />
          </TabsContent>

          <TabsContent value="attendees" className="space-y-4">
            <AttendeesView />
          </TabsContent>

          <TabsContent value="scanner" className="space-y-4">
            <ScannerView />
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <EventsPage />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
