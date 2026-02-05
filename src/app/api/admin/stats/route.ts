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
    const bookings = await db.bookings.getAll();
    const bookingStats = await db.bookings.getStats();
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

    // Calculate service distribution
    const serviceDistribution = services.map((service) => {
      const count = bookings.filter(
        (b) => b.serviceId === service.id && b.status !== "cancelled"
      ).length;
      return {
        name: service.name,
        value: count,
        color: service.id === "herrklippning" ? "#D4AF37" :
               service.id === "rakning" ? "#10B981" :
               service.id === "vip-paket" ? "#8B5CF6" : "#3B82F6",
      };
    });

    // Calculate status distribution
    const statusDistribution = [
      { name: "Väntande", value: bookings.filter((b) => b.status === "pending").length, color: "#F59E0B" },
      { name: "Bekräftade", value: bookings.filter((b) => b.status === "confirmed").length, color: "#10B981" },
      { name: "Klara", value: bookings.filter((b) => b.status === "completed").length, color: "#3B82F6" },
      { name: "Avbokade", value: bookings.filter((b) => b.status === "cancelled").length, color: "#EF4444" },
    ];

    // Calculate weekly booking count (last 7 days)
    const bookingsPerDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const count = bookings.filter((b) => b.date === dateStr && b.status !== "cancelled").length;
      bookingsPerDay.push({
        name: dayNames[date.getDay()],
        date: dateStr,
        count,
      });
    }

    // Calculate confirmed revenue (only confirmed + completed)
    const confirmedRevenue = bookings
      .filter((b) => b.status === "confirmed" || b.status === "completed")
      .reduce((sum, b) => {
        const service = services.find((s) => s.id === b.serviceId);
        return sum + (service?.price || 0);
      }, 0);

    // Calculate month-over-month changes (mock for now since we don't have historical data)
    const changePercent = (current: number) => {
      // In production, compare with last month's data
      return Math.floor(Math.random() * 20) - 5;
    };

    return NextResponse.json({
      kpis: {
        revenue: { value: confirmedRevenue, change: changePercent(confirmedRevenue) },
        bookings: { value: bookingStats.monthCount, change: changePercent(bookingStats.monthCount) },
        pending: { value: bookingStats.pendingCount, change: changePercent(bookingStats.pendingCount) },
        rating: { value: reviewStats.average.toFixed(1), change: 0 },
      },
      revenueData,
      recentBookings,
      serviceDistribution,
      statusDistribution,
      bookingsPerDay,
      stats: {
        totalBookings: bookingStats.totalBookings,
        todayBookings: bookingStats.todayCount,
        reviewCount: reviewStats.count,
        reviewAverage: reviewStats.average.toFixed(1),
        confirmedRevenue,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
