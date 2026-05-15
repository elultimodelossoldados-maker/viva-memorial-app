"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AppNavbar from "@/components/AppNavbar";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function MapPage() {
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState<"map" | "list">("map");

  return (
    <div style={{ minHeight: "100vh", background: "var(--viva-black)" }}>
      <AppNavbar />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 className="font-display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 900, marginBottom: "0.25rem" }}>
              🗺️ <span className="gradient-gold">Mapa Memorial</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>Encuentra memoriales cerca de ti</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={() => setView("map")} className={view === "map" ? "btn-gold" : "btn-glass"} style={{ fontSize: "0.83rem" }}>🗺️ Mapa</button>
            <button onClick={() => setView("list")} className={view === "list" ? "btn-gold" : "btn-glass"} style={{ fontSize: "0.83rem" }}>📋 Lista</button>
          </div>
        </motion.div>

        {/* Search */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <input className="input-viva" placeholder="🔍 Buscar cementerio, ciudad o nombre..." style={{ maxWidth: 400 }} />
          <button className="btn-glass" style={{ fontSize: "0.83rem" }}>📍 Mi ubicación</button>
          <button className="btn-glass" style={{ fontSize: "0.83rem" }}>+ Agregar memorial</button>
        </div>

        {/* Map area with empty state */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem" }}>
          <div style={{ position: "relative", background: "var(--viva-dark-2, #0a0a14)", borderRadius: 20, overflow: "hidden", minHeight: 520, border: "1px solid var(--glass-border)" }}>
            {/* Grid background */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0d1117 0%, #0f1a0a 30%, #0a1520 60%, #1a0a1a 100%)" }}>
              {[...Array(8)].map((_, i) => <div key={`h${i}`} style={{ position: "absolute", left: 0, right: 0, top: `${(i+1)*11}%`, height: 1, background: "rgba(255,255,255,0.03)" }} />)}
              {[...Array(10)].map((_, i) => <div key={`v${i}`} style={{ position: "absolute", top: 0, bottom: 0, left: `${(i+1)*9}%`, width: 1, background: "rgba(255,255,255,0.03)" }} />)}
              <div style={{ position: "absolute", top: "40%", left: "10%", width: "40%", height: "35%", background: "rgba(26,140,100,0.06)", borderRadius: "30% 50% 40% 60%", border: "1px solid rgba(26,140,100,0.1)" }} />
              <div style={{ position: "absolute", top: "20%", left: "35%", width: "30%", height: "25%", background: "rgba(10,60,100,0.1)", borderRadius: "40% 30% 50% 40%" }} />
            </div>
            {/* Empty state overlay */}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3 }} style={{ fontSize: "3rem", marginBottom: "1rem" }}>📍</motion.div>
              <h3 style={{ fontWeight: 700, color: "var(--viva-gold)", marginBottom: "0.5rem" }}>El mapa está listo</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: 320, lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Cuando crees memoriales con ubicación geográfica, aparecerán aquí como puntos en el mapa.
              </p>
              {isAuthenticated ? (
                <button className="btn-gold" style={{ fontSize: "0.88rem" }}>+ Crear memorial con ubicación</button>
              ) : (
                <Link href="/register"><button className="btn-gold" style={{ fontSize: "0.88rem" }}>🌹 Registrarse gratis</button></Link>
              )}
            </div>
            {/* Controls */}
            <div style={{ position: "absolute", top: "1rem", right: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {["+", "−", "⊕"].map(c => (
                <button key={c} style={{ width: 36, height: 36, background: "rgba(8,8,16,0.9)", border: "1px solid var(--glass-border)", borderRadius: 8, color: "var(--text-primary)", fontSize: c === "⊕" ? "0.9rem" : "1.2rem", cursor: "pointer" }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Sidebar — empty */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🏛️</div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.4rem", color: "var(--viva-gold)" }}>Cementerios</div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>Los cementerios aparecerán cuando agregues memoriales con ubicación.</p>
            </div>
            <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🛒</div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.4rem", color: "var(--viva-gold)" }}>Servicios Cercanos</div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>Florerías, serenatas y servicios funerarios próximamente.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
