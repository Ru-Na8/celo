"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/bookings", label: "Bokningar", icon: "📅" },
  { href: "/admin/reviews", label: "Recensioner", icon: "⭐" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check auth on mount
    fetch("/api/admin/stats")
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login");
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0F1419",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#D4AF37", fontSize: "18px" }}>Laddar...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F1419", display: "flex", flexDirection: "column" }}>
      {/* Mobile Header */}
      <div style={{
        display: "none",
        "@media (max-width: 768px)": { display: "flex" },
        backgroundColor: "#1B2838",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "16px",
        alignItems: "center",
        justifyContent: "space-between",
      } as any}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #D4AF37 0%, #F0DEAA 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
          }}>
            ✂️
          </div>
          <div style={{ color: "#fff", fontWeight: "bold", fontSize: "14px" }}>Celo Salong</div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: "none",
            border: "none",
            color: "#D4AF37",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar Overlay (Mobile) */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 40,
              display: "none",
              "@media (max-width: 768px)": { display: "block" },
            } as any}
          />
        )}

        {/* Sidebar */}
        <aside
          style={{
            width: "260px",
            backgroundColor: "#1B2838",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            height: "100vh",
            zIndex: 50,
            left: 0,
            top: 0,
            "@media (max-width: 768px)": {
              position: "fixed",
              left: sidebarOpen ? 0 : "-260px",
              top: "60px",
              height: "calc(100vh - 60px)",
              transition: "left 0.3s ease",
            },
          } as any}
        >
        {/* Logo - Hidden on Mobile */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #D4AF37 0%, #F0DEAA 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}
            >
              ✂️
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: "bold", fontSize: "16px" }}>
                Celo Salong
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
                Admin Panel
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              display: "none",
              "@media (max-width: 768px)": { display: "block" },
              background: "none",
              border: "none",
              color: "#D4AF37",
              fontSize: "20px",
              cursor: "pointer",
            } as any}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  marginBottom: "4px",
                  backgroundColor: isActive ? "rgba(212, 175, 55, 0.15)" : "transparent",
                  color: isActive ? "#D4AF37" : "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 400,
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Back to site + Logout */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              backgroundColor: "transparent",
              color: "rgba(255,255,255,0.5)",
              textDecoration: "none",
              fontSize: "14px",
              marginBottom: "4px",
            }}
          >
            <span style={{ fontSize: "18px" }}>🏠</span>
            Till hemsidan
          </a>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              backgroundColor: "transparent",
              color: "#EF4444",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: "18px" }}>🚪</span>
            Logga ut
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: "260px",
        padding: "32px",
        overflowY: "auto",
        "@media (max-width: 768px)": {
          marginLeft: 0,
          padding: "16px",
          marginTop: "60px",
        },
      } as any}>
        {children}
      </main>
      </div>
    </div>
  );
}
