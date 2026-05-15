"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppNavbar from "@/components/AppNavbar";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function LivePage() {
  const { isAuthenticated, user } = useAuth();
  const [chatMsg, setChatMsg] = useState("");
  const [chatMessages, setChatMessages] = useState<{ name: string; text: string; time: string }[]>([]);
  const [going, setGoing] = useState(false);

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    const now = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
    setChatMessages(m => [...m, { name: user?.name.split(" ")[0] || "Tú", text: chatMsg, time: now }]);
    setChatMsg("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--viva-black)" }}>
      <AppNavbar />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginBottom: "0.5rem" }}>
            🔴 <span className="gradient-gold">En Vivo</span>
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>Homenajes, serenatas y reuniones familiares en tiempo real</p>
        </motion.div>

        {/* Go Live button */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          {isAuthenticated ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setGoing(g => !g)}
              style={{
                fontSize: "1rem", padding: "0.9rem 2.5rem",
                background: going ? "var(--viva-rose)" : "linear-gradient(135deg, #cc0000, #ff3333)",
                border: "none", borderRadius: 50, cursor: "pointer",
                color: "white", fontWeight: 700,
                boxShadow: "0 4px 20px rgba(204,0,0,0.4)",
              }}
            >
              {going ? "⏹️ Detener transmisión" : "⏺️ Iniciar transmisión en vivo"}
            </motion.button>
          ) : (
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/register"><button className="btn-gold" style={{ fontSize: "0.95rem" }}>🌹 Crear cuenta para transmitir</button></Link>
              <Link href="/login"><button className="btn-glass">Iniciar sesión</button></Link>
            </div>
          )}
        </div>

        {/* Live section */}
        <div style={{ display: "grid", gridTemplateColumns: going ? "1fr 320px" : "1fr", gap: "1.5rem" }}>
          {/* Main area */}
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="live-badge">EN VIVO</span> Transmisiones activas
            </h2>

            {/* Empty live state */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: "var(--viva-card)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: "4rem 2rem", textAlign: "center", marginBottom: "2rem" }}>
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🔴</motion.div>
              <h3 style={{ fontWeight: 700, color: "var(--viva-gold)", marginBottom: "0.5rem" }}>Ninguna transmisión activa</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.6, maxWidth: 380, margin: "0 auto 1.5rem" }}>
                Sé el primero en iniciar un homenaje en vivo. Comparte un momento especial con tu familia desde cualquier lugar del mundo.
              </p>
              {isAuthenticated && (
                <button
                  onClick={() => setGoing(true)}
                  style={{
                    fontSize: "0.9rem", padding: "0.75rem 2rem",
                    background: "linear-gradient(135deg, #cc0000, #ff3333)",
                    border: "none", borderRadius: 50, cursor: "pointer",
                    color: "white", fontWeight: 700,
                  }}
                >
                  ⏺️ Iniciar ahora
                </button>
              )}
            </motion.div>

            <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>📅 Próximas transmisiones</h2>
            <div className="card" style={{ padding: "2.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📅</div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Las transmisiones programadas aparecerán aquí.
              </p>
            </div>
          </div>

          {/* Live chat panel (only when going live) */}
          <AnimatePresence>
            {going && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="card" style={{ display: "flex", flexDirection: "column", height: 520, position: "sticky", top: 76 }}>
                <div style={{ padding: "1rem", borderBottom: "1px solid var(--glass-border)", fontWeight: 700, fontSize: "0.9rem" }}>
                  💬 Chat en Vivo
                  <span className="live-badge" style={{ marginLeft: "0.5rem", fontSize: "0.65rem" }}>EN VIVO</span>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {chatMessages.length === 0 ? (
                    <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "2rem" }}>
                      El chat está vacío. ¡Comparte el enlace con tu familia!
                    </div>
                  ) : chatMessages.map((m, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--gold-glass)", border: "1px solid var(--gold-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: "var(--viva-gold)", flexShrink: 0 }}>
                        {m.name[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--viva-gold)" }}>{m.name} </span>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{m.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "0.75rem", borderTop: "1px solid var(--glass-border)", display: "flex", gap: "0.5rem" }}>
                  <input className="input-viva" value={chatMsg} onChange={e => setChatMsg(e.target.value)}
                    placeholder="Tu mensaje..." style={{ padding: "0.45rem 0.75rem", fontSize: "0.83rem" }}
                    onKeyDown={e => e.key === "Enter" && sendChat()} />
                  <button className="btn-gold" onClick={sendChat} style={{ padding: "0.45rem 0.9rem", fontSize: "0.83rem" }}>→</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Categories */}
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>🎬 Categorías de transmisión</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
            {[
              { icon: "🌹", name: "Homenajes" },
              { icon: "🎵", name: "Serenatas" },
              { icon: "👨‍👩‍👧‍👦", name: "Reuniones familiares" },
              { icon: "🕯️", name: "Velorios digitales" },
              { icon: "📖", name: "Lectura de vida" },
              { icon: "🙏", name: "Misa en vivo" },
            ].map(cat => (
              <div key={cat.name} style={{ background: "var(--viva-card)", border: "1px solid var(--glass-border)", borderRadius: 14, padding: "1.25rem", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--viva-gold)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>{cat.icon}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
