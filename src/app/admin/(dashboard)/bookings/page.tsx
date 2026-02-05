"use client";

import { useState, useEffect, useMemo } from "react";

interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  date: string;
  time: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

const services = [
  { id: "herrklippning", name: "Herrklippning", price: 350, duration: 30 },
  { id: "rakning", name: "Rakning", price: 400, duration: 45 },
  { id: "vip-paket", name: "VIP Paket", price: 650, duration: 75 },
  { id: "skagg", name: "Skäggtrimning", price: 250, duration: 20 },
];

// All possible time slots (Mon-Sat: 10-19, Sun: 10-15)
const allTimeSlots = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
];

const sundayTimeSlots = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30",
];

const MAX_BOOKINGS_PER_SLOT = 2;

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [showValidationError, setShowValidationError] = useState(false);

  const [newBooking, setNewBooking] = useState({
    customerName: "",
    email: "",
    phone: "",
    serviceId: "",
    date: "",
    time: "",
    notes: "",
  });

  // Calculate available time slots based on date and existing bookings
  const availableTimeSlots = useMemo(() => {
    if (!newBooking.date) return allTimeSlots;

    const selectedDate = new Date(newBooking.date);
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    const isSunday = selectedDate.getDay() === 0;

    // Get base slots for the day
    let baseSlots = isSunday ? sundayTimeSlots : allTimeSlots;

    // If today, filter out past times (with 30 min buffer)
    if (isToday) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes() + 30;
      baseSlots = baseSlots.filter((time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const slotMinutes = hours * 60 + minutes;
        return slotMinutes > currentMinutes;
      });
    }

    return baseSlots;
  }, [newBooking.date]);

  // Count bookings per time slot for the selected date
  const slotBookingCounts = useMemo(() => {
    if (!newBooking.date) return {};

    const counts: Record<string, number> = {};
    const dateBookings = bookings.filter(
      (b) => b.date === newBooking.date && b.status !== "cancelled"
    );

    dateBookings.forEach((b) => {
      counts[b.time] = (counts[b.time] || 0) + 1;
    });

    return counts;
  }, [newBooking.date, bookings]);

  // Get truly available slots (not full)
  const selectableTimeSlots = useMemo(() => {
    return availableTimeSlots.map((time) => ({
      time,
      count: slotBookingCounts[time] || 0,
      available: (slotBookingCounts[time] || 0) < MAX_BOOKINGS_PER_SLOT,
    }));
  }, [availableTimeSlots, slotBookingCounts]);

  const fetchBookings = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (dateFilter) params.append("date", dateFilter);

      const res = await fetch(`/api/admin/bookings?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBookings(data.bookings || []);
      setError("");
    } catch {
      setError("Kunde inte hämta bokningar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, dateFilter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch {
      setError("Kunde inte uppdatera status");
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Är du säker på att du vill ta bort denna bokning?")) return;

    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch {
      setError("Kunde inte ta bort bokning");
    }
  };

  const createBooking = async () => {
    // Validate all required fields and track which are missing
    const errors: Record<string, boolean> = {};
    if (!newBooking.serviceId) errors.serviceId = true;
    if (!newBooking.date) errors.date = true;
    if (!newBooking.time) errors.time = true;
    if (!newBooking.customerName) errors.customerName = true;
    if (!newBooking.phone) errors.phone = true;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setShowValidationError(true);
      // Auto-hide after 5 seconds
      setTimeout(() => setShowValidationError(false), 5000);
      return;
    }

    setValidationErrors({});
    setShowValidationError(false);
    setIsCreating(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBooking),
      });

      if (res.ok) {
        setShowModal(false);
        setNewBooking({
          customerName: "",
          email: "",
          phone: "",
          serviceId: "",
          date: "",
          time: "",
          notes: "",
        });
        setValidationErrors({});
        fetchBookings();
      } else {
        const data = await res.json();
        setError(data.error || "Kunde inte skapa bokning");
      }
    } catch {
      setError("Kunde inte skapa bokning");
    } finally {
      setIsCreating(false);
    }
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: "rgba(245,158,11,0.15)", text: "#F59E0B" },
    confirmed: { bg: "rgba(16,185,129,0.15)", text: "#10B981" },
    completed: { bg: "rgba(59,130,246,0.15)", text: "#3B82F6" },
    cancelled: { bg: "rgba(239,68,68,0.15)", text: "#EF4444" },
  };

  const statusLabels: Record<string, string> = {
    pending: "Väntande",
    confirmed: "Bekräftad",
    completed: "Klar",
    cancelled: "Avbokad",
  };

  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "400px" }}>
        <div style={{ color: "#D4AF37", fontSize: "18px" }}>Laddar bokningar...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: "bold", marginBottom: "8px" }}>
            Bokningar
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>
            Hantera och följ upp alla bokningar
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#D4AF37",
            color: "#000",
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: "18px" }}>+</span>
          Ny Bokning
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "6px" }}>
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              backgroundColor: "#1B2838",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              padding: "10px 16px",
              fontSize: "14px",
              minWidth: "150px",
              cursor: "pointer",
            }}
          >
            <option value="all">Alla</option>
            <option value="pending">Väntande</option>
            <option value="confirmed">Bekräftade</option>
            <option value="completed">Klara</option>
            <option value="cancelled">Avbokade</option>
          </select>
        </div>

        <div>
          <label style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", display: "block", marginBottom: "6px" }}>
            Datum
          </label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              backgroundColor: "#1B2838",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              padding: "10px 16px",
              fontSize: "14px",
            }}
          />
        </div>

        {(statusFilter !== "all" || dateFilter) && (
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              onClick={() => {
                setStatusFilter("all");
                setDateFilter("");
              }}
              style={{
                backgroundColor: "transparent",
                color: "#D4AF37",
                border: "1px solid #D4AF37",
                borderRadius: "8px",
                padding: "10px 16px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Rensa filter
            </button>
          </div>
        )}
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "rgba(239,68,68,0.1)",
            color: "#EF4444",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
        >
          {error}
          <button
            onClick={() => setError("")}
            style={{ marginLeft: "12px", background: "none", border: "none", color: "#EF4444", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Bookings Table */}
      <div
        style={{
          backgroundColor: "#1B2838",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {bookings.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "16px" }}>Inga bokningar hittades</p>
            <button
              onClick={() => setShowModal(true)}
              style={{
                backgroundColor: "#D4AF37",
                color: "#000",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Skapa första bokningen
            </button>
          </div>
        ) : (
          <div style={{ 
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              minWidth: "600px",
            }}>
              <thead>
                <tr style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
                  <th style={{ ...thStyle }}>Kund</th>
                  <th style={{ ...thStyle }}>Tjänst</th>
                  <th style={{ ...thStyle }}>Datum & Tid</th>
                  <th style={{ ...thStyle }}>Status</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Pris</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Åtgärder</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <td style={{ ...tdStyle }}>
                      <div style={{ color: "#fff", fontWeight: 500 }}>{booking.customerName}</div>
                      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>{booking.phone}</div>
                      {booking.email && (
                        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>{booking.email}</div>
                      )}
                    </td>
                    <td style={{ ...tdStyle }}>
                      <div style={{ color: "#fff" }}>{booking.serviceName}</div>
                      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
                        {booking.serviceDuration} min
                      </div>
                    </td>
                    <td style={{ ...tdStyle }}>
                      <div style={{ color: "#fff" }}>{booking.date}</div>
                      <div style={{ color: "#D4AF37", fontSize: "13px", fontWeight: 500 }}>{booking.time}</div>
                    </td>
                    <td style={{ ...tdStyle }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          backgroundColor: statusColors[booking.status]?.bg,
                          color: statusColors[booking.status]?.text,
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {statusLabels[booking.status] || booking.status}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      <span style={{ color: "#D4AF37", fontWeight: 600 }}>{booking.servicePrice} kr</span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        {booking.status === "pending" && (
                          <button
                            onClick={() => updateStatus(booking.id, "confirmed")}
                            style={{
                              ...actionBtnStyle,
                              backgroundColor: "rgba(16,185,129,0.15)",
                              color: "#10B981",
                            }}
                            title="Bekräfta"
                          >
                            ✓
                          </button>
                        )}
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => updateStatus(booking.id, "completed")}
                            style={{
                              ...actionBtnStyle,
                              backgroundColor: "rgba(59,130,246,0.15)",
                              color: "#3B82F6",
                            }}
                            title="Markera som klar"
                          >
                            ✓✓
                          </button>
                        )}
                        {(booking.status === "pending" || booking.status === "confirmed") && (
                          <button
                            onClick={() => updateStatus(booking.id, "cancelled")}
                            style={{
                              ...actionBtnStyle,
                              backgroundColor: "rgba(245,158,11,0.15)",
                              color: "#F59E0B",
                            }}
                            title="Avboka"
                          >
                            ✕
                          </button>
                        )}
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          style={{
                            ...actionBtnStyle,
                            backgroundColor: "rgba(239,68,68,0.15)",
                            color: "#EF4444",
                          }}
                          title="Ta bort"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <SummaryCard label="Totalt" value={bookings.length} color="#fff" />
        <SummaryCard label="Väntande" value={bookings.filter((b) => b.status === "pending").length} color="#F59E0B" />
        <SummaryCard label="Bekräftade" value={bookings.filter((b) => b.status === "confirmed").length} color="#10B981" />
        <SummaryCard
          label="Intäkt (bekräftad)"
          value={`${bookings.filter((b) => b.status === "confirmed" || b.status === "completed").reduce((sum, b) => sum + b.servicePrice, 0)} kr`}
          color="#D4AF37"
        />
      </div>

      {/* Create Booking Modal */}
      {showModal && (
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
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "#1B2838",
              borderRadius: "16px",
              padding: "32px",
              width: "100%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>Ny Bokning</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "24px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* Validation Error Banner */}
            {showValidationError && (
              <div
                style={{
                  backgroundColor: "rgba(239,68,68,0.15)",
                  border: "2px solid #EF4444",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  animation: "shake 0.5s ease",
                }}
              >
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#EF4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  flexShrink: 0,
                }}>
                  ⚠️
                </div>
                <div>
                  <div style={{ color: "#EF4444", fontWeight: 600, fontSize: "14px" }}>
                    Fyll i alla obligatoriska fält
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px", marginTop: "2px" }}>
                    Markerade fält måste fyllas i
                  </div>
                </div>
                <button
                  onClick={() => setShowValidationError(false)}
                  style={{
                    marginLeft: "auto",
                    background: "none",
                    border: "none",
                    color: "#EF4444",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Service */}
              <div>
                <label style={{
                  color: validationErrors.serviceId ? "#EF4444" : "rgba(255,255,255,0.8)",
                  fontSize: "14px",
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: validationErrors.serviceId ? 600 : 400,
                }}>
                  Tjänst * {validationErrors.serviceId && <span style={{ color: "#EF4444" }}>— Obligatoriskt</span>}
                </label>
                <select
                  value={newBooking.serviceId}
                  onChange={(e) => {
                    setNewBooking({ ...newBooking, serviceId: e.target.value });
                    if (validationErrors.serviceId) setValidationErrors(prev => ({ ...prev, serviceId: false }));
                  }}
                  onFocus={() => setFocusedField("serviceId")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: focusedField === "serviceId" ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.05)",
                    border: validationErrors.serviceId ? "2px solid #EF4444" : focusedField === "serviceId" ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxShadow: focusedField === "serviceId" ? "0 0 0 3px rgba(212,175,55,0.2)" : "none",
                  }}
                >
                  <option value="">Välj tjänst...</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - {s.price} kr ({s.duration} min)
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{
                    color: validationErrors.date ? "#EF4444" : "rgba(255,255,255,0.8)",
                    fontSize: "14px",
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: validationErrors.date ? 600 : 400,
                  }}>
                    Datum * {validationErrors.date && <span style={{ color: "#EF4444" }}>— Obligatoriskt</span>}
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={newBooking.date}
                    onChange={(e) => {
                      setNewBooking({ ...newBooking, date: e.target.value, time: "" });
                      if (validationErrors.date) setValidationErrors(prev => ({ ...prev, date: false }));
                    }}
                    onFocus={() => setFocusedField("date")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      backgroundColor: focusedField === "date" ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.05)",
                      border: validationErrors.date ? "2px solid #EF4444" : focusedField === "date" ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "14px",
                      outline: "none",
                      transition: "all 0.2s ease",
                      boxShadow: focusedField === "date" ? "0 0 0 3px rgba(212,175,55,0.2)" : "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    color: validationErrors.time ? "#EF4444" : "rgba(255,255,255,0.8)",
                    fontSize: "14px",
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: validationErrors.time ? 600 : 400,
                  }}>
                    Tid * {validationErrors.time && <span style={{ color: "#EF4444" }}>— Obligatoriskt</span>}
                  </label>
                  <select
                    value={newBooking.time}
                    onChange={(e) => {
                      setNewBooking({ ...newBooking, time: e.target.value });
                      if (validationErrors.time) setValidationErrors(prev => ({ ...prev, time: false }));
                    }}
                    onFocus={() => setFocusedField("time")}
                    onBlur={() => setFocusedField(null)}
                    disabled={!newBooking.date}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      backgroundColor: focusedField === "time" ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.05)",
                      border: validationErrors.time ? "2px solid #EF4444" : focusedField === "time" ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "14px",
                      opacity: !newBooking.date ? 0.5 : 1,
                      outline: "none",
                      transition: "all 0.2s ease",
                      boxShadow: focusedField === "time" ? "0 0 0 3px rgba(212,175,55,0.2)" : "none",
                    }}
                  >
                    <option value="">{newBooking.date ? "Välj tid..." : "Välj datum först"}</option>
                    {selectableTimeSlots.map(({ time, count, available }) => (
                      <option
                        key={time}
                        value={time}
                        disabled={!available}
                      >
                        {time} {count > 0 ? `(${count}/${MAX_BOOKINGS_PER_SLOT} bokade)` : ""} {!available ? "- FULL" : ""}
                      </option>
                    ))}
                  </select>
                  {newBooking.date && selectableTimeSlots.length === 0 && (
                    <p style={{ color: "#F59E0B", fontSize: "12px", marginTop: "6px" }}>
                      Inga tillgängliga tider för detta datum
                    </p>
                  )}
                  {newBooking.date && selectableTimeSlots.every(s => !s.available) && selectableTimeSlots.length > 0 && (
                    <p style={{ color: "#EF4444", fontSize: "12px", marginTop: "6px" }}>
                      Alla tider är fullbokade för detta datum
                    </p>
                  )}
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label style={{
                  color: validationErrors.customerName ? "#EF4444" : "rgba(255,255,255,0.8)",
                  fontSize: "14px",
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: validationErrors.customerName ? 600 : 400,
                }}>
                  Kundnamn * {validationErrors.customerName && <span style={{ color: "#EF4444" }}>— Obligatoriskt</span>}
                </label>
                <input
                  type="text"
                  value={newBooking.customerName}
                  onChange={(e) => {
                    setNewBooking({ ...newBooking, customerName: e.target.value });
                    if (validationErrors.customerName) setValidationErrors(prev => ({ ...prev, customerName: false }));
                  }}
                  onFocus={() => setFocusedField("customerName")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Kundens namn"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: focusedField === "customerName" ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.05)",
                    border: validationErrors.customerName ? "2px solid #EF4444" : focusedField === "customerName" ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxShadow: focusedField === "customerName" ? "0 0 0 3px rgba(212,175,55,0.2)" : "none",
                  }}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={{
                  color: validationErrors.phone ? "#EF4444" : "rgba(255,255,255,0.8)",
                  fontSize: "14px",
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: validationErrors.phone ? 600 : 400,
                }}>
                  Telefon * {validationErrors.phone && <span style={{ color: "#EF4444" }}>— Obligatoriskt</span>}
                </label>
                <input
                  type="tel"
                  value={newBooking.phone}
                  onChange={(e) => {
                    setNewBooking({ ...newBooking, phone: e.target.value });
                    if (validationErrors.phone) setValidationErrors(prev => ({ ...prev, phone: false }));
                  }}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="070-123 45 67"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: focusedField === "phone" ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.05)",
                    border: validationErrors.phone ? "2px solid #EF4444" : focusedField === "phone" ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxShadow: focusedField === "phone" ? "0 0 0 3px rgba(212,175,55,0.2)" : "none",
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", display: "block", marginBottom: "6px" }}>
                  E-post (valfritt)
                </label>
                <input
                  type="email"
                  value={newBooking.email}
                  onChange={(e) => setNewBooking({ ...newBooking, email: e.target.value })}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="kund@email.com"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: focusedField === "email" ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.05)",
                    border: focusedField === "email" ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxShadow: focusedField === "email" ? "0 0 0 3px rgba(212,175,55,0.2)" : "none",
                  }}
                />
              </div>

              {/* Notes */}
              <div>
                <label style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", display: "block", marginBottom: "6px" }}>
                  Anteckningar (valfritt)
                </label>
                <textarea
                  value={newBooking.notes}
                  onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                  onFocus={() => setFocusedField("notes")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Eventuella anteckningar..."
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    backgroundColor: focusedField === "notes" ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.05)",
                    border: focusedField === "notes" ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "14px",
                    resize: "vertical",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxShadow: focusedField === "notes" ? "0 0 0 3px rgba(212,175,55,0.2)" : "none",
                  }}
                />
              </div>
            </div>

            {/* Shake animation style */}
            <style>{`
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
              }
            `}</style>

            {/* Actions */}
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "14px",
                  backgroundColor: "transparent",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "10px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Avbryt
              </button>
              <button
                onClick={createBooking}
                disabled={isCreating}
                style={{
                  flex: 2,
                  padding: "14px",
                  backgroundColor: isCreating ? "rgba(212,175,55,0.5)" : "#D4AF37",
                  color: "#000",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 600,
                  cursor: isCreating ? "not-allowed" : "pointer",
                }}
              >
                {isCreating ? "Skapar..." : "Skapa Bokning"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "16px",
  textAlign: "left",
  color: "rgba(255,255,255,0.5)",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const tdStyle: React.CSSProperties = {
  padding: "16px",
  verticalAlign: "middle",
};

const actionBtnStyle: React.CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
};

function SummaryCard({ label, value, color }: { label: string; value: number | string; color: string }) {
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
      <div style={{ color, fontSize: "1.25rem", fontWeight: "bold" }}>{value}</div>
    </div>
  );
}
