import { Event, DUMMY_EVENTS } from '../dummy-events';

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export interface ExtendedEvent extends Event {
  organizerId: string;
  status: EventStatus;
  highlightOrder: number;
}

const IS_SERVER = typeof window === 'undefined';
const EVENTS_KEY = 'ycj_events_v3';

// Seed events with default status and organizerId
export const INITIAL_EXTENDED_EVENTS: ExtendedEvent[] = DUMMY_EVENTS.map((evt, idx) => ({
  ...evt,
  organizerId: evt.organizerName.includes('partners') || evt.organizerName.includes('Maternity') 
    ? 'org-3' 
    : evt.organizerName.includes('Breathing') 
    ? 'org-2' 
    : 'org-1',
  status: 'published' as EventStatus,
  highlightOrder: evt.isHighlighted ? idx + 1 : 99
}));

export function getStoredEvents(): ExtendedEvent[] {
  if (IS_SERVER) return INITIAL_EXTENDED_EVENTS;
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(INITIAL_EXTENDED_EVENTS));
      return INITIAL_EXTENDED_EVENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse events from localStorage', e);
    return INITIAL_EXTENDED_EVENTS;
  }
}

export function saveStoredEvents(events: ExtendedEvent[]): void {
  if (IS_SERVER) return;
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to save events to localStorage', e);
  }
}

export const EventService = {
  getAllEvents(): ExtendedEvent[] {
    return getStoredEvents();
  },

  getPublishedEvents(): ExtendedEvent[] {
    return getStoredEvents().filter(e => e.status === 'published');
  },

  getHighlightedEvents(): ExtendedEvent[] {
    //status published & isHighlighted true & event not passed date (can check date, but simple sorting is fine)
    const list = getStoredEvents().filter(e => e.status === 'published' && e.isHighlighted);
    return list.sort((a, b) => a.highlightOrder - b.highlightOrder);
  },

  getEventById(id: string): ExtendedEvent | null {
    const list = getStoredEvents();
    return list.find(e => e.id === id) || null;
  },

  getEventBySlug(slug: string): ExtendedEvent | null {
    const list = getStoredEvents();
    return list.find(e => e.slug === slug) || null;
  },

  getEventsByOrganizer(organizerId: string): ExtendedEvent[] {
    const list = getStoredEvents();
    return list.filter(e => e.organizerId === organizerId);
  },

  createEvent(payload: Omit<ExtendedEvent, 'id' | 'availableSlot'>): ExtendedEvent {
    const list = getStoredEvents();
    const id = `evt-${Math.random().toString(36).substring(2, 9)}`;
    const newEvent: ExtendedEvent = {
      ...payload,
      id,
      availableSlot: payload.quota // Initially same as quota
    };
    list.push(newEvent);
    saveStoredEvents(list);
    return newEvent;
  },

  updateEvent(id: string, payload: Partial<ExtendedEvent>): ExtendedEvent | null {
    const list = getStoredEvents();
    const idx = list.findIndex(e => e.id === id);
    if (idx === -1) return null;

    // Handle availableSlot adjustment if quota changed
    let newAvailableSlot = list[idx].availableSlot;
    if (payload.quota !== undefined && payload.quota !== list[idx].quota) {
      const diff = payload.quota - list[idx].quota;
      newAvailableSlot = Math.max(0, list[idx].availableSlot + diff);
    }

    list[idx] = {
      ...list[idx],
      ...payload,
      availableSlot: payload.availableSlot !== undefined ? payload.availableSlot : newAvailableSlot
    };
    saveStoredEvents(list);
    return list[idx];
  },

  toggleHighlight(id: string): ExtendedEvent | null {
    const list = getStoredEvents();
    const idx = list.findIndex(e => e.id === id);
    if (idx === -1) return null;

    const newHighlight = !list[idx].isHighlighted;
    list[idx] = {
      ...list[idx],
      isHighlighted: newHighlight,
      highlightOrder: newHighlight ? 1 : 99
    };
    saveStoredEvents(list);
    return list[idx];
  },

  updateHighlightOrder(id: string, order: number): ExtendedEvent | null {
    const list = getStoredEvents();
    const idx = list.findIndex(e => e.id === id);
    if (idx === -1) return null;

    list[idx] = {
      ...list[idx],
      highlightOrder: order
    };
    saveStoredEvents(list);
    return list[idx];
  },

  deleteEvent(id: string): boolean {
    const list = getStoredEvents();
    const filtered = list.filter(e => e.id !== id);
    if (filtered.length === list.length) return false;
    saveStoredEvents(filtered);
    return true;
  }
};

