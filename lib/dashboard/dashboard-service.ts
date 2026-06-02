import { EventService, ExtendedEvent } from '../events/event-service';
import { BookingService } from '../bookings/booking-store';
import { Booking } from '../bookings/booking-types';

export interface AdminMetrics {
  totalActiveEvents: number;
  totalBookings: number;
  totalPaidTransactions: number;
  totalRevenue: number;
  upcomingEvents: ExtendedEvent[];
  recentBookings: Booking[];
  lowSlotEvents: ExtendedEvent[];
}

export interface EOMetrics {
  totalEvents: number;
  totalBookings: number;
  totalPaidTransactions: number;
  totalRevenue: number;
  upcomingEvents: ExtendedEvent[];
  recentBookings: Booking[];
}

export const DashboardService = {
  getAdminMetrics(): AdminMetrics {
    const events = EventService.getAllEvents();
    const bookings = BookingService.getAllBookings();

    const activeEvents = events.filter(e => e.status === 'published');
    const paidBookings = bookings.filter(b => b.status === 'paid');

    const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    // Upcoming events sorted by date
    const sortedUpcoming = [...events]
      .filter(e => e.status === 'published' && new Date(e.startDate) >= new Date())
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    // Recent bookings sorted by id/date descending
    const sortedBookings = [...bookings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Low slots events: status published & available slots <= 5 & > 0
    // And using the real-time available slots helper!
    const lowSlots = events.filter(e => {
      if (e.status !== 'published') return false;
      const getEventAvailableSlots = require('../bookings/booking-store').getEventAvailableSlots;
      const emptySlots = getEventAvailableSlots(e);
      return emptySlots > 0 && emptySlots <= 5;
    });

    return {
      totalActiveEvents: activeEvents.length,
      totalBookings: bookings.length,
      totalPaidTransactions: paidBookings.length,
      totalRevenue,
      upcomingEvents: sortedUpcoming.slice(0, 5),
      recentBookings: sortedBookings.slice(0, 5),
      lowSlotEvents: lowSlots
    };
  },

  getEOMetrics(organizerId: string): EOMetrics {
    const events = EventService.getEventsByOrganizer(organizerId);
    const allBookings = BookingService.getAllBookings();

    // Bookings for EO events
    const myEventIds = new Set(events.map(e => e.id));
    const eoBookings = allBookings.filter(b => myEventIds.has(b.eventId));
    const paidEoBookings = eoBookings.filter(b => b.status === 'paid');

    const totalRevenue = paidEoBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    const sortedUpcoming = [...events]
      .filter(e => e.status === 'published' && new Date(e.startDate) >= new Date())
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const sortedBookings = [...eoBookings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      totalEvents: events.length,
      totalBookings: eoBookings.length,
      totalPaidTransactions: paidEoBookings.length,
      totalRevenue,
      upcomingEvents: sortedUpcoming.slice(0, 5),
      recentBookings: sortedBookings.slice(0, 5)
    };
  }
};
