"use client";

import { useState } from "react";

// Real reviews from Google
const reviews = [
  { name: "Marcus Olofsson", rating: 5, text: "Zidane tar alltid hand om mig på bästa sätt 😊👌", date: "6 månader sedan" },
  { name: "I R", rating: 5, text: "Både jag och sonen klipper oss här. Snabb, noggrann bra pris samt riktigt duktiga frisörer! Rekommenderas varmt!", date: "1 år sedan" },
  { name: "Maria Isaksson", rating: 5, text: "Fint bemött och väldigt nöjd med min första klippning av Mohamed.", date: "4 år sedan" },
  { name: "Annika Wendt", rating: 5, text: "Alltid bra service kanon frisörer", date: "4 år sedan" },
  { name: "Jens Sjögren", rating: 5, text: "Grymma barber's", date: "3 år sedan" },
  { name: "Fabio Alves", rating: 5, text: "Bra service. Swish accepteras.", date: "5 år sedan" },
];

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#D4AF37" : "none"} stroke="#D4AF37" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function Reviews() {
  const [hoveredReview, setHoveredReview] = useState<number | null>(null);
  const [hoveredCta, setHoveredCta] = useState(false);

  return (
    <section
      id="reviews"
      style={{
        padding: "80px 20px",
        backgroundColor: "#0D1B2A",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          {/* Google Rating Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#fff",
              padding: "12px 24px",
              borderRadius: "50px",
              marginBottom: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            {/* Google Logo */}
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <div style={{ display: "flex", gap: "2px" }}>
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} filled={i < 5} />
              ))}
            </div>
            <span style={{ fontWeight: "bold", color: "#102A43", fontSize: "18px" }}>4.6</span>
            <span style={{ color: "#627D98" }}>35 recensioner</span>
          </div>

          <h2 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3rem)", margin: 0, fontFamily: "var(--font-playfair), serif" }}>
            Vad Våra Kunder Säger
          </h2>
        </div>

        {/* Reviews Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          {reviews.map((review, index) => {
            const isHovered = hoveredReview === index;
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredReview(index)}
                onMouseLeave={() => setHoveredReview(null)}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  padding: "24px",
                  transition: "all 0.3s ease",
                  transform: isHovered ? "translateY(-8px) scale(1.02)" : "none",
                  boxShadow: isHovered ? "0 20px 40px rgba(212,175,55,0.2)" : "0 4px 15px rgba(0,0,0,0.1)",
                  border: isHovered ? "2px solid #D4AF37" : "2px solid transparent",
                  cursor: "default",
                }}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: "2px", marginBottom: "16px" }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} filled={i < review.rating} />
                  ))}
                </div>

                {/* Text */}
                <p style={{ color: "#334E68", fontSize: "16px", lineHeight: 1.6, margin: "0 0 20px 0" }}>
                  "{review.text}"
                </p>

                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: isHovered ? "#e5c349" : "#D4AF37",
                      color: "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "16px",
                      transition: "all 0.3s ease",
                      transform: isHovered ? "scale(1.1)" : "none",
                    }}
                  >
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "#102A43" }}>{review.name}</div>
                    <div style={{ fontSize: "13px", color: "#829AB1" }}>{review.date}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <a
            href="https://www.google.com/search?q=celo+salong+malmö"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredCta(true)}
            onMouseLeave={() => setHoveredCta(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: hoveredCta ? "#f5f5f5" : "#fff",
              color: "#102A43",
              padding: "14px 28px",
              borderRadius: "50px",
              fontWeight: 600,
              fontSize: "15px",
              textDecoration: "none",
              transition: "all 0.2s ease",
              transform: hoveredCta ? "translateY(-2px)" : "none",
              boxShadow: hoveredCta ? "0 8px 25px rgba(0,0,0,0.15)" : "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Se Alla Recensioner på Google
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
