"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { NOTIFICATIONS } from "@/lib/data";

const NAV_ITEMS = [
  { href: "/feed", icon: "🏠", label: "Inicio" },
  { href: "/explore", icon: "🔍", label: "Explorar" },
  { href: "/genealogy", icon: "🌳", label: "Árbol" },
  { href: "/explore?tab=altares", icon: "🕯️", label: "Altares" },
  { href: "/map", icon: "🗺️", label: "Mapa" },
  { href: "/live", icon: "🔴", label: "En Vivo" },
  { href: "/marketplace", icon: "🛒", label: "Tienda" },
  { href: "/legacy-vault", icon: "🔒", label: "Legacy Vault" },
];

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    router.push("/");
  };

  // Close dropdowns on outside click using refs
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(8,8,16,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--glass-border)",
        height: 60,
        display: "flex", alignItems: "center", padding: "0 1.5rem",
        gap: "1rem",
      }}>
        {/* Logo */}
        <Link href="/feed" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: "1.5rem" }}>🌹</span>
          <span className="font-display" style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--viva-gold)", letterSpacing: "0.1em" }}>VIVA</span>
          <span className="tag tag-rose" style={{ fontSize: "0.55rem", padding: "1px 6px" }}>BETA</span>
        </Link>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 360, position: "relative" }}>
          <input
            className="input-viva"
            placeholder="🔍  Buscar memoriales, familias, recuerdos..."
            style={{ padding: "0.5rem 1rem 0.5rem 2.5rem", fontSize: "0.83rem", borderRadius: 50 }}
          />
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>🔍</span>
        </div>

        {/* Desktop nav links */}
        <div style={{ display: "flex", gap: "4px", alignItems: "center", flex: 1, justifyContent: "center" }}>
          {NAV_ITEMS.slice(0, 5).map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "6px 14px", borderRadius: 10, cursor: "pointer",
                color: pathname === item.href ? "var(--viva-gold)" : "var(--text-muted)",
                background: pathname === item.href ? "var(--gold-glass)" : "transparent",
                border: pathname === item.href ? "1px solid var(--gold-border)" : "1px solid transparent",
                transition: "all 0.2s", fontSize: "0.7rem",
              }}>
                <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>{item.icon}</span>
                <span style={{ marginTop: 2, whiteSpace: "nowrap" }}>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
          {/* Notifications */}
          <div style={{ position: "relative" }} ref={notifRef}>
            <button
              id="notifications-btn"
              onClick={() => { setShowNotifs(p => !p); setShowUserMenu(false); }}
              style={{
                background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
                borderRadius: "50%", width: 38, height: 38, cursor: "pointer",
                position: "relative", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              🔔
              {unread > 0 && (
                <span style={{
                  position: "absolute", top: -4, right: -4,
                  background: "var(--viva-rose)", color: "white",
                  borderRadius: "50%", width: 18, height: 18,
                  fontSize: "0.65rem", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "2px solid var(--viva-black)",
                }}>
                  {unread}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  style={{
                    position: "absolute", top: "calc(100% + 12px)", right: 0,
                    width: 340, background: "var(--viva-card)",
                    border: "1px solid var(--glass-border)", borderRadius: 16,
                    boxShadow: "var(--shadow-modal)", overflow: "hidden", zIndex: 200,
                  }}
                >
                  <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Notificaciones</span>
                    <span className="tag tag-rose">{unread} nuevas</span>
                  </div>
                  <div style={{ maxHeight: 380, overflowY: "auto" }}>
                    {NOTIFICATIONS.length === 0 ? (
                      <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔔</div>
                        Sin notificaciones por ahora
                      </div>
                    ) : (
                      NOTIFICATIONS.map((n: any) => (
                        <div key={n.id} style={{
                          padding: "0.9rem 1.25rem",
                          borderBottom: "1px solid var(--glass-border)",
                          display: "flex", gap: "0.75rem", alignItems: "flex-start",
                          background: !n.read ? "rgba(201,168,76,0.04)" : "transparent",
                          cursor: "pointer",
                          transition: "background 0.2s",
                        }}
                          onMouseEnter={e => (e.currentTarget.style.background = "var(--glass-bg)")}
                          onMouseLeave={e => (e.currentTarget.style.background = !n.read ? "rgba(201,168,76,0.04)" : "transparent")}
                        >
                          <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>
                            {n.type === "reaction" ? "🌹" : n.type === "comment" ? "💬" : n.type === "anniversary" ? "🕯️" : n.type === "follow" ? "🌳" : "🌼"}
                          </span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: "0.83rem", color: "var(--text-primary)", lineHeight: 1.4 }}>
                              {n.user ? <strong>{n.user.name}</strong> : <strong>VIVA</strong>} {n.action} <strong>{n.target}</strong>
                            </p>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                              {new Date(n.timestamp).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                          {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--viva-gold)", flexShrink: 0, marginTop: 6 }} />}
                        </div>
                      ))
                    )}
                  </div>
                  <div style={{ padding: "0.75rem", textAlign: "center", borderTop: "1px solid var(--glass-border)" }}>
            <Link href="/notifications" style={{ color: "var(--viva-gold)", fontSize: "0.82rem", textDecoration: "none" }}>
                      Ver todas las notificaciones →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User menu or Login buttons */}
          {user ? (
            <div style={{ position: "relative" }} ref={userMenuRef}>
              <button
                id="user-menu-btn"
                onClick={() => { setShowUserMenu(p => !p); setShowNotifs(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                  background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
                  borderRadius: 50, padding: "4px 12px 4px 4px",
                  transition: "all 0.2s",
                }}
              >
                <img src={user.avatar} alt={user.name} style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--viva-gold)" }} />
                <span style={{ fontSize: "0.83rem", color: "var(--text-primary)", fontWeight: 500, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.name.split(" ")[0]}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>▾</span>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    style={{
                      position: "absolute", top: "calc(100% + 12px)", right: 0,
                      width: 220, background: "var(--viva-card)",
                      border: "1px solid var(--glass-border)", borderRadius: 16,
                      boxShadow: "var(--shadow-modal)", overflow: "hidden", zIndex: 200,
                    }}
                  >
                    <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--glass-border)" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-primary)" }}>{user.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>@{user.username}</div>
                    </div>
                    {[
                      { icon: "👤", label: "Mi Perfil", href: "/profile/me" },
                      { icon: "🕯️", label: "Mis Altares", href: "/explore?tab=altares" },
                      { icon: "🌳", label: "Mi Árbol Familiar", href: "/genealogy" },
                      { icon: "🛒", label: "Marketplace", href: "/marketplace" },
                      { icon: "🔒", label: "Legacy Vault™", href: "/legacy-vault" },
                      { icon: "⚙️", label: "Configuración", href: "/profile/me" },
                    ].map(item => (
                      <Link key={item.label} href={item.href} style={{ textDecoration: "none" }}>
                        <div style={{
                          display: "flex", alignItems: "center", gap: "0.75rem",
                          padding: "0.75rem 1.25rem", cursor: "pointer",
                          color: "var(--text-secondary)", fontSize: "0.85rem",
                          transition: "background 0.2s",
                        }}
                          onMouseEnter={e => (e.currentTarget.style.background = "var(--glass-bg)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <span>{item.icon}</span> {item.label}
                        </div>
                      </Link>
                    ))}
                    <div style={{ borderTop: "1px solid var(--glass-border)" }}>
                      <div
                        onClick={handleLogout}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.75rem",
                          padding: "0.75rem 1.25rem", cursor: "pointer",
                          color: "var(--viva-rose)", fontSize: "0.85rem",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(212,69,107,0.08)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        🚪 Cerrar Sesión
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <Link href="/login" style={{ textDecoration: "none" }}>
                <button style={{
                  background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
                  color: "var(--text-primary)", borderRadius: 50, padding: "6px 16px",
                  fontSize: "0.82rem", cursor: "pointer", transition: "all 0.2s",
                  fontWeight: 500,
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--viva-gold)"; e.currentTarget.style.color = "var(--viva-gold)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                >
                  Iniciar Sesión
                </button>
              </Link>
              <Link href="/register" style={{ textDecoration: "none" }}>
                <button className="btn-gold" style={{ fontSize: "0.82rem", padding: "6px 16px", borderRadius: 50 }}>
                  Crear Cuenta
                </button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setShowMobileMenu(p => !p)}
            style={{
              display: "none",
              background: "none", border: "none", color: "var(--text-primary)",
              fontSize: "1.3rem", cursor: "pointer",
            }}
            className="mobile-menu-btn"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Spacer */}
      <div style={{ height: 60 }} />

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
