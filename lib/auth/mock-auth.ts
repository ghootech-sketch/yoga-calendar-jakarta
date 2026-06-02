import { UserSession, UserRole } from './roles';

const IS_SERVER = typeof window === 'undefined';
const SESSION_KEY = 'ycj_session_v1';

/**
 * WARNING: This is a pre-production mock authentication system.
 * Production must implement standard secure server-side auth (such as NextAuth.js/Auth.js) and session management.
 */

export const MOCK_USERS = [
  {
    email: 'admin@yogacalendarjakarta.com',
    password: 'admin123',
    role: 'ADMIN' as UserRole,
    name: 'Admin Yoga Calendar',
    organizerId: 'org-1' // Connects to physical organizer ID
  },
  {
    email: 'eo@yogacalendarjakarta.com',
    password: 'eo123',
    role: 'EO' as UserRole,
    name: 'EO Jakarta Wellness',
    organizerId: 'org-2' // Connected to Jakarta Wellness Studio
  }
];

export const MockAuthService = {
  getCurrentSession(): UserSession | null {
    if (IS_SERVER) return null;
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse session from localStorage', e);
      return null;
    }
  },

  login(email: string, password: string): { success: boolean; session?: UserSession; error?: string } {
    if (IS_SERVER) return { success: false, error: 'Server side authentication not supported in mock' };

    const emailClean = email.trim().toLowerCase();
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === emailClean);

    if (!user) {
      return { success: false, error: 'Email tidak terdaftar' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Password salah' };
    }

    const session: UserSession = {
      email: user.email,
      role: user.role,
      name: user.name,
      organizerId: user.organizerId
    };

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { success: true, session };
    } catch (e) {
      console.error('Failed to save session', e);
      return { success: false, error: 'Gagal melanjutkan login ke browser' };
    }
  },

  logout(): void {
    if (IS_SERVER) return;
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error('Failed to remove session', e);
    }
  },

  isLoggedIn(): boolean {
    return this.getCurrentSession() !== null;
  },

  hasRole(role: UserRole): boolean {
    const session = this.getCurrentSession();
    return session?.role === role;
  },

  /**
   * Helper to ensure route permission
   */
  hasAccessToRoute(route: string): boolean {
    const session = this.getCurrentSession();
    if (!session) return false;

    if (route.startsWith('/admin') && session.role !== 'ADMIN') {
      return false;
    }

    if (route.startsWith('/eo') && session.role !== 'EO') {
      return false;
    }

    return true;
  }
};
