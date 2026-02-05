"use client";

import { useState, useEffect } from "react";

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  isVisible: boolean;
}

interface Stats {
  count: number;
  average: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats>({ count: 0, average: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "visible" | "hidden" | "with-text">("all");

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setReviews(data.reviews || []);
      setStats(data.stats || { count: 0, average: 0 });
      setError("");
    } catch {
      setError("Kunde inte hämta recensioner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleVisibility = async (id: string, isVisible: boolean) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isVisible }),
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch {
      setError("Kunde inte uppdatera recension");
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === "visible") return r.isVisible;
    if (filter === "hidden") return !r.isVisible;
    if (filter === "with-text") return r.text.length > 0;
    return true;
  });

  const renderStars = (rating: number) => {
    return (
      <div style={{ display: "flex", gap: "2px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              color: star <= rating ? "#D4AF37" : "rgba(255,255,255,0.2)",
              fontSize: "16px",
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "400px" }}>
        <div style={{ color: "#D4AF37", fontSize: "18px" }}>Laddar recensioner...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: "bold", marginBottom: "8px" }}>
          Recensioner
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>
          Hantera Google-recensioner som visas på hemsidan
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <StatsCard
          icon="⭐"
          label="Snittbetyg"
          value={stats.average.toFixed(1)}
          color="#D4AF37"
        />
        <StatsCard
          icon="📝"
          label="Totalt recensioner"
          value={reviews.length}
          color="#fff"
        />
        <StatsCard
          icon="👁"
          label="Synliga"
          value={reviews.filter((r) => r.isVisible).length}
          color="#10B981"
        />
        <StatsCard
          icon="💬"
          label="Med text"
          value={reviews.filter((r) => r.text.length > 0).length}
          color="#3B82F6"
        />
      </div>

      {/* Filter */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          {(["all", "visible", "hidden", "with-text"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: filter === f ? "#D4AF37" : "#1B2838",
                color: filter === f ? "#000" : "rgba(255,255,255,0.7)",
                fontSize: "14px",
                cursor: "pointer",
                fontWeight: filter === f ? 600 : 400,
              }}
            >
              {f === "all" && "Alla"}
              {f === "visible" && "Synliga"}
              {f === "hidden" && "Dolda"}
              {f === "with-text" && "Med text"}
            </button>
          ))}
        </div>
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
        </div>
      )}

      {/* Reviews Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "16px",
        }}
      >
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            style={{
              backgroundColor: "#1B2838",
              borderRadius: "16px",
              padding: "20px",
              opacity: review.isVisible ? 1 : 0.6,
              border: review.isVisible ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(239,68,68,0.3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <div style={{ color: "#fff", fontWeight: 600, marginBottom: "4px" }}>{review.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {renderStars(review.rating)}
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>{review.date}</span>
                </div>
              </div>
              <button
                onClick={() => toggleVisibility(review.id, !review.isVisible)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: review.isVisible ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                  color: review.isVisible ? "#10B981" : "#EF4444",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {review.isVisible ? "Synlig" : "Dold"}
              </button>
            </div>
            {review.text ? (
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: 1.5, margin: 0 }}>
                &ldquo;{review.text}&rdquo;
              </p>
            ) : (
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px", fontStyle: "italic", margin: 0 }}>
                Ingen text
              </p>
            )}
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div
          style={{
            backgroundColor: "#1B2838",
            borderRadius: "16px",
            padding: "60px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⭐</div>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Inga recensioner matchar filtret</p>
        </div>
      )}

      {/* Info */}
      <div
        style={{
          marginTop: "32px",
          padding: "16px 20px",
          backgroundColor: "rgba(212,175,55,0.1)",
          borderRadius: "12px",
          border: "1px solid rgba(212,175,55,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>💡</span>
          <div>
            <div style={{ color: "#D4AF37", fontWeight: 600, marginBottom: "4px" }}>Tips</div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", margin: 0 }}>
              Endast synliga recensioner visas på den publika hemsidan. Recensioner med text prioriteras i visningen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <div
      style={{
        backgroundColor: "#1B2838",
        borderRadius: "12px",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "28px" }}>{icon}</span>
        <div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginBottom: "2px" }}>{label}</div>
          <div style={{ color, fontSize: "1.5rem", fontWeight: "bold" }}>{value}</div>
        </div>
      </div>
    </div>
  );
}
