import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendBookingConfirmation, sendAdminNotification } from "@/lib/email";

export async function GET() {
  try {
    const bookings = await db.bookings.getAll();
    return NextResponse.json({ bookings });
  } catch {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Handle both old and new form structures
    const customerName = body.customerName || body.userDetails?.name;
    const email = body.email || body.userDetails?.email;
    const phone = body.phone || body.userDetails?.phone;
    const notes = body.notes || body.userDetails?.notes;
    const serviceId = body.serviceId;
    const date = body.date;
    const time = body.time;

    // Validation
    if (!customerName || !email || !phone || !serviceId || !date || !time) {
      return NextResponse.json(
        { error: "Alla obligatoriska fält måste fyllas i (inklusive e-post)" },
        { status: 400 }
      );
    }

    // Check if service exists
    const service = db.services.getById(serviceId);
    if (!service) {
      return NextResponse.json(
        { error: "Ogiltig tjänst vald" },
        { status: 400 }
      );
    }

    // Create booking
    const newBooking = await db.bookings.create({
      customerName,
      email: email || "",
      phone,
      notes: notes || "",
      serviceId,
      date,
      time,
    });

    // Send confirmation emails (non-blocking)
    const bookingData = { customerName, email, phone, serviceId, date, time, notes };

    const emailConfigured = Boolean(process.env.RESEND_API_KEY);
    let emailStatus: "queued" | "skipped_missing_key" = "queued";

    if (email) {
      if (!emailConfigured) {
        emailStatus = "skipped_missing_key";
        console.warn("Email service not configured (no RESEND_API_KEY), skipping confirmation email");
      } else {
        sendBookingConfirmation(bookingData).catch((err) =>
          console.error("Failed to send confirmation email:", err)
        );
      }
    }

    sendAdminNotification(bookingData).catch((err) =>
      console.error("Failed to send admin notification:", err)
    );

    return NextResponse.json({ success: true, booking: newBooking, emailStatus });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Kunde inte skapa bokning. Försök igen." },
      { status: 500 }
    );
  }
}
