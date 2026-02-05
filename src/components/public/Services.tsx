"use client";

import { useState } from "react";
import Link from "next/link";

const services = [
  { id: "herrklippning", name: "Herrklippning", price: 350, duration: "30 min", icon: "✂️" },
  { id: "rakning", name: "Rakning", price: 400, duration: "45 min", icon: "🪒" },
  { id: "vip-paket", name: "VIP Paket", price: 650, duration: "75 min", icon: "👑", popular: true },
  { id: "skagg", name: "Skäggtrimning", price: 250, duration: "20 min", icon: "✨" },
];

export function Services() {
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [hoveredCta, setHoveredCta] = useState(false);
  return (
    <section
      id="services"
      style={{
        padding: "80px 20px",
        backgroundColor: "#102A43",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ color: "#D4AF37", fontSize: "14px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "2px" }}>
            Våra Tjänster
          </span>
          <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3rem)", marginTop: "8px", fontFamily: "var(--font-playfair), serif" }}>
            Prislista
          </h2>
        </div>

        {/* Services List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {services.map((service) => {
            const isHovered = hoveredService === service.id;
            return (
              <Link
                href={`/booking?service=${service.id}`}
                key={service.id}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "24px",
                  backgroundColor: isHovered ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                  border: isHovered ? "1px solid rgba(212,175,55,0.3)" : "1px solid rgba(255,255,255,0.1)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  transform: isHovered ? "translateX(8px)" : "none",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      backgroundColor: isHovered ? "rgba(212,175,55,0.25)" : "rgba(212,175,55,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      transition: "all 0.2s ease",
                      transform: isHovered ? "scale(1.1)" : "none",
                    }}
                  >
                    {service.icon}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <h3 style={{ color: "#fff", fontSize: "18px", margin: 0, fontWeight: 600 }}>{service.name}</h3>
                      {service.popular && (
                        <span
                          style={{
                            backgroundColor: "#D4AF37",
                            color: "#000",
                            padding: "2px 8px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "bold",
                          }}
                        >
                          Populär
                        </span>
                      )}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {service.duration}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ color: "#D4AF37", fontSize: "24px", fontWeight: "bold" }}>{service.price}</span>
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginLeft: "4px" }}>kr</span>
                  </div>
                  <div
                    style={{
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? "translateX(0)" : "translateX(-8px)",
                      transition: "all 0.2s ease",
                      color: "#D4AF37",
                      fontSize: "20px",
                    }}
                  >
                    →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link
            href="/booking"
            onMouseEnter={() => setHoveredCta(true)}
            onMouseLeave={() => setHoveredCta(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: hoveredCta ? "#e5c349" : "#D4AF37",
              color: "#000",
              padding: "16px 40px",
              borderRadius: "50px",
              fontWeight: "bold",
              fontSize: "16px",
              textDecoration: "none",
              transition: "all 0.2s ease",
              transform: hoveredCta ? "translateY(-2px)" : "none",
              boxShadow: hoveredCta ? "0 8px 25px rgba(212,175,55,0.4)" : "0 4px 15px rgba(212,175,55,0.2)",
            }}
          >
            Boka Tid
            <span style={{
              transition: "transform 0.2s ease",
              transform: hoveredCta ? "translateX(4px)" : "none",
            }}>
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
