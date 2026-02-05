// This acts as a Singleton in-memory database for the running instance.
// In production, this would be a real database (Postgres/MySQL).

export interface Booking {
    id: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    date: string;
    time: string;
    notes?: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    amount: number;
    createdAt: string;
}

// Initial Mock Data
let bookings: Booking[] = [
    { id: "1", name: "Anna Svensson", email: "anna@example.com", phone: "0701234567", service: "Cut & Color", date: "2024-02-15", time: "10:00", amount: 2500, status: "confirmed", createdAt: new Date().toISOString() },
    { id: "2", name: "Erik Lund", email: "erik@example.com", phone: "0709876543", service: "Men's Cut", date: "2024-02-15", time: "11:30", amount: 650, status: "completed", createdAt: new Date().toISOString() },
    { id: "3", name: "Maria Karlsson", email: "maria@example.com", phone: "0705556677", service: "Balayage", date: "2024-02-16", time: "13:00", amount: 3200, status: "pending", createdAt: new Date().toISOString() },
    { id: "4", name: "Johan Berg", email: "johan@example.com", phone: "0701112233", service: "Consultation", date: "2024-02-16", time: "15:45", amount: 0, status: "cancelled", createdAt: new Date().toISOString() },
];

export const db = {
    bookings: {
        getAll: () => [...bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

        search: (query: string) => bookings.filter(b =>
            b.name.toLowerCase().includes(query.toLowerCase()) ||
            b.email.toLowerCase().includes(query.toLowerCase()) ||
            b.id.includes(query)
        ),

        create: (booking: Omit<Booking, "id" | "createdAt" | "status" | "amount">) => {
            const newBooking: Booking = {
                id: Math.random().toString(36).substr(2, 9),
                ...booking,
                status: "pending",
                amount: getEstimatedAmount(booking.service),
                createdAt: new Date().toISOString()
            };
            bookings.unshift(newBooking);
            return newBooking;
        },

        updateStatus: (id: string, status: Booking["status"]) => {
            const index = bookings.findIndex(b => b.id === id);
            if (index !== -1) {
                bookings[index] = { ...bookings[index], status };
                return bookings[index];
            }
            return null;
        },

        delete: (id: string) => {
            bookings = bookings.filter(b => b.id !== id);
        }
    }
};

function getEstimatedAmount(service: string) {
    if (service.includes("Cut")) return 850;
    if (service.includes("Color")) return 2500;
    if (service.includes("Balayage")) return 3200;
    if (service.includes("Keratin")) return 2800;
    return 0;
}
