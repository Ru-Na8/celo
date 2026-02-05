"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Booking type for detail modal
interface BookingDetail {
  id: string;
  name: string;
  service: string;
  date: string;
  time: string;
  amount: number;
  status: string;
}

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
  serviceDistribution: { name: string; value: number; color: string }[];
  statusDistribution: { name: string; value: number; color: string }[];
  bookingsPerDay: { name: string; date: string; count: number }[];
  stats: {
    totalBookings: number;
    todayBookings: number;
    reviewCount: number;
    reviewAverage: string;
    confirmedRevenue: number;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [hoveredBooking, setHoveredBooking] = useState<string | null>(null);
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

  // Booking actions
  const updateBookingStatus = async (id: string, status: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        await fetchStats();
        setSelectedBooking(null);
      }
    } catch {
      setError("Kunde inte uppdatera status");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Är du säker på att du vill ta bort denna bokning permanent?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchStats();
        setSelectedBooking(null);
      }
    } catch {
      setError("Kunde inte ta bort bokning");
    } finally {
      setActionLoading(false);
    }
  };

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

  const { kpis, revenueData, recentBookings, serviceDistribution, statusDistribution, bookingsPerDay, stats } = data;

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
        <KpiCard title="Intäkter (bekräftade)" value={`${kpis.revenue.value.toLocaleString()} kr`} change={kpis.revenue.change} icon="💰" />
        <KpiCard title="Bokningar (månad)" value={kpis.bookings.value.toString()} change={kpis.bookings.change} icon="📅" />
        <KpiCard title="Väntande" value={kpis.pending.value.toString()} change={kpis.pending.change} icon="⏳" />
        <KpiCard title="Google Betyg" value={`${kpis.rating.value} ⭐`} change={kpis.rating.change} icon="⭐" />
      </div>

      {/* Charts Row 1: Revenue and Recent Bookings */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        {/* Revenue Chart */}
        <div style={{ backgroundColor: "#1B2838", borderRadius: "16px", padding: "24px" }}>
          <h3 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600, marginBottom: "24px" }}>
            Intäkter per dag (bekräftade)
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

        {/* Bookings per Day Chart */}
        <div style={{ backgroundColor: "#1B2838", borderRadius: "16px", padding: "24px" }}>
          <h3 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600, marginBottom: "24px" }}>
            Bokningar per dag
          </h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "200px" }}>
            {bookingsPerDay.map((day, i) => {
              const maxCount = Math.max(...bookingsPerDay.map((d) => d.count), 1);
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#10B981", fontSize: "12px", fontWeight: 600 }}>{day.count}</span>
                  <div
                    style={{
                      width: "100%",
                      height: `${Math.max((day.count / maxCount) * 140, 4)}px`,
                      backgroundColor: day.count > 0 ? "#10B981" : "rgba(255,255,255,0.1)",
                      borderRadius: "4px 4px 0 0",
                      transition: "height 0.3s",
                    }}
                  />
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>{day.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Service Distribution and Status Distribution */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        {/* Service Distribution */}
        <div style={{ backgroundColor: "#1B2838", borderRadius: "16px", padding: "24px" }}>
          <h3 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600, marginBottom: "24px" }}>
            Tjänstfördelning
          </h3>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            {/* Mini bar chart */}
            <div style={{ flex: 1 }}>
              {serviceDistribution.map((service, i) => {
                const total = serviceDistribution.reduce((sum, s) => sum + s.value, 0);
                const percentage = total > 0 ? (service.value / total) * 100 : 0;
                return (
                  <div key={i} style={{ marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>{service.name}</span>
                      <span style={{ color: service.color, fontSize: "13px", fontWeight: 600 }}>{service.value}</span>
                    </div>
                    <div style={{ height: "8px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${percentage}%`,
                          backgroundColor: service.color,
                          borderRadius: "4px",
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div style={{ backgroundColor: "#1B2838", borderRadius: "16px", padding: "24px" }}>
          <h3 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600, marginBottom: "24px" }}>
            Bokningsstatus
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {statusDistribution.map((status, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                  padding: "16px",
                  border: `1px solid ${status.color}20`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: status.color,
                    }}
                  />
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>{status.name}</span>
                </div>
                <div style={{ color: status.color, fontSize: "1.5rem", fontWeight: "bold" }}>{status.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div style={{ backgroundColor: "#1B2838", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 600 }}>
            Senaste Bokningar
          </h3>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
            Klicka för detaljer
          </span>
        </div>
        {recentBookings.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "40px 0" }}>
            Inga bokningar än
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
            {recentBookings.slice(0, 6).map((booking) => (
              <div
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                onMouseEnter={() => setHoveredBooking(booking.id)}
                onMouseLeave={() => setHoveredBooking(null)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  backgroundColor: hoveredBooking === booking.id ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.03)",
                  borderRadius: "10px",
                  border: hoveredBooking === booking.id ? "1px solid rgba(212,175,55,0.3)" : "1px solid rgba(255,255,255,0.05)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  transform: hoveredBooking === booking.id ? "translateY(-2px)" : "none",
                }}
              >
                <div>
                  <div style={{ color: "#fff", fontWeight: 500 }}>{booking.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
                    {booking.service} • {booking.date} kl. {booking.time}
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
        {recentBookings.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <button
              onClick={() => router.push("/admin/bookings")}
              style={{
                background: "none",
                border: "1px solid rgba(212,175,55,0.3)",
                color: "#D4AF37",
                padding: "8px 20px",
                borderRadius: "8px",
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(212,175,55,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Visa alla bokningar →
            </button>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={(e) => e.target === e.currentTarget && setSelectedBooking(null)}
        >
          <div
            style={{
              backgroundColor: "#1B2838",
              borderRadius: "16px",
              padding: "32px",
              width: "100%",
              maxWidth: "450px",
              animation: "fadeIn 0.2s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
                  {selectedBooking.name}
                </h2>
                <StatusBadge status={selectedBooking.status} />
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "24px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* Booking Details */}
            <div style={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
              <DetailRow label="Tjänst" value={selectedBooking.service} />
              <DetailRow label="Datum" value={selectedBooking.date} />
              <DetailRow label="Tid" value={selectedBooking.time} />
              <DetailRow label="Pris" value={`${selectedBooking.amount} kr`} highlight />
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: "16px" }}>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Snabbåtgärder
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {selectedBooking.status === "pending" && (
                  <ActionButton
                    onClick={() => updateBookingStatus(selectedBooking.id, "confirmed")}
                    loading={actionLoading}
                    icon="✓"
                    label="Bekräfta bokning"
                    color="#10B981"
                  />
                )}
                {selectedBooking.status === "confirmed" && (
                  <ActionButton
                    onClick={() => updateBookingStatus(selectedBooking.id, "completed")}
                    loading={actionLoading}
                    icon="✓✓"
                    label="Markera som klar"
                    color="#3B82F6"
                  />
                )}
                {(selectedBooking.status === "pending" || selectedBooking.status === "confirmed") && (
                  <ActionButton
                    onClick={() => updateBookingStatus(selectedBooking.id, "cancelled")}
                    loading={actionLoading}
                    icon="✕"
                    label="Avboka"
                    color="#F59E0B"
                  />
                )}
                <ActionButton
                  onClick={() => deleteBooking(selectedBooking.id)}
                  loading={actionLoading}
                  icon="🗑"
                  label="Ta bort permanent"
                  color="#EF4444"
                  danger
                />
              </div>
            </div>

            {/* Go to bookings page */}
            <button
              onClick={() => {
                setSelectedBooking(null);
                router.push("/admin/bookings");
              }}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "transparent",
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Gå till bokningar →
            </button>
          </div>
        </div>
      )}

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
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#1B2838",
        borderRadius: "16px",
        padding: "24px",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 8px 30px rgba(212,175,55,0.15)" : "none",
        border: hovered ? "1px solid rgba(212,175,55,0.2)" : "1px solid transparent",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>{title}</span>
        <span style={{ fontSize: "24px", transition: "transform 0.2s", transform: hovered ? "scale(1.1)" : "none" }}>{icon}</span>
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

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>{label}</span>
      <span style={{ color: highlight ? "#D4AF37" : "#fff", fontWeight: highlight ? 600 : 400, fontSize: "14px" }}>{value}</span>
    </div>
  );
}

function ActionButton({ onClick, loading, icon, label, color, danger }: {
  onClick: () => void;
  loading: boolean;
  icon: string;
  label: string;
  color: string;
  danger?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        width: "100%",
        padding: "12px 16px",
        backgroundColor: hovered ? `${color}20` : `${color}10`,
        border: danger ? `1px solid ${color}40` : "none",
        borderRadius: "10px",
        color: color,
        fontSize: "14px",
        fontWeight: 500,
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.5 : 1,
        transition: "all 0.2s",
        textAlign: "left",
      }}
    >
      <span style={{ fontSize: "16px" }}>{icon}</span>
      {loading ? "Laddar..." : label}
    </button>
  );
}
