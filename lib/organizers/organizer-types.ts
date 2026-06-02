export interface Organizer {
  id: string;
  organizerName: string;
  contactName: string;
  email: string;
  phone: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}
