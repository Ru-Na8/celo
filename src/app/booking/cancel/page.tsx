"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function CancelBookingContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  const phone = searchParams.get("phone");

  const [phoneInput, setPhoneInput] = useState(phone || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (phone) {
      setPhoneInput(phone);
    }
  }, [phone]);

  const handleCancel = async () => {
    if (!bookingId || !phoneInput) {
      setError("Ange ditt telefonnummer");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingId, phone: phoneInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Kunde inte avboka");
      }

      setIsCancelled(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel");
    } finally {
      setIsLoading(false);
    }
  };

  if (!bookingId) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0D1B2A", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
          <h1 style={{ color: "#fff", fontSize: "1.5rem", marginBottom: "16px" }}>Ogiltig länk</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "24px" }}>
            Ingen boknings-ID hittades. Kontakta oss för att avboka.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              backgroundColor: "#D4AF37",
              color: "#000",
              padding: "12px 24px",
              borderRadius: "50px",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Till Startsidan
          </Link>
        </div>
      </div>
    );
  }

  if (isCancelled) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0D1B2A", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#10B981",
              margin: "0 auto 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 style={{ color: "#fff", fontSize: "1.75rem", marginBottom: "16px", fontFamily: "var(--font-playfair), serif" }}>
            Bokning Avbokad
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "32px" }}>
            Din bokning har avbokats. Välkommen åter!
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link
              href="/booking"
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
              Boka Ny Tid
            </Link>
            <Link
              href="/"
              style={{
                display: "inline-block",
                backgroundColor: "transparent",
                color: "rgba(255,255,255,0.6)",
                padding: "12px 24px",
                borderRadius: "50px",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Till Startsidan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0D1B2A" }}>
      {/* Header */}
      <header style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
        </div>
      </header>

      {/* Content */}
      <div style={{ padding: "60px 20px" }}>
        <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "24px" }}>📅</div>
          <h1 style={{ color: "#fff", fontSize: "1.75rem", marginBottom: "16px", fontFamily: "var(--font-playfair), serif" }}>
            Avboka Tid
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "32px" }}>
            Ange ditt telefonnummer för att bekräfta avbokningen.
          </p>

          <div style={{ marginBottom: "24px", textAlign: "left" }}>
            <label style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", display: "block", marginBottom: "8px" }}>
              Telefonnummer
            </label>
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="070-123 45 67"
              style={{
                width: "100%",
                padding: "14px 16px",
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "16px",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: "24px",
                padding: "12px",
                backgroundColor: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "8px",
                color: "#EF4444",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              backgroundColor: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "24px",
              textAlign: "left",
            }}
          >
            <p style={{ color: "#F59E0B", margin: 0, fontSize: "14px" }}>
              <strong>OBS:</strong> Avbokning kan inte ångras. Vill du ändra tiden? Ring oss istället.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={handleCancel}
              disabled={isLoading || !phoneInput}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: !phoneInput || isLoading ? "rgba(239,68,68,0.3)" : "#EF4444",
                color: "#fff",
                border: "none",
                borderRadius: "50px",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: !phoneInput || isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Avbokar..." : "Bekräfta Avbokning"}
            </button>
            <Link
              href="/"
              style={{
                display: "inline-block",
                backgroundColor: "transparent",
                color: "rgba(255,255,255,0.6)",
                padding: "14px",
                borderRadius: "50px",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Avbryt
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CancelBookingPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", backgroundColor: "#0D1B2A", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "#D4AF37" }}>Laddar...</div>
        </div>
      }
    >
      <CancelBookingContent />
    </Suspense>
  );
}
