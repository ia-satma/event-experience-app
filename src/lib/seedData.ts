import type { User, Attendee, Session } from '@/types';
import { dataService } from './dataService';

export function initializeSeedData(): void {
  if (dataService.getUsers().length > 0) {
    return;
  }

  const users: User[] = [
    {
      id: 'u1',
      email: 'admin@congreso.com',
      password: 'admin123',
      role: 'STAFF',
      name: 'Ana Martínez',
    },
    {
      id: 'u2',
      email: 'staff@congreso.com',
      password: 'staff123',
      role: 'STAFF',
      name: 'Carlos López',
    },
    {
      id: 'u3',
      email: 'maria.garcia@email.com',
      password: 'pass123',
      role: 'ATTENDEE',
      name: 'María García',
    },
    {
      id: 'u4',
      email: 'juan.rodriguez@email.com',
      password: 'pass123',
      role: 'ATTENDEE',
      name: 'Juan Rodríguez',
    },
    {
      id: 'u5',
      email: 'lucia.fernandez@email.com',
      password: 'pass123',
      role: 'ATTENDEE',
      name: 'Lucía Fernández',
    },
    {
      id: 'u6',
      email: 'pedro.sanchez@email.com',
      password: 'pass123',
      role: 'ATTENDEE',
      name: 'Pedro Sánchez',
    },
  ];

  const attendees: Attendee[] = [
    {
      id: 'a1',
      userId: 'u3',
      name: 'María García',
      email: 'maria.garcia@email.com',
      ticketType: 'FULL',
      checkedIn: true,
      checkInTime: new Date(Date.now() - 3600000).toISOString(),
      qrCode: 'QR-FULL-001',
    },
    {
      id: 'a2',
      userId: 'u4',
      name: 'Juan Rodríguez',
      email: 'juan.rodriguez@email.com',
      ticketType: 'ACADEMIC',
      checkedIn: false,
      qrCode: 'QR-ACADEMIC-002',
    },
    {
      id: 'a3',
      userId: 'u5',
      name: 'Lucía Fernández',
      email: 'lucia.fernandez@email.com',
      ticketType: 'SOCIAL',
      checkedIn: true,
      checkInTime: new Date(Date.now() - 7200000).toISOString(),
      qrCode: 'QR-SOCIAL-003',
    },
    {
      id: 'a4',
      userId: 'u6',
      name: 'Pedro Sánchez',
      email: 'pedro.sanchez@email.com',
      ticketType: 'FULL',
      checkedIn: false,
      qrCode: 'QR-FULL-004',
    },
  ];

  const sessions: Session[] = [
    {
      id: 's1',
      title: 'Transformación Digital en la Práctica Legal',
      description: 'Exploración de las nuevas tecnologías aplicadas al derecho: IA, blockchain y automatización.',
      speaker: 'Dr. Alberto Ruiz',
      date: '2024-06-15',
      startTime: '09:00',
      endTime: '10:30',
      location: 'Auditorio Principal',
      type: 'ACADEMIC',
      capacity: 200,
    },
    {
      id: 's2',
      title: 'Derecho Penal Internacional Contemporáneo',
      description: 'Análisis de casos recientes en tribunales internacionales y su impacto en la legislación nacional.',
      speaker: 'Dra. Carmen Vega',
      date: '2024-06-15',
      startTime: '11:00',
      endTime: '12:30',
      location: 'Sala 201',
      type: 'ACADEMIC',
      capacity: 150,
    },
    {
      id: 's3',
      title: 'Ceremonia de Inauguración',
      description: 'Bienvenida oficial al XX Congreso Nacional de la Abogacía con autoridades y keynote speaker.',
      speaker: 'Autoridades del Congreso',
      date: '2024-06-15',
      startTime: '08:00',
      endTime: '09:00',
      location: 'Auditorio Principal',
      type: 'ALL',
      capacity: 500,
    },
    {
      id: 's4',
      title: 'Almuerzo de Networking',
      description: 'Espacio de encuentro informal entre profesionales del derecho y networking.',
      speaker: '',
      date: '2024-06-15',
      startTime: '13:00',
      endTime: '14:30',
      location: 'Terraza Garden',
      type: 'SOCIAL',
      capacity: 300,
    },
    {
      id: 's5',
      title: 'Ética Profesional y Responsabilidad del Abogado',
      description: 'Debate sobre los dilemas éticos contemporáneos en el ejercicio de la profesión legal.',
      speaker: 'Panel de Expertos',
      date: '2024-06-15',
      startTime: '15:00',
      endTime: '17:00',
      location: 'Sala 102',
      type: 'ACADEMIC',
      capacity: 180,
    },
    {
      id: 's6',
      title: 'Cena de Gala',
      description: 'Evento social de clausura con música en vivo y entrega de reconocimientos.',
      speaker: '',
      date: '2024-06-15',
      startTime: '20:00',
      endTime: '23:00',
      location: 'Salón Imperial',
      type: 'SOCIAL',
      capacity: 400,
    },
  ];

  dataService.saveUsers(users);
  dataService.saveAttendees(attendees);
  dataService.saveSessions(sessions);
  dataService.saveFavorites([
    { userId: 'u3', sessionId: 's1' },
    { userId: 'u3', sessionId: 's3' },
  ]);
}
