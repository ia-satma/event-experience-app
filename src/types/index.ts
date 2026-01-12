export type TicketType = 'FULL' | 'ACADEMIC' | 'SOCIAL';

export type UserRole = 'STAFF' | 'ATTENDEE';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
}

export interface Attendee {
  id: string;
  userId: string;
  name: string;
  email: string;
  ticketType: TicketType;
  checkedIn: boolean;
  checkInTime?: string;
  qrCode: string;
}

export type SessionType = 'ACADEMIC' | 'SOCIAL' | 'ALL';

export interface Session {
  id: string;
  title: string;
  description: string;
  speaker: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: SessionType;
  capacity: number;
}

export interface FavoriteSession {
  userId: string;
  sessionId: string;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}
