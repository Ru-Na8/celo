"use client";

export function Contact() {
  return (
    <section
      id="contact"
      style={{
        padding: "80px 20px",
        backgroundColor: "#FBF9F4",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {/* Left - Image */}
          <div>
            <div
              style={{
                position: "relative",
                aspectRatio: "4/5",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074"
                alt="Celo Salong"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <span style={{ color: "#D4AF37", fontSize: "14px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "2px" }}>
              Kontakt
            </span>
            <h2 style={{ color: "#102A43", fontSize: "clamp(2rem, 5vw, 2.5rem)", margin: "8px 0 24px", fontFamily: "var(--font-playfair), serif" }}>
              Besök Oss
            </h2>
            <p style={{ color: "#627D98", fontSize: "16px", lineHeight: 1.7, marginBottom: "32px" }}>
              Din professionella barbershop i Malmö. Vi kombinerar klassiskt hantverk med moderna tekniker.
            </p>

            {/* Info Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Address */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                  padding: "20px",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #E0D5BE",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(212,175,55,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ color: "#102A43", margin: "0 0 4px", fontWeight: 600 }}>Adress</h4>
                  <p style={{ color: "#627D98", margin: 0, fontSize: "14px" }}>Malmö, Sverige</p>
                </div>
              </div>

              {/* Hours */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                  padding: "20px",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  border: "1px solid #E0D5BE",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(212,175,55,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ color: "#102A43", margin: "0 0 8px", fontWeight: 600 }}>Öppettider</h4>
                  <div style={{ color: "#627D98", fontSize: "14px", lineHeight: 1.8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", minWidth: "200px" }}>
                      <span>Mån - Fre</span>
                      <span style={{ fontWeight: 500, color: "#102A43" }}>10:00 - 19:00</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Lördag</span>
                      <span style={{ fontWeight: 500, color: "#102A43" }}>10:00 - 17:00</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Söndag</span>
                      <span style={{ fontWeight: 500, color: "#102A43" }}>Stängt</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/mohammed_frisor"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "20px",
                  backgroundColor: "#102A43",
                  borderRadius: "12px",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ color: "#fff", margin: "0 0 4px", fontWeight: 600 }}>Följ Oss</h4>
                  <p style={{ color: "rgba(255,255,255,0.7)", margin: 0, fontSize: "14px" }}>@mohammed_frisor</p>
                </div>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                  style={{ marginLeft: "auto" }}
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
