"use server";

import { promises as fs } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), ".data");
const BOOKINGS_FILE = join(DATA_DIR, "bookings.json");

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory already exists or permission error
  }
}

// Generic booking type for file storage - matches db.ts Booking interface
export interface StoredBooking {
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

export async function loadBookings(): Promise<StoredBooking[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(BOOKINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    // File doesn't exist yet, return empty array
    return [];
  }
}

export async function saveBookings(bookings: StoredBooking[]): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save bookings:", err);
    throw err;
  }
}

export async function exportToCSV(bookings: StoredBooking[]): Promise<string> {
  const headers = ["ID", "Name", "Email", "Phone", "Service", "Date", "Time", "Status", "Notes", "Created"];
  const rows = bookings.map((b) => [
    b.id,
    b.customerName,
    b.email,
    b.phone,
    b.serviceId,
    b.date,
    b.time,
    b.status,
    b.notes || "",
    b.createdAt,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
  ].join("\n");

  return csvContent;
}
