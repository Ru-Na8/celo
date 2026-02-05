// Database module - Now uses file-based persistence (JSON)
// In production, replace with PostgreSQL/MySQL
// This is a SERVER-ONLY module

import { loadBookings, saveBookings } from "./file-storage";

export interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // minutes
  description: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  isVisible: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
}

// Salon information
export const salonInfo = {
  name: "Celo Salong",
  address: "Amiralsgatan 50",
  postalCode: "214 37",
  city: "Malmö",
  phone: "040-12 54 44",
  instagram: "mohammed_frisor",
  googleMapsUrl: "https://maps.google.com/?q=Amiralsgatan+50,+214+37+Malmö",
  openingHours: [
    { day: "Måndag", hours: "10–19" },
    { day: "Tisdag", hours: "10–19" },
    { day: "Onsdag", hours: "10–19" },
    { day: "Torsdag", hours: "10–19" },
    { day: "Fredag", hours: "10–19" },
    { day: "Lördag", hours: "10–19" },
    { day: "Söndag", hours: "10–15" },
  ],
};

// Services configuration
export const services: Service[] = [
  { id: "herrklippning", name: "Herrklippning", price: 350, duration: 30, description: "Professionell klippning med konsultation" },
  { id: "rakning", name: "Rakning", price: 400, duration: 45, description: "Traditionell rakning med varm handduk" },
  { id: "vip-paket", name: "VIP Paket", price: 650, duration: 75, description: "Klippning, skäggtrimning, rakning och massage" },
  { id: "skagg", name: "Skäggtrimning", price: 250, duration: 20, description: "Professionell skäggformning" },
];

// Real reviews from Google (4.6 rating, 35 reviews)
const initialReviews: Review[] = [
  { id: "1", name: "Marcus Olofsson", rating: 5, text: "Zidane tar alltid hand om mig på bästa sätt 😊👌", date: "6 månader sedan", isVisible: true },
  { id: "2", name: "I R", rating: 5, text: "Både jag och sonen klipper oss här. Snabb, noggrann bra pris samt riktigt duktiga frisörer! Rekommenderas varmt!", date: "1 år sedan", isVisible: true },
  { id: "3", name: "Maria Isaksson", rating: 5, text: "Fint bemött och väldigt nöjd med min första klippning av Mohamed.", date: "4 år sedan", isVisible: true },
  { id: "4", name: "Annika Wendt", rating: 5, text: "Alltid bra service kanon frisörer", date: "4 år sedan", isVisible: true },
  { id: "5", name: "Tomasz Rozum", rating: 4, text: "Vänlig bemött.", date: "4 år sedan", isVisible: true },
  { id: "6", name: "Jens Sjögren", rating: 5, text: "Grymma barber's", date: "3 år sedan", isVisible: true },
  { id: "7", name: "Fabio Alves", rating: 5, text: "Bra service. Swish accepteras.", date: "5 år sedan", isVisible: true },
  { id: "8", name: "Hassan Amiri", rating: 5, text: "", date: "2 månader sedan", isVisible: true },
  { id: "9", name: "Eric Wennerlund", rating: 5, text: "", date: "5 månader sedan", isVisible: true },
  { id: "10", name: "Josef Sandkvist", rating: 5, text: "", date: "11 månader sedan", isVisible: true },
  { id: "11", name: "Ojösso", rating: 4, text: "", date: "1 år sedan", isVisible: true },
  { id: "12", name: "Ali Alansari", rating: 5, text: "", date: "1 år sedan", isVisible: true },
  { id: "13", name: "Rawan Nayef", rating: 5, text: "", date: "1 år sedan", isVisible: true },
  { id: "14", name: "Ahmad Asaad", rating: 5, text: "", date: "1 år sedan", isVisible: true },
  { id: "15", name: "Husseinv3", rating: 5, text: "", date: "1 år sedan", isVisible: true },
  { id: "16", name: "Paulius Janušonis", rating: 5, text: "", date: "2 år sedan", isVisible: true },
  { id: "17", name: "Thimpan _", rating: 4, text: "", date: "2 år sedan", isVisible: true },
  { id: "18", name: "Mohammed Jabar", rating: 5, text: "", date: "2 år sedan", isVisible: true },
  { id: "19", name: "fuat farizi", rating: 5, text: "", date: "3 år sedan", isVisible: true },
  { id: "20", name: "obadah alnahhas", rating: 4, text: "", date: "3 år sedan", isVisible: true },
  { id: "21", name: "Jörgen Johansson", rating: 5, text: "", date: "4 år sedan", isVisible: true },
  { id: "22", name: "Ahmad Rahal", rating: 5, text: "", date: "5 år sedan", isVisible: true },
  { id: "23", name: "Angelo Vajda", rating: 5, text: "", date: "5 år sedan", isVisible: true },
  { id: "24", name: "Sebastian Aggebrandt Söderberg", rating: 5, text: "", date: "5 år sedan", isVisible: true },
  { id: "25", name: "MUSTAFA MAHMOUD", rating: 5, text: "", date: "5 år sedan", isVisible: true },
  { id: "26", name: "casper christensen", rating: 4, text: "", date: "5 år sedan", isVisible: true },
  { id: "27", name: "Mohammed Ali", rating: 5, text: "", date: "5 år sedan", isVisible: true },
  { id: "28", name: "Rahmatullah Ahmadi", rating: 5, text: "", date: "5 år sedan", isVisible: true },
  { id: "29", name: "Henrietta Dömötör (Pili)", rating: 5, text: "", date: "6 år sedan", isVisible: true },
  { id: "30", name: "Hast Fatah", rating: 5, text: "", date: "6 år sedan", isVisible: true },
  { id: "31", name: "Hasan Shkeer", rating: 5, text: "", date: "7 år sedan", isVisible: true },
];

// In-memory storage (now persisted to file)
let bookings: Booking[] = [];
let reviews: Review[] = [...initialReviews];
let initialized = false;

async function initializeBookings() {
  if (!initialized) {
    try {
      const loaded = await loadBookings();
      bookings = loaded;
    } catch (error) {
      // File doesn't exist yet, keep empty array
      bookings = [];
    }
    initialized = true;
  }
}

async function persistBookings() {
  try {
    await saveBookings(bookings);
  } catch (error) {
    console.error("Failed to persist bookings:", error);
  }
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Database operations
export const db = {
  // Bookings
  bookings: {
    getAll: async (): Promise<Booking[]> => {
      await initializeBookings();
      return [...bookings].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },

    getById: async (id: string): Promise<Booking | null> => {
      await initializeBookings();
      return bookings.find(b => b.id === id) || null;
    },

    getByDate: async (date: string): Promise<Booking[]> => {
      await initializeBookings();
      return bookings.filter(b => b.date === date && b.status !== "cancelled");
    },

    getByDateRange: async (startDate: string, endDate: string): Promise<Booking[]> => {
      await initializeBookings();
      return bookings.filter(b =>
        b.date >= startDate && b.date <= endDate
      );
    },

    create: async (data: Omit<Booking, "id" | "createdAt" | "updatedAt" | "status">): Promise<Booking> => {
      await initializeBookings();
      const now = new Date().toISOString();
      const booking: Booking = {
        ...data,
        id: generateId(),
        status: "pending",
        createdAt: now,
        updatedAt: now,
      };
      bookings.push(booking);
      await persistBookings();
      return booking;
    },

    update: async (id: string, data: Partial<Booking>): Promise<Booking | null> => {
      await initializeBookings();
      const index = bookings.findIndex(b => b.id === id);
      if (index === -1) return null;

      bookings[index] = {
        ...bookings[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      await persistBookings();
      return bookings[index];
    },

    delete: async (id: string): Promise<boolean> => {
      await initializeBookings();
      const initialLength = bookings.length;
      bookings = bookings.filter(b => b.id !== id);
      if (bookings.length < initialLength) {
        await persistBookings();
        return true;
      }
      return false;
    },

    getStats: async () => {
      await initializeBookings();
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const thisMonth = today.slice(0, 7);

      const todayBookings = bookings.filter(b => b.date === today);
      const monthBookings = bookings.filter(b => b.date.startsWith(thisMonth));

      const completedMonth = monthBookings.filter(b => b.status === "completed");
      const revenue = completedMonth.reduce((sum, b) => {
        const service = services.find(s => s.id === b.serviceId);
        return sum + (service?.price || 0);
      }, 0);

      return {
        todayCount: todayBookings.length,
        monthCount: monthBookings.length,
        pendingCount: bookings.filter(b => b.status === "pending").length,
        completedCount: bookings.filter(b => b.status === "completed").length,
        monthRevenue: revenue,
        totalBookings: bookings.length,
      };
    },
  },

  // Reviews
  reviews: {
    getAll: (): Review[] => {
      return [...reviews];
    },

    getVisible: (): Review[] => {
      return reviews.filter(r => r.isVisible);
    },

    getWithText: (): Review[] => {
      return reviews.filter(r => r.isVisible && r.text.length > 0);
    },

    update: (id: string, data: Partial<Review>): Review | null => {
      const index = reviews.findIndex(r => r.id === id);
      if (index === -1) return null;
      reviews[index] = { ...reviews[index], ...data };
      return reviews[index];
    },

    getStats: () => {
      const visible = reviews.filter(r => r.isVisible);
      const totalRating = visible.reduce((sum, r) => sum + r.rating, 0);
      return {
        count: visible.length,
        average: visible.length > 0 ? totalRating / visible.length : 0,
      };
    },
  },

  // Services
  services: {
    getAll: (): Service[] => services,
    getById: (id: string): Service | null => services.find(s => s.id === id) || null,
  },
};
