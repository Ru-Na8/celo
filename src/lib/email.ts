import { Resend } from "resend";
import { salonInfo, services } from "./db";

// Get Resend client - returns null if no API key configured
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

interface BookingEmailData {
  customerName: string;
  email: string;
  phone: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
}

export async function sendBookingConfirmation(booking: BookingEmailData) {
  const resend = getResendClient();
  if (!resend) {
    console.log("Email service not configured (no RESEND_API_KEY), skipping confirmation email");
    return { success: true, skipped: true };
  }

  const service = services.find((s) => s.id === booking.serviceId);
  const serviceName = service?.name || booking.serviceId;
  const servicePrice = service?.price || 0;

  // Format date for Swedish locale
  const formattedDate = new Date(booking.date).toLocaleDateString("sv-SE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    const { data, error } = await resend.emails.send({
      from: `Celo Salong <noreply@${process.env.RESEND_DOMAIN || "resend.dev"}>`,
      to: booking.email,
      subject: `Bokningsbekräftelse - ${serviceName} ${booking.date}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0D1B2A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #1B2838;">
    <!-- Header -->
    <tr>
      <td style="padding: 40px 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #D4AF37 0%, #F0DEAA 100%); border-radius: 16px; line-height: 60px; font-size: 28px;">
          ✂️
        </div>
        <h1 style="color: #fff; font-size: 28px; margin: 16px 0 0; font-weight: bold;">Celo Salong</h1>
      </td>
    </tr>

    <!-- Main Content -->
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #10B981; font-size: 24px; margin: 0 0 8px; text-align: center;">
          ✓ Bokning Bekräftad
        </h2>
        <p style="color: rgba(255,255,255,0.7); text-align: center; margin: 0 0 32px;">
          Tack för din bokning, ${booking.customerName}!
        </p>

        <!-- Booking Details Box -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="color: rgba(255,255,255,0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Tjänst</div>
                    <div style="color: #fff; font-size: 18px; font-weight: 600;">${serviceName}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="color: rgba(255,255,255,0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Datum & Tid</div>
                    <div style="color: #fff; font-size: 18px; font-weight: 600;">${formattedDate}</div>
                    <div style="color: #D4AF37; font-size: 24px; font-weight: bold; margin-top: 4px;">kl. ${booking.time}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 16px;">
                    <div style="color: rgba(255,255,255,0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Pris</div>
                    <div style="color: #D4AF37; font-size: 24px; font-weight: bold;">${servicePrice} kr</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Location Info -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(212,175,55,0.1); border-radius: 12px; border: 1px solid rgba(212,175,55,0.2);">
          <tr>
            <td style="padding: 20px;">
              <div style="color: #D4AF37; font-size: 14px; font-weight: 600; margin-bottom: 12px;">📍 Hitta hit</div>
              <div style="color: #fff; font-size: 16px; margin-bottom: 4px;">${salonInfo.address}</div>
              <div style="color: rgba(255,255,255,0.6); font-size: 14px;">${salonInfo.postalCode} ${salonInfo.city}</div>
              <div style="margin-top: 12px;">
                <a href="${salonInfo.googleMapsUrl}" style="color: #D4AF37; text-decoration: none; font-size: 14px;">Öppna i Google Maps →</a>
              </div>
            </td>
          </tr>
        </table>

        <!-- Contact Info -->
        <p style="color: rgba(255,255,255,0.6); font-size: 14px; text-align: center; margin: 32px 0 0;">
          Behöver du ändra eller avboka? Kontakta oss på<br>
          <a href="tel:+46${salonInfo.phone.replace(/^0/, "").replace(/[- ]/g, "")}" style="color: #D4AF37; text-decoration: none;">${salonInfo.phone}</a>
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 24px 30px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center;">
        <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} Celo Salong | ${salonInfo.address}, ${salonInfo.city}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email service error:", error);
    return { success: false, error };
  }
}

// Send notification to admin when new booking is created
export async function sendAdminNotification(booking: BookingEmailData) {
  const resend = getResendClient();
  if (!resend) {
    console.log("Email service not configured (no RESEND_API_KEY), skipping admin notification");
    return { success: true, skipped: true };
  }

  const service = services.find((s) => s.id === booking.serviceId);
  const serviceName = service?.name || booking.serviceId;
  const servicePrice = service?.price || 0;

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.log("No ADMIN_EMAIL set, skipping admin notification");
    return { success: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `Celo Salong <noreply@${process.env.RESEND_DOMAIN || "resend.dev"}>`,
      to: adminEmail,
      subject: `Ny bokning: ${booking.customerName} - ${serviceName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 500px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h2 style="color: #10B981; margin: 0 0 20px;">🆕 Ny Bokning</h2>

    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #666;">Kund:</td>
        <td style="padding: 8px 0; font-weight: 600;">${booking.customerName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">Telefon:</td>
        <td style="padding: 8px 0;"><a href="tel:${booking.phone}" style="color: #D4AF37;">${booking.phone}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">E-post:</td>
        <td style="padding: 8px 0;"><a href="mailto:${booking.email}" style="color: #D4AF37;">${booking.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">Tjänst:</td>
        <td style="padding: 8px 0; font-weight: 600;">${serviceName} (${servicePrice} kr)</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">Datum:</td>
        <td style="padding: 8px 0; font-weight: 600;">${booking.date}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">Tid:</td>
        <td style="padding: 8px 0; font-weight: 600; color: #D4AF37;">${booking.time}</td>
      </tr>
      ${booking.notes ? `
      <tr>
        <td style="padding: 8px 0; color: #666;">Meddelande:</td>
        <td style="padding: 8px 0;">${booking.notes}</td>
      </tr>
      ` : ""}
    </table>

    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/bookings" style="display: inline-block; background: #D4AF37; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Visa i Admin →
      </a>
    </div>
  </div>
</body>
</html>
      `,
    });

    if (error) {
      console.error("Admin notification error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Admin notification error:", error);
    return { success: false, error };
  }
}
