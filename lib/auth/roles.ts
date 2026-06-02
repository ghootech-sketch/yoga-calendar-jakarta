export type UserRole = 'ADMIN' | 'EO';

export interface UserSession {
  email: string;
  role: UserRole;
  name: string;
  organizerId?: string; // Only populated for EO role to bound actions to specific partner
}
