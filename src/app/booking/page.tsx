"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const services = [
  { id: "herrklippning", name: "Herrklippning", price: 350, duration: "30 min" },
  { id: "rakning", name: "Rakning", price: 400, duration: "45 min" },
  { id: "vip-paket", name: "VIP Paket", price: 650, duration: "75 min" },
  { id: "skagg", name: "Skäggtrimning", price: 250, duration: "20 min" },
];

const allTimeSlots = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
];

function BookingContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<"queued" | "skipped_missing_key" | null>(null);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [hoveredTime, setHoveredTime] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    serviceId: "",
    date: "",
    time: "",
    customerName: "",
    email: "",
    phone: "",
    notes: "",
  });

  // Check for service in URL params
  useEffect(() => {
    const serviceParam = searchParams.get("service");
    if (serviceParam && services.some(s => s.id === serviceParam)) {
      setFormData(prev => ({ ...prev, serviceId: serviceParam }));
    }
  }, [searchParams]);

  const selectedService = services.find((s) => s.id === formData.serviceId);

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  // Filter available time slots based on selected date
  const availableTimeSlots = useMemo(() => {
    if (!formData.date) return allTimeSlots;

    const selectedDate = new Date(formData.date);
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();

    if (!isToday) return allTimeSlots;

    // Filter out past times for today (add 30 min buffer)
    const currentMinutes = now.getHours() * 60 + now.getMinutes() + 30;

    return allTimeSlots.filter((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const slotMinutes = hours * 60 + minutes;
      return slotMinutes > currentMinutes;
    });
  }, [formData.date]);

  // Clear time if it becomes unavailable when date changes
  useEffect(() => {
    if (formData.time && !availableTimeSlots.includes(formData.time)) {
      setFormData((prev) => ({ ...prev, time: "" }));
    }
  }, [availableTimeSlots, formData.time]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Något gick fel");
      }

      setBookingId(data.booking?.id || null);
      setEmailStatus(data.emailStatus || null);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0D1B2A", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ textAlign: "center", maxWidth: "500px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#10B981", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 style={{ color: "#fff", fontSize: "2rem", marginBottom: "16px", fontFamily: "var(--font-playfair), serif" }}>
            Bokning Bekräftad!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "32px", lineHeight: 1.6 }}>
            Tack för din bokning! Vi har skickat en bekräftelse till din e-post. Vi ser fram emot ditt besök.
          </p>
          {emailStatus === "skipped_missing_key" && (
            <div style={{ backgroundColor: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", color: "#F59E0B", padding: "12px 16px", borderRadius: "10px", marginBottom: "20px" }}>
              Bekräftelsemail kunde inte skickas eftersom e‑posttjänsten inte är konfigurerad. Kontakta salongen om du är osäker.
            </div>
          )}
          <div style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "12px", padding: "20px", marginBottom: "32px", textAlign: "left" }}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginBottom: "4px" }}>Tjänst</div>
            <div style={{ color: "#fff", fontWeight: 600, marginBottom: "16px" }}>{selectedService?.name}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginBottom: "4px" }}>Datum & Tid</div>
            <div style={{ color: "#fff", fontWeight: 600 }}>{formData.date} kl. {formData.time}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link
              href="/"
              style={{
                display: "inline-block",
                backgroundColor: "#D4AF37",
                color: "#000",
                padding: "14px 32px",
                borderRadius: "50px",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Tillbaka till Startsidan
            </Link>
            {bookingId && (
              <Link
                href={`/booking/cancel?id=${bookingId}&phone=${encodeURIComponent(formData.phone)}`}
                style={{
                  display: "inline-block",
                  backgroundColor: "transparent",
                  color: "rgba(255,255,255,0.6)",
                  padding: "12px 24px",
                  borderRadius: "50px",
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.2)",
                  fontSize: "14px",
                }}
              >
                Behöver du avboka?
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0D1B2A" }}>
      {/* Header */}
      <header style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ color: "#fff", textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#D4AF37", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <line x1="20" y1="4" x2="8.12" y2="15.88" />
                <line x1="14.47" y1="14.48" x2="20" y2="20" />
                <line x1="8.12" y1="8.12" x2="12" y2="12" />
              </svg>
            </div>
            <span style={{ fontWeight: "bold", fontSize: "18px", fontFamily: "var(--font-playfair), serif" }}>Celo Salong</span>
          </Link>
          <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "14px" }}>
            ← Tillbaka
          </Link>
        </div>
      </header>

      {/* Progress Steps */}
      <div style={{ padding: "32px 20px 0" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "48px" }}>
            {[
              { num: 1, label: "Tjänst" },
              { num: 2, label: "Tid" },
              { num: 3, label: "Uppgifter" }
            ].map((s) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;
              const canNavigate = isCompleted;
              return (
                <div key={s.num} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    onClick={() => canNavigate && setStep(s.num)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: step >= s.num ? "#D4AF37" : "rgba(255,255,255,0.1)",
                      color: step >= s.num ? "#000" : "rgba(255,255,255,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "14px",
                      cursor: canNavigate ? "pointer" : "default",
                      transition: "all 0.2s",
                      transform: canNavigate ? "scale(1)" : "none",
                    }}
                    title={canNavigate ? `Gå tillbaka till ${s.label}` : s.label}
                  >
                    {isCompleted ? "✓" : s.num}
                  </div>
                  <span style={{
                    color: isCurrent ? "#D4AF37" : step > s.num ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)",
                    fontSize: "12px",
                    fontWeight: isCurrent ? 600 : 400,
                    display: "none",
                  }}>
                    {s.label}
                  </span>
                  {s.num < 3 && (
                    <div style={{ width: "60px", height: "2px", backgroundColor: step > s.num ? "#D4AF37" : "rgba(255,255,255,0.1)" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "0 20px 60px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          {/* Step 1: Select Service */}
          {step === 1 && (
            <div>
              <h1 style={{ color: "#fff", fontSize: "1.75rem", marginBottom: "8px", fontFamily: "var(--font-playfair), serif" }}>
                Välj Tjänst
              </h1>
              <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "32px" }}>
                Välj den tjänst du vill boka
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {services.map((service) => {
                  const isSelected = formData.serviceId === service.id;
                  const isHovered = hoveredService === service.id;
                  return (
                    <button
                      key={service.id}
                      onClick={() => setFormData({ ...formData, serviceId: service.id })}
                      onMouseEnter={() => setHoveredService(service.id)}
                      onMouseLeave={() => setHoveredService(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "20px",
                        backgroundColor: isSelected ? "rgba(212,175,55,0.15)" : isHovered ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)",
                        border: isSelected ? "2px solid #D4AF37" : isHovered ? "2px solid rgba(212,175,55,0.3)" : "2px solid transparent",
                        borderRadius: "12px",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.2s ease",
                        transform: isHovered && !isSelected ? "translateX(4px)" : "none",
                      }}
                    >
                      <div>
                        <div style={{ color: "#fff", fontWeight: 600, fontSize: "16px" }}>{service.name}</div>
                        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginTop: "4px" }}>{service.duration}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ color: "#D4AF37", fontWeight: "bold", fontSize: "20px" }}>{service.price} kr</div>
                        {isSelected && (
                          <div style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            backgroundColor: "#D4AF37",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#000",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}>
                            ✓
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.serviceId}
                style={{
                  width: "100%",
                  marginTop: "32px",
                  padding: "16px",
                  backgroundColor: formData.serviceId ? "#D4AF37" : "rgba(255,255,255,0.1)",
                  color: formData.serviceId ? "#000" : "rgba(255,255,255,0.3)",
                  border: "none",
                  borderRadius: "50px",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: formData.serviceId ? "pointer" : "not-allowed",
                }}
              >
                Fortsätt
              </button>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && (
            <div>
              <h1 style={{ color: "#fff", fontSize: "1.75rem", marginBottom: "8px", fontFamily: "var(--font-playfair), serif" }}>
                Välj Datum & Tid
              </h1>
              <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "32px" }}>
                {selectedService?.name} - {selectedService?.price} kr
              </p>

              {/* Date Picker */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: 500, display: "block", marginBottom: "8px" }}>
                  Datum
                </label>
                <input
                  type="date"
                  min={today}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  onFocus={() => setFocusedField("date")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    backgroundColor: focusedField === "date" ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.05)",
                    border: focusedField === "date" ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "16px",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxShadow: focusedField === "date" ? "0 0 0 3px rgba(212,175,55,0.2)" : "none",
                  }}
                />
              </div>

              {/* Time Slots */}
              {formData.date && (
                <div>
                  <label style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: 500, display: "block", marginBottom: "12px" }}>
                    Tid
                  </label>
                  {availableTimeSlots.length === 0 ? (
                    <div
                      style={{
                        padding: "24px",
                        backgroundColor: "rgba(245,158,11,0.1)",
                        border: "1px solid rgba(245,158,11,0.3)",
                        borderRadius: "12px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ color: "#F59E0B", fontSize: "24px", marginBottom: "8px" }}>⏰</div>
                      <p style={{ color: "#F59E0B", margin: 0, fontWeight: 500 }}>
                        Inga tillgängliga tider kvar idag
                      </p>
                      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: "8px 0 0" }}>
                        Välj ett annat datum för att se lediga tider
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                      {availableTimeSlots.map((time) => {
                        const isSelected = formData.time === time;
                        const isHovered = hoveredTime === time;
                        return (
                          <button
                            key={time}
                            onClick={() => setFormData({ ...formData, time })}
                            onMouseEnter={() => setHoveredTime(time)}
                            onMouseLeave={() => setHoveredTime(null)}
                            style={{
                              padding: "12px",
                              backgroundColor: isSelected ? "#D4AF37" : isHovered ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.05)",
                              color: isSelected ? "#000" : isHovered ? "#D4AF37" : "#fff",
                              border: isSelected ? "none" : isHovered ? "1px solid rgba(212,175,55,0.4)" : "1px solid transparent",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontWeight: isSelected ? "bold" : "normal",
                              transition: "all 0.15s ease",
                              transform: isHovered && !isSelected ? "scale(1.05)" : "none",
                            }}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    padding: "16px",
                    backgroundColor: "transparent",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "50px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Tillbaka
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.date || !formData.time}
                  style={{
                    flex: 2,
                    padding: "16px",
                    backgroundColor: formData.date && formData.time ? "#D4AF37" : "rgba(255,255,255,0.1)",
                    color: formData.date && formData.time ? "#000" : "rgba(255,255,255,0.3)",
                    border: "none",
                    borderRadius: "50px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    cursor: formData.date && formData.time ? "pointer" : "not-allowed",
                  }}
                >
                  Fortsätt
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Details */}
          {step === 3 && (
            <div>
              <h1 style={{ color: "#fff", fontSize: "1.75rem", marginBottom: "8px", fontFamily: "var(--font-playfair), serif" }}>
                Dina Uppgifter
              </h1>
              <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "32px" }}>
                {selectedService?.name} - {formData.date} kl. {formData.time}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: 500, display: "block", marginBottom: "8px" }}>
                    Namn *
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    onFocus={() => setFocusedField("customerName")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Ditt namn"
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      backgroundColor: focusedField === "customerName" ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.05)",
                      border: focusedField === "customerName" ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "10px",
                      color: "#fff",
                      fontSize: "16px",
                      outline: "none",
                      transition: "all 0.2s ease",
                      boxShadow: focusedField === "customerName" ? "0 0 0 3px rgba(212,175,55,0.2)" : "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: 500, display: "block", marginBottom: "8px" }}>
                    E-post *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="din@email.com"
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      backgroundColor: focusedField === "email" ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.05)",
                      border: focusedField === "email" ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "10px",
                      color: "#fff",
                      fontSize: "16px",
                      outline: "none",
                      transition: "all 0.2s ease",
                      boxShadow: focusedField === "email" ? "0 0 0 3px rgba(212,175,55,0.2)" : "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: 500, display: "block", marginBottom: "8px" }}>
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="070-123 45 67"
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      backgroundColor: focusedField === "phone" ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.05)",
                      border: focusedField === "phone" ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "10px",
                      color: "#fff",
                      fontSize: "16px",
                      outline: "none",
                      transition: "all 0.2s ease",
                      boxShadow: focusedField === "phone" ? "0 0 0 3px rgba(212,175,55,0.2)" : "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: 500, display: "block", marginBottom: "8px" }}>
                    Meddelande (valfritt)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    onFocus={() => setFocusedField("notes")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Eventuella önskemål..."
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      backgroundColor: focusedField === "notes" ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.05)",
                      border: focusedField === "notes" ? "2px solid #D4AF37" : "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "10px",
                      color: "#fff",
                      fontSize: "16px",
                      resize: "vertical",
                      outline: "none",
                      transition: "all 0.2s ease",
                      boxShadow: focusedField === "notes" ? "0 0 0 3px rgba(212,175,55,0.2)" : "none",
                    }}
                  />
                </div>
              </div>

              {error && (
                <div style={{
                  marginTop: "16px",
                  padding: "16px",
                  backgroundColor: "rgba(239,68,68,0.15)",
                  border: "2px solid #EF4444",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#EF4444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    flexShrink: 0,
                  }}>
                    ⚠️
                  </div>
                  <div style={{ color: "#EF4444", fontSize: "14px", fontWeight: 500 }}>
                    {error}
                  </div>
                </div>
              )}

              {/* Summary */}
              <div style={{ marginTop: "24px", padding: "20px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                <h3 style={{ color: "#fff", fontSize: "16px", marginBottom: "12px" }}>Sammanfattning</h3>
                <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.6)", marginBottom: "8px" }}>
                  <span>{selectedService?.name}</span>
                  <span>{selectedService?.price} kr</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.6)", marginBottom: "12px" }}>
                  <span>{formData.date} kl. {formData.time}</span>
                  <span>{selectedService?.duration}</span>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "12px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#fff", fontWeight: 600 }}>Totalt</span>
                  <span style={{ color: "#D4AF37", fontWeight: "bold", fontSize: "20px" }}>{selectedService?.price} kr</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    flex: 1,
                    padding: "16px",
                    backgroundColor: "transparent",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "50px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Tillbaka
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.customerName || !formData.email || !formData.phone || isSubmitting}
                  style={{
                    flex: 2,
                    padding: "16px",
                    backgroundColor: formData.customerName && formData.email && formData.phone && !isSubmitting ? "#D4AF37" : "rgba(255,255,255,0.1)",
                    color: formData.customerName && formData.email && formData.phone && !isSubmitting ? "#000" : "rgba(255,255,255,0.3)",
                    border: "none",
                    borderRadius: "50px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    cursor: formData.customerName && formData.email && formData.phone && !isSubmitting ? "pointer" : "not-allowed",
                  }}
                >
                  {isSubmitting ? "Bokar..." : "Bekräfta Bokning"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", backgroundColor: "#0D1B2A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#D4AF37", fontSize: "18px" }}>Laddar...</div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
