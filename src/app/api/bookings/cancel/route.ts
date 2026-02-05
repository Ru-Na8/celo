import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, phone } = body;

    if (!id || !phone) {
      return NextResponse.json(
        { error: "Boknings-ID och telefonnummer krävs" },
        { status: 400 }
      );
    }

    // Find the booking
    const booking = db.bookings.getById(id);

    if (!booking) {
      return NextResponse.json(
        { error: "Bokning hittades inte" },
        { status: 404 }
      );
    }

    // Verify phone number matches (simple security)
    const normalizePhone = (p: string) => p.replace(/[^0-9]/g, "");
    if (normalizePhone(booking.phone) !== normalizePhone(phone)) {
      return NextResponse.json(
        { error: "Telefonnummer matchar inte bokningen" },
        { status: 403 }
      );
    }

    // Check if already cancelled
    if (booking.status === "cancelled") {
      return NextResponse.json(
        { error: "Bokningen är redan avbokad" },
        { status: 400 }
      );
    }

    // Check if booking is in the past
    const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
    if (bookingDateTime < new Date()) {
      return NextResponse.json(
        { error: "Kan inte avboka en tid som redan passerat" },
        { status: 400 }
      );
    }

    // Cancel the booking
    const updated = db.bookings.update(id, { status: "cancelled" });

    if (!updated) {
      return NextResponse.json(
        { error: "Kunde inte avboka. Försök igen." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json(
      { error: "Något gick fel. Försök igen." },
      { status: 500 }
    );
  }
}
