"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        padding: "48px 20px 24px",
        backgroundColor: "#0A1929",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "40px",
            paddingBottom: "32px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "#D4AF37",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <line x1="20" y1="4" x2="8.12" y2="15.88" />
                  <line x1="14.47" y1="14.48" x2="20" y2="20" />
                  <line x1="8.12" y1="8.12" x2="12" y2="12" />
                </svg>
              </div>
              <span style={{ color: "#fff", fontSize: "20px", fontWeight: "bold", fontFamily: "var(--font-playfair), serif" }}>
                Celo Salong
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", maxWidth: "250px", lineHeight: 1.6 }}>
              Premium barbershop i Malmö. Professionella herrklippningar och traditionell rakning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "#fff", fontSize: "14px", fontWeight: 600, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Snabblänkar
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href="#services" style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", textDecoration: "none" }}>Tjänster</a>
              <a href="#reviews" style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", textDecoration: "none" }}>Recensioner</a>
              <a href="#contact" style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", textDecoration: "none" }}>Kontakt</a>
              <Link href="/booking" style={{ color: "#D4AF37", fontSize: "14px", textDecoration: "none", fontWeight: 500 }}>Boka Tid</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: "#fff", fontSize: "14px", fontWeight: 600, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Kontakt
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>Malmö, Sverige</span>
              <a href="tel:+46700000000" style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", textDecoration: "none" }}>Ring Oss</a>
              <a
                href="https://www.instagram.com/mohammed_frisor"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", textDecoration: "none" }}
              >
                @mohammed_frisor
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ paddingTop: "24px", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>
            © {new Date().getFullYear()} Celo Salong. Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </footer>
  );
}
