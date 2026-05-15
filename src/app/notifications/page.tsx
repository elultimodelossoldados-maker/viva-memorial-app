"use client";
import { motion } from "framer-motion";
import AppNavbar from "@/components/AppNavbar";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: "100vh", background: "var(--viva-black)" }}>
      <AppNavbar />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 900, marginBottom: "0.5rem" }}>
            🔔 <span className="gradient-gold">Notificaciones</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Mantente al tanto de lo que pasa en tu red</p>
        </motion.div>

        {!isAuthenticated ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: "var(--viva-card)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: "4rem 2rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔔</div>
            <h3 style={{ fontWeight: 700, color: "var(--viva-gold)", marginBottom: "0.5rem" }}>Inicia sesión para ver tus notificaciones</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>Recibe alertas cuando alguien adopta un altar, deja una ofrenda o te menciona.</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/login"><button className="btn-gold">🌹 Iniciar Sesión</button></Link>
              <Link href="/register"><button className="btn-glass">Crear cuenta gratis</button></Link>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: "var(--viva-card)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: "4rem 2rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <h3 style={{ fontWeight: 700, color: "var(--viva-gold)", marginBottom: "0.5rem" }}>Todo al día</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>No tienes notificaciones pendientes. Cuando alguien interactúe con tus Altares, aparecerá aquí.</p>
            <Link href="/feed"><button className="btn-gold">🏠 Ir al Feed</button></Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
