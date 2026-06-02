import { Organizer } from './organizer-types';

const IS_SERVER = typeof window === 'undefined';
const ORGANIZERS_KEY = 'ycj_organizers_v1';

const INITIAL_ORGANIZERS: Organizer[] = [
  {
    id: 'org-1',
    organizerName: 'Yoga Calendar Jakarta Official',
    contactName: 'Jane Doe',
    email: 'admin@yogacalendarjakarta.com',
    phone: '6281342531331',
    description: 'Penyelenggara resmi festival dan kelas mingguan Yoga Calendar Jakarta.',
    status: 'active',
    createdAt: new Date('2026-01-01T00:00:00Z').toISOString()
  },
  {
    id: 'org-2',
    organizerName: 'Jakarta Wellness Studio',
    contactName: 'Budi Santoso',
    email: 'budi@jakarta-wellness.com',
    phone: '6281234567890',
    description: 'Studio kesehatan batin dan fisik terpadu di jantung Jakarta Selatan.',
    status: 'active',
    createdAt: new Date('2026-02-15T00:00:00Z').toISOString()
  },
  {
    id: 'org-3',
    organizerName: 'Mindful Space Jakarta',
    contactName: 'Siti Rahma',
    email: 'contact@mindfulspace.id',
    phone: '6281399887766',
    description: 'Komunitas meditasi, kundalini, dan terapi suara singing bowl terbesar di Jakarta Barat.',
    status: 'active',
    createdAt: new Date('2026-03-10T00:00:00Z').toISOString()
  }
];

export function getStoredOrganizers(): Organizer[] {
  if (IS_SERVER) return INITIAL_ORGANIZERS;
  try {
    const raw = localStorage.getItem(ORGANIZERS_KEY);
    if (!raw) {
      localStorage.setItem(ORGANIZERS_KEY, JSON.stringify(INITIAL_ORGANIZERS));
      return INITIAL_ORGANIZERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse organizers from localStorage', e);
    return INITIAL_ORGANIZERS;
  }
}

export function saveStoredOrganizers(organizers: Organizer[]): void {
  if (IS_SERVER) return;
  try {
    localStorage.setItem(ORGANIZERS_KEY, JSON.stringify(organizers));
  } catch (e) {
    console.error('Failed to save organizers to localStorage', e);
  }
}

export const OrganizerService = {
  getAllOrganizers(): Organizer[] {
    return getStoredOrganizers();
  },

  getOrganizerById(id: string): Organizer | null {
    const list = getStoredOrganizers();
    return list.find(org => org.id === id) || null;
  },

  getOrganizerByEmail(email: string): Organizer | null {
    const list = getStoredOrganizers();
    return list.find(org => org.email.toLowerCase() === email.toLowerCase()) || null;
  },

  createOrganizer(payload: Omit<Organizer, 'id' | 'createdAt'>): Organizer {
    const list = getStoredOrganizers();
    const newOrg: Organizer = {
      ...payload,
      id: `org-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    list.push(newOrg);
    saveStoredOrganizers(list);
    return newOrg;
  },

  updateOrganizer(id: string, payload: Partial<Omit<Organizer, 'id' | 'createdAt'>>): Organizer | null {
    const list = getStoredOrganizers();
    const idx = list.findIndex(org => org.id === id);
    if (idx === -1) return null;

    list[idx] = {
      ...list[idx],
      ...payload
    };
    saveStoredOrganizers(list);
    return list[idx];
  },

  toggleOrganizerStatus(id: string): Organizer | null {
    const list = getStoredOrganizers();
    const idx = list.findIndex(org => org.id === id);
    if (idx === -1) return null;

    const newStatus = list[idx].status === 'active' ? 'inactive' : 'active';
    list[idx] = {
      ...list[idx],
      status: newStatus
    };
    saveStoredOrganizers(list);
    return list[idx];
  }
};
