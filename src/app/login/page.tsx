"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      router.push("/feed");
    } else {
      setError(result.error || "Correo o contraseña incorrectos.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--viva-black)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.5rem", position: "relative", overflow: "hidden",
    }}>
      {/* Background orbs */}
      <div style={{ position: "fixed", top: "15%", left: "20%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "15%", right: "20%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,69,107,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "2.5rem" }}>🌹</span>
              <span className="font-display" style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--viva-gold)", letterSpacing: "0.12em" }}>VIVA</span>
            </div>
          </Link>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>La Red Social Memorial del Mundo</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ background: "var(--viva-card)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: "2.5rem", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
        >
          <h1 style={{ fontWeight: 700, fontSize: "1.4rem", marginBottom: "0.25rem", color: "var(--text-primary)" }}>
            Bienvenido de vuelta 🌹
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>
            Inicia sesión para continuar con tu legado
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem", fontWeight: 500 }}>
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                className="input-viva"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                autoComplete="email"
                autoFocus
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem", fontWeight: 500 }}>
                Contraseña
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  className="input-viva"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1rem" }}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ background: "rgba(212,69,107,0.1)", border: "1px solid rgba(212,69,107,0.3)", borderRadius: 10, padding: "0.75rem 1rem", fontSize: "0.82rem", color: "#f48ca8" }}
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="btn-gold"
              disabled={loading}
              style={{ fontSize: "1rem", padding: "0.9rem", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ display: "inline-block" }}>⟳</motion.span>
                  Verificando...
                </span>
              ) : "Iniciar Sesión 🌹"}
            </button>
          </form>

          <div className="divider" />

          <div style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            ¿No tienes cuenta?{" "}
            <Link href="/register" style={{ color: "var(--viva-gold)", textDecoration: "none", fontWeight: 600 }}>
              Crear cuenta gratis
            </Link>
          </div>
        </motion.div>

        <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
          Al iniciar sesión aceptas nuestros{" "}
          <span style={{ color: "var(--viva-gold)", cursor: "pointer" }}>Términos de Uso</span>
          {" "}y{" "}
          <span style={{ color: "var(--viva-gold)", cursor: "pointer" }}>Política de Privacidad</span>
        </div>
      </div>
    </div>
  );
}
