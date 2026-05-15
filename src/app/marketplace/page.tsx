"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppNavbar from "@/components/AppNavbar";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function MarketplacePage() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: "var(--viva-black)" }}>
      <AppNavbar />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginBottom: "0.5rem" }}>
            🛒 <span className="gradient-gold">Marketplace Memorial</span>
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>Envía amor desde cualquier lugar del mundo</p>
        </motion.div>

        {/* Search */}
        <div style={{ marginBottom: "1.5rem" }}>
          <input
            className="input-viva"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Buscar productos y servicios..."
            style={{ maxWidth: 400 }}
          />
        </div>

        {/* Empty state — coming soon */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: "var(--viva-card)", border: "1px solid var(--glass-border)",
            borderRadius: 20, padding: "4rem 2rem", textAlign: "center",
            maxWidth: 600, margin: "0 auto",
          }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            style={{ fontSize: "4rem", marginBottom: "1.5rem" }}
          >
            🛒
          </motion.div>
          <h2 className="font-display" style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--viva-gold)", marginBottom: "0.75rem" }}>
            Marketplace Próximamente
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 440, margin: "0 auto 2rem" }}>
            Flores, velas, serenatas, placas QR de mármol, restauración fotográfica con IA y mucho más.
            Los primeros vendedores ya están en lista de espera.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {[
              { icon: "🌺", name: "Flores y arreglos" },
              { icon: "🕯️", name: "Velas artesanales" },
              { icon: "🎵", name: "Serenatas en vivo" },
              { icon: "📱", name: "Placas QR Memorial" },
              { icon: "🖼️", name: "Restauración IA" },
              { icon: "📖", name: "Libros memoriales" },
            ].map(cat => (
              <div
                key={cat.name}
                style={{
                  background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
                  borderRadius: 14, padding: "1.25rem 1rem", textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>{cat.icon}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>{cat.name}</div>
              </div>
            ))}
          </div>

          {!isAuthenticated ? (
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/register"><button className="btn-gold">🌹 Crear cuenta gratis</button></Link>
              <Link href="/login"><button className="btn-glass">Iniciar sesión</button></Link>
            </div>
          ) : (
            <div style={{
              background: "var(--gold-glass)", border: "1px solid var(--gold-border)",
              borderRadius: 14, padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--text-secondary)",
            }}>
              ✅ Estás en lista para ser notificado cuando el Marketplace abra.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
