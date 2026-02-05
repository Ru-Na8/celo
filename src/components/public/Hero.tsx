"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { salonInfo } from "@/lib/db";

function getOpenStatus(): { isOpen: boolean; statusText: string } {
  const now = new Date();
  const dayIndex = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;

  // Map JS day index to our opening hours array (our array starts with Monday)
  const dayMap: Record<number, number> = {
    0: 6, // Sunday
    1: 0, // Monday
    2: 1, // Tuesday
    3: 2, // Wednesday
    4: 3, // Thursday
    5: 4, // Friday
    6: 5, // Saturday
  };

  const todayIndex = dayMap[dayIndex];
  const todayHours = salonInfo.openingHours[todayIndex];

  // Parse opening hours (format: "10–19" or "10–15")
  const [openStr, closeStr] = todayHours.hours.split("–");
  const openTime = parseInt(openStr) * 60; // e.g., 10:00 = 600
  const closeTime = parseInt(closeStr) * 60; // e.g., 19:00 = 1140

  const isOpen = currentTime >= openTime && currentTime < closeTime;

  if (isOpen) {
    const closeHour = parseInt(closeStr);
    return { isOpen: true, statusText: `Öppet till ${closeHour}:00` };
  } else {
    // Find next opening
    if (currentTime < openTime) {
      return { isOpen: false, statusText: `Öppnar ${openStr}:00 idag` };
    } else {
      // Check tomorrow
      const tomorrowIndex = (todayIndex + 1) % 7;
      const tomorrowHours = salonInfo.openingHours[tomorrowIndex];
      const [tomorrowOpen] = tomorrowHours.hours.split("–");
      return { isOpen: false, statusText: `Öppnar ${tomorrowOpen}:00 imorgon` };
    }
  }
}

export function Hero() {
  const [status, setStatus] = useState({ isOpen: false, statusText: "Laddar..." });

  useEffect(() => {
    setStatus(getOpenStatus());
    // Update every minute
    const interval = setInterval(() => setStatus(getOpenStatus()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Format phone for tel: link (remove spaces and dashes, add country code)
  const phoneLink = `tel:+46${salonInfo.phone.replace(/^0/, "").replace(/[- ]/g, "")}`;

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.4,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 20px" }}>
        {/* Rating Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#D4AF37",
            padding: "10px 20px",
            borderRadius: "50px",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex", gap: "2px" }}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#000">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span style={{ fontWeight: "bold", color: "#000", fontSize: "14px" }}>4.6 på Google (35 recensioner)</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(3rem, 12vw, 8rem)",
            fontWeight: "bold",
            color: "#fff",
            margin: 0,
            lineHeight: 1,
            fontFamily: "var(--font-playfair), serif",
          }}
        >
          CELO
        </h1>
        <h2
          style={{
            fontSize: "clamp(2.5rem, 10vw, 6rem)",
            fontWeight: "bold",
            color: "#D4AF37",
            margin: "0 0 24px 0",
            lineHeight: 1,
            fontFamily: "var(--font-playfair), serif",
          }}
        >
          SALONG
        </h2>

        {/* Tagline */}
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.25rem", marginBottom: "40px" }}>
          Professionell Barbershop i Malmö
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/booking"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#D4AF37",
              color: "#000",
              padding: "16px 32px",
              borderRadius: "50px",
              fontWeight: "bold",
              fontSize: "1rem",
              textDecoration: "none",
              transition: "transform 0.2s",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Boka Tid
          </Link>
          <a
            href={phoneLink}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "transparent",
              color: "#fff",
              padding: "16px 32px",
              borderRadius: "50px",
              fontWeight: "bold",
              fontSize: "1rem",
              textDecoration: "none",
              border: "2px solid rgba(255,255,255,0.4)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {salonInfo.phone}
          </a>
        </div>

        {/* Info */}
        <div style={{ marginTop: "48px", display: "flex", gap: "32px", justifyContent: "center", flexWrap: "wrap", color: "rgba(255,255,255,0.7)" }}>
          <a
            href={salonInfo.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{salonInfo.address}, {salonInfo.city}</span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: status.isOpen ? "#10B981" : "#EF4444",
                boxShadow: status.isOpen ? "0 0 8px #10B981" : "0 0 8px #EF4444",
              }}
            />
            <span style={{ color: status.isOpen ? "#10B981" : "#EF4444", fontWeight: 500 }}>
              {status.statusText}
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.5)",
          animation: "bounce 2s infinite",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-10px); }
          60% { transform: translateX(-50%) translateY(-5px); }
        }
      `}</style>
    </section>
  );
}
