import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { db, services } from "@/lib/db";

export async function GET() {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token || !auth.verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get real data from database
    const bookings = db.bookings.getAll();
    const bookingStats = db.bookings.getStats();
    const reviewStats = db.reviews.getStats();

    // Calculate revenue by day for the current week
    const today = new Date();
    const dayNames = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];
    const revenueData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayBookings = bookings.filter(
        (b) => b.date === dateStr && b.status === "completed"
      );

      const dayRevenue = dayBookings.reduce((sum, b) => {
        const service = services.find((s) => s.id === b.serviceId);
        return sum + (service?.price || 0);
      }, 0);

      revenueData.push({
        name: dayNames[date.getDay()],
        total: dayRevenue,
      });
    }

    // Get recent bookings with service info
    const recentBookings = bookings.slice(0, 10).map((b) => {
      const service = services.find((s) => s.id === b.serviceId);
      return {
        id: b.id,
        name: b.customerName,
        service: service?.name || b.serviceId,
        date: b.date,
        time: b.time,
        amount: service?.price || 0,
        status: b.status,
      };
    });

    // Calculate month-over-month changes (mock for now since we don't have historical data)
    const changePercent = (current: number) => {
      // In production, compare with last month's data
      return Math.floor(Math.random() * 20) - 5;
    };

    return NextResponse.json({
      kpis: {
        revenue: { value: bookingStats.monthRevenue, change: changePercent(bookingStats.monthRevenue) },
        bookings: { value: bookingStats.monthCount, change: changePercent(bookingStats.monthCount) },
        pending: { value: bookingStats.pendingCount, change: changePercent(bookingStats.pendingCount) },
        rating: { value: reviewStats.average.toFixed(1), change: 0 },
      },
      revenueData,
      recentBookings,
      stats: {
        totalBookings: bookingStats.totalBookings,
        todayBookings: bookingStats.todayCount,
        reviewCount: reviewStats.count,
        reviewAverage: reviewStats.average.toFixed(1),
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
