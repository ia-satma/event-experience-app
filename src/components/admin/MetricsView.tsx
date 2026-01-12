import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Clock, Crown, GraduationCap, Users2 } from 'lucide-react';
import { dataService } from '@/lib/dataService';

export function MetricsView() {
  const metrics = dataService.getMetrics();

  const mainMetrics = [
    {
      title: 'Total Asistentes',
      value: metrics.totalAttendees,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Check-ins Realizados',
      value: metrics.checkedIn,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Pendientes',
      value: metrics.pending,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ];

  const ticketMetrics = [
    {
      title: 'Full Access',
      value: metrics.byTicketType.FULL,
      icon: Crown,
      color: 'text-amber-600',
    },
    {
      title: 'Académico',
      value: metrics.byTicketType.ACADEMIC,
      icon: GraduationCap,
      color: 'text-cyan-600',
    },
    {
      title: 'Social',
      value: metrics.byTicketType.SOCIAL,
      icon: Users2,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Métricas del Evento</h2>
        <p className="text-muted-foreground mt-1">
          Resumen general de asistencia y check-ins
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {mainMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${metric.bgColor}`}>
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{metric.value}</div>
                {metric.title === 'Check-ins Realizados' && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {metrics.totalAttendees > 0 
                      ? `${Math.round((metrics.checkedIn / metrics.totalAttendees) * 100)}%` 
                      : '0%'} del total
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribución por Tipo de Entrada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {ticketMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.title} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                  <Icon className={`h-8 w-8 ${metric.color}`} />
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
