"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Stats {
  kpis: {
    revenue: { value: number; change: number };
    bookings: { value: number; change: number };
    pending: { value: number; change: number };
    rating: { value: string; change: number };
  };
  revenueData: { name: string; total: number }[];
  recentBookings: {
    id: string;
    name: string;
    service: string;
    date: string;
    time: string;
    amount: number;
    status: string;
  }[];
  stats: {
    totalBookings: number;
    todayBookings: number;
    reviewCount: number;
    reviewAverage: string;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
      setError("");
    } catch (err) {
      setError("Kunde inte hämta data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "400px" }}>
        <div style={{ color: "#D4AF37", fontSize: "18px" }}>Laddar...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p style={{ color: "#EF4444" }}>{error || "Något gick fel"}</p>
        <button onClick={fetchStats} style={{ marginTop: "16px", padding: "8px 16px", backgroundColor: "#D4AF37", color: "#000", border: "none", borderRadius: "8px", cursor: "pointer" }}>
          Försök igen
        </button>
      </div>
    );
  }

  const { kpis, revenueData, recentBookings, stats } = data;

  // Calculate max revenue for chart scaling
  const maxRevenue = Math.max(...revenueData.map((d) => d.total), 1);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: "bold", marginBottom: "8px" }}>
          Dashboard
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>
          Välkommen! Här är en översikt över din verksamhet.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <KpiCard title="Intäkter (månad)" value={`${kpis.revenue.value.toLocaleString()} kr`} change={kpis.revenue.change} icon="💰" />
        <KpiCard title="Bokningar (månad)" value={kpis.bookings.value.toString()} change={kpis.bookings.change} icon="📅" />
        <KpiCard title="Väntande" value={kpis.pending.value.toString()} change={kpis.pending.change} icon="⏳" />
        <KpiCard title="Google Betyg" value={`${kpis.rating.value} ⭐`} change={kpis.rating.change} icon="⭐" />
      </div>

      {/* Charts and Recent */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Revenue Chart */}
        <div style={{ backgroundColor: "#1B2838", borderRadius: "16px", padding: "24px" }}>
          <h3 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600, marginBottom: "24px" }}>
            Intäkter per dag
          </h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "200px" }}>
            {revenueData.map((day, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "100%",
                    height: `${Math.max((day.total / maxRevenue) * 160, 4)}px`,
                    backgroundColor: day.total > 0 ? "#D4AF37" : "rgba(255,255,255,0.1)",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.3s",
                  }}
                />
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>{day.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div style={{ backgroundColor: "#1B2838", borderRadius: "16px", padding: "24px" }}>
          <h3 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600, marginBottom: "16px" }}>
            Senaste Bokningar
          </h3>
          {recentBookings.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "40px 0" }}>
              Inga bokningar än
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentBookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div>
                    <div style={{ color: "#fff", fontWeight: 500 }}>{booking.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
                      {booking.service} • {booking.date}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#D4AF37", fontWeight: 600 }}>{booking.amount} kr</div>
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginTop: "24px" }}>
        <QuickStat label="Totalt Bokningar" value={stats.totalBookings} />
        <QuickStat label="Idag" value={stats.todayBookings} />
        <QuickStat label="Google Recensioner" value={stats.reviewCount} />
        <QuickStat label="Snittbetyg" value={stats.reviewAverage} />
      </div>
    </div>
  );
}

function KpiCard({ title, value, change, icon }: { title: string; value: string; change: number; icon: string }) {
  return (
    <div
      style={{
        backgroundColor: "#1B2838",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>{title}</span>
        <span style={{ fontSize: "24px" }}>{icon}</span>
      </div>
      <div style={{ color: "#fff", fontSize: "1.75rem", fontWeight: "bold", marginBottom: "8px" }}>
        {value}
      </div>
      {change !== 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px" }}>
          <span style={{ color: change > 0 ? "#10B981" : "#EF4444" }}>
            {change > 0 ? "↑" : "↓"} {Math.abs(change)}%
          </span>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>vs förra månaden</span>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    pending: { bg: "rgba(245,158,11,0.15)", text: "#F59E0B" },
    confirmed: { bg: "rgba(16,185,129,0.15)", text: "#10B981" },
    completed: { bg: "rgba(59,130,246,0.15)", text: "#3B82F6" },
    cancelled: { bg: "rgba(239,68,68,0.15)", text: "#EF4444" },
  };

  const labels: Record<string, string> = {
    pending: "Väntande",
    confirmed: "Bekräftad",
    completed: "Klar",
    cancelled: "Avbokad",
  };

  const style = colors[status] || colors.pending;

  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "20px",
        backgroundColor: style.bg,
        color: style.text,
        fontSize: "11px",
        fontWeight: 600,
        textTransform: "uppercase",
      }}
    >
      {labels[status] || status}
    </span>
  );
}

function QuickStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: "12px",
        padding: "16px",
        textAlign: "center",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginBottom: "4px" }}>{label}</div>
      <div style={{ color: "#fff", fontSize: "1.25rem", fontWeight: "bold" }}>{value}</div>
    </div>
  );
}
