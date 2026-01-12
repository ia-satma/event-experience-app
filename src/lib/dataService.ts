import type { User, Attendee, Session, FavoriteSession } from '@/types';

const STORAGE_KEYS = {
  USERS: 'event_users',
  ATTENDEES: 'event_attendees',
  SESSIONS: 'event_sessions',
  FAVORITES: 'event_favorites',
  CURRENT_USER: 'event_current_user',
};

class DataService {
  private getFromStorage<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getUsers(): User[] {
    return this.getFromStorage<User>(STORAGE_KEYS.USERS);
  }

  saveUsers(users: User[]): void {
    this.saveToStorage(STORAGE_KEYS.USERS, users);
  }

  getAttendees(): Attendee[] {
    return this.getFromStorage<Attendee>(STORAGE_KEYS.ATTENDEES);
  }

  saveAttendees(attendees: Attendee[]): void {
    this.saveToStorage(STORAGE_KEYS.ATTENDEES, attendees);
  }

  getSessions(): Session[] {
    return this.getFromStorage<Session>(STORAGE_KEYS.SESSIONS);
  }

  saveSessions(sessions: Session[]): void {
    this.saveToStorage(STORAGE_KEYS.SESSIONS, sessions);
  }

  getFavorites(): FavoriteSession[] {
    return this.getFromStorage<FavoriteSession>(STORAGE_KEYS.FAVORITES);
  }

  saveFavorites(favorites: FavoriteSession[]): void {
    this.saveToStorage(STORAGE_KEYS.FAVORITES, favorites);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  saveCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  getUserByEmail(email: string): User | undefined {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getAttendeeByQR(qrCode: string): Attendee | undefined {
    const attendees = this.getAttendees();
    return attendees.find(a => a.qrCode === qrCode);
  }

  getAttendeeByUserId(userId: string): Attendee | undefined {
    const attendees = this.getAttendees();
    return attendees.find(a => a.userId === userId);
  }

  checkInAttendee(attendeeId: string): boolean {
    const attendees = this.getAttendees();
    const attendee = attendees.find(a => a.id === attendeeId);
    
    if (!attendee) return false;
    if (attendee.checkedIn) return false;

    attendee.checkedIn = true;
    attendee.checkInTime = new Date().toISOString();
    this.saveAttendees(attendees);
    return true;
  }

  toggleFavorite(userId: string, sessionId: string): void {
    const favorites = this.getFavorites();
    const existingIndex = favorites.findIndex(
      f => f.userId === userId && f.sessionId === sessionId
    );

    if (existingIndex >= 0) {
      favorites.splice(existingIndex, 1);
    } else {
      favorites.push({ userId, sessionId });
    }

    this.saveFavorites(favorites);
  }

  getUserFavorites(userId: string): string[] {
    const favorites = this.getFavorites();
    return favorites
      .filter(f => f.userId === userId)
      .map(f => f.sessionId);
  }

  getMetrics() {
    const attendees = this.getAttendees();
    const totalAttendees = attendees.length;
    const checkedIn = attendees.filter(a => a.checkedIn).length;
    const pending = totalAttendees - checkedIn;

    const byTicketType = {
      FULL: attendees.filter(a => a.ticketType === 'FULL').length,
      ACADEMIC: attendees.filter(a => a.ticketType === 'ACADEMIC').length,
      SOCIAL: attendees.filter(a => a.ticketType === 'SOCIAL').length,
    };

    return {
      totalAttendees,
      checkedIn,
      pending,
      byTicketType,
    };
  }
}

export const dataService = new DataService();
