"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { PARENTESCO_OPTIONS, PARENTESCO_FLAT } from "@/lib/data";

const steps = [
  { title: "Tu información", subtitle: "Cuéntanos sobre ti" },
  { title: "Tu familia", subtitle: "Agrega un familiar (opcional)" },
  { title: "Primer memorial", subtitle: "Honra a quien amas (opcional)" },
  { title: "¡Bienvenido a VIVA!", subtitle: "Tu legado comienza aquí" },
];

// ── Parentesco Selector Component ────────────────────────────────────────────
function ParentescoSelector({
  value, onChange,
}: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = search.trim()
    ? PARENTESCO_FLAT.filter(p => p.toLowerCase().includes(search.toLowerCase()))
    : null;

  const select = (val: string) => {
    if (val === "Otro") {
      setCustomMode(true);
      setOpen(false);
    } else {
      onChange(val);
      setOpen(false);
      setSearch("");
      setCustomMode(false);
    }
  };

  const confirmCustom = () => {
    if (customValue.trim()) {
      onChange(customValue.trim());
      setCustomMode(false);
    }
  };

  const skip = () => {
    onChange("");
    setOpen(false);
    setCustomMode(false);
    setSearch("");
  };

  if (customMode) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <label style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
          Escribe el parentesco personalizado
        </label>
        <input
          className="input-viva"
          value={customValue}
          onChange={e => setCustomValue(e.target.value)}
          placeholder="Ej: Compadre, Ahijado, Madrastra..."
          autoFocus
          onKeyDown={e => e.key === "Enter" && confirmCustom()}
        />
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            className="btn-glass"
            onClick={() => { setCustomMode(false); setCustomValue(""); }}
            style={{ flex: 1, fontSize: "0.85rem" }}
          >
            ← Volver
          </button>
          <button
            type="button"
            className="btn-gold"
            onClick={confirmCustom}
            style={{ flex: 2, fontSize: "0.85rem" }}
          >
            Confirmar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        id="parentesco-btn"
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
          borderRadius: 12, padding: "0.75rem 1rem", cursor: "pointer",
          color: value ? "var(--text-primary)" : "var(--text-muted)",
          fontSize: "0.92rem", transition: "border-color 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--viva-gold)")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--glass-border)")}
      >
        <span>{value || "Seleccionar relación familiar..."}</span>
        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{open ? "▲" : "▼"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
              background: "#1a1a2e", border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
              zIndex: 9999, overflow: "hidden", maxHeight: 360, display: "flex", flexDirection: "column",
            }}
          >
            {/* Search */}
            <div style={{ padding: "0.75rem", borderBottom: "1px solid var(--glass-border)" }}>
              <input
                className="input-viva"
                placeholder="🔍 Buscar relación..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
                style={{ fontSize: "0.85rem", padding: "0.5rem 0.75rem" }}
              />
            </div>

            {/* Options */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered ? (
                <div>
                  {filtered.length === 0 ? (
                    <div style={{ padding: "1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      Sin resultados.{" "}
                      <button type="button" onClick={() => select("Otro")} style={{ background: "none", border: "none", color: "var(--viva-gold)", cursor: "pointer", fontSize: "0.85rem" }}>
                        Escribir otro →
                      </button>
                    </div>
                  ) : filtered.map(p => (
                    <div
                      key={p}
                      onClick={() => select(p)}
                      style={{
                        padding: "0.7rem 1rem", cursor: "pointer",
                        color: value === p ? "var(--viva-gold)" : "var(--text-primary)",
                        background: value === p ? "var(--gold-glass)" : "transparent",
                        fontSize: "0.9rem", transition: "background 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--glass-bg)")}
                      onMouseLeave={e => (e.currentTarget.style.background = value === p ? "var(--gold-glass)" : "transparent")}
                    >
                      {value === p && <span style={{ marginRight: 8 }}>✓</span>}{p}
                    </div>
                  ))}
                </div>
              ) : (
                PARENTESCO_OPTIONS.map(group => (
                  <div key={group.group}>
                    <div style={{ padding: "0.4rem 1rem", fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", borderBottom: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.02)" }}>
                      {group.group}
                    </div>
                    {group.items.map(p => (
                      <div
                        key={p}
                        onClick={() => select(p)}
                        style={{
                          padding: "0.65rem 1.25rem", cursor: "pointer",
                          color: value === p ? "var(--viva-gold)" : "var(--text-secondary)",
                          background: value === p ? "var(--gold-glass)" : "transparent",
                          fontSize: "0.88rem", transition: "background 0.15s",
                          display: "flex", alignItems: "center", gap: 8,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--glass-bg)")}
                        onMouseLeave={e => (e.currentTarget.style.background = value === p ? "var(--gold-glass)" : "transparent")}
                      >
                        {value === p && <span style={{ color: "var(--viva-gold)" }}>✓</span>}
                        {p}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            {/* Footer actions */}
            <div style={{ borderTop: "1px solid var(--glass-border)", display: "flex" }}>
              <button
                type="button"
                onClick={skip}
                style={{
                  flex: 1, padding: "0.7rem", background: "none", border: "none",
                  color: "var(--text-muted)", cursor: "pointer", fontSize: "0.82rem",
                  borderRight: "1px solid var(--glass-border)", transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                Omitir
              </button>
              <button
                type="button"
                onClick={() => select("Otro")}
                style={{
                  flex: 1, padding: "0.7rem", background: "none", border: "none",
                  color: "var(--viva-gold)", cursor: "pointer", fontSize: "0.82rem",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--gold-glass)")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                ✏️ Otro (escribir)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Register Page ────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    familyName: "", familyRelation: "",
    memorialName: "", memorialBorn: "", memorialDied: "",
  });
  const { register } = useAuth();
  const router = useRouter();

  const updateForm = (key: string, val: string) => {
    setError("");
    setForm(f => ({ ...f, [key]: val }));
  };

  const handleStep0 = () => {
    if (!form.name.trim()) return setError("Ingresa tu nombre completo.");
    if (!form.email.includes("@")) return setError("Ingresa un correo válido.");
    if (form.password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    if (form.password !== form.confirmPassword) return setError("Las contraseñas no coinciden.");
    setError("");
    setStep(1);
  };

  const handleFinish = async () => {
    setLoading(true);
    const username = form.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') + '_' + Math.floor(Math.random() * 9000 + 1000);
    const result = await register({
      name: form.name,
      username,
      email: form.email,
      password: form.password,
      familyName: form.familyName || undefined,
      familyRelation: form.familyRelation || undefined,
      memorialName: form.memorialName || form.familyName || undefined,
      memorialBorn: form.memorialBorn || undefined,
      memorialDied: form.memorialDied || undefined,
    });
    setLoading(false);
    if (result.ok) {
      router.push("/feed");
    } else {
      setError(result.error || "Error al crear la cuenta.");
      setStep(0);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--viva-black)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.5rem", position: "relative", overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{ position: "fixed", top: "10%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(107,47,160,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "10%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 500, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span className="font-display" style={{ fontSize: "2rem", color: "var(--viva-gold)", fontWeight: 900 }}>🌹 VIVA</span>
          </Link>
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "2rem" }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= step ? "var(--viva-gold)" : "var(--glass-border)",
              transition: "background 0.4s ease",
            }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.28 }}
            style={{ background: "var(--viva-card)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: "2.5rem", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
          >
            <div style={{ marginBottom: "0.25rem", fontSize: "0.8rem", color: "var(--viva-gold)", letterSpacing: "0.1em" }}>
              Paso {step + 1} de {steps.length}
            </div>
            <h1 style={{ fontWeight: 700, fontSize: "1.4rem", marginBottom: "0.25rem" }}>{steps[step].title}</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>{steps[step].subtitle}</p>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ background: "rgba(212,69,107,0.1)", border: "1px solid rgba(212,69,107,0.3)", borderRadius: 10, padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.82rem", color: "#f48ca8" }}
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Step 0: Datos personales ── */}
            {step === 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Nombre completo *</label>
                  <input className="input-viva" value={form.name} onChange={e => updateForm("name", e.target.value)} placeholder="Ej: María García López" autoFocus />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Correo electrónico *</label>
                  <input className="input-viva" type="email" value={form.email} onChange={e => updateForm("email", e.target.value)} placeholder="tu@correo.com" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Contraseña * <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(mín. 6 caracteres)</span></label>
                  <input className="input-viva" type="password" value={form.password} onChange={e => updateForm("password", e.target.value)} placeholder="••••••••" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Confirmar contraseña *</label>
                  <input className="input-viva" type="password" value={form.confirmPassword} onChange={e => updateForm("confirmPassword", e.target.value)} placeholder="••••••••"
                    onKeyDown={e => e.key === "Enter" && handleStep0()} />
                </div>
                <button className="btn-gold" onClick={handleStep0} style={{ fontSize: "0.95rem", padding: "0.9rem", marginTop: "0.5rem" }}>
                  Continuar →
                </button>
              </div>
            )}

            {/* ── Step 1: Familiar ── */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{
                  background: "var(--gold-glass)", border: "1px solid var(--gold-border)",
                  borderRadius: 12, padding: "0.85rem 1rem", fontSize: "0.83rem", color: "var(--text-secondary)",
                }}>
                  🌳 Agrega un familiar para comenzar tu árbol genealógico. Puedes hacerlo después también.
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Nombre del familiar</label>
                  <input
                    className="input-viva"
                    value={form.familyName}
                    onChange={e => updateForm("familyName", e.target.value)}
                    placeholder="Ej: Rosa García Morales"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    ¿Cuál es su relación contigo?
                  </label>
                  <ParentescoSelector
                    value={form.familyRelation}
                    onChange={v => updateForm("familyRelation", v)}
                  />
                  {form.familyRelation && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ marginTop: "0.4rem", fontSize: "0.78rem", color: "var(--viva-gold)" }}
                    >
                      ✓ Seleccionado: <strong>{form.familyRelation}</strong>
                    </motion.div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button className="btn-glass" onClick={() => setStep(0)} style={{ flex: 1, fontSize: "0.9rem" }}>← Atrás</button>
                  <button className="btn-gold" onClick={() => setStep(2)} style={{ flex: 2, fontSize: "0.9rem" }}>Continuar →</button>
                </div>
                <button
                  type="button"
                  onClick={() => { updateForm("familyName", ""); updateForm("familyRelation", ""); setStep(2); }}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.83rem", cursor: "pointer", textDecoration: "underline" }}
                >
                  Omitir por ahora
                </button>
              </div>
            )}

            {/* ── Step 2: Memorial ── */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{
                  background: "rgba(212,69,107,0.05)", border: "1px solid rgba(212,69,107,0.2)",
                  borderRadius: 12, padding: "0.85rem 1rem", fontSize: "0.83rem", color: "var(--text-secondary)",
                }}>
                  🕯️ Crea el primer memorial de tu familia. Honra a quien partió con un espacio eterno.
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Nombre del memorial</label>
                  <input
                    className="input-viva"
                    value={form.memorialName}
                    onChange={e => updateForm("memorialName", e.target.value)}
                    placeholder={form.familyName || "Nombre completo de quien quieres honrar"}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Fecha de nacimiento</label>
                    <input className="input-viva" type="date" value={form.memorialBorn} onChange={e => updateForm("memorialBorn", e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Fecha de partida</label>
                    <input className="input-viva" type="date" value={form.memorialDied} onChange={e => updateForm("memorialDied", e.target.value)} />
                  </div>
                </div>
                <div style={{ background: "var(--gold-glass)", border: "1px solid var(--gold-border)", borderRadius: 12, padding: "0.85rem 1rem", fontSize: "0.83rem", color: "var(--text-secondary)" }}>
                  💡 Podrás agregar fotos, canciones e historia de vida después del registro.
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button className="btn-glass" onClick={() => setStep(1)} style={{ flex: 1, fontSize: "0.9rem" }}>← Atrás</button>
                  <button className="btn-gold" onClick={() => setStep(3)} style={{ flex: 2, fontSize: "0.9rem" }}>Continuar 🌹</button>
                </div>
                <button
                  type="button"
                  onClick={() => { updateForm("memorialName", ""); setStep(3); }}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.83rem", cursor: "pointer", textDecoration: "underline" }}
                >
                  Omitir por ahora
                </button>
              </div>
            )}

            {/* ── Step 3: Bienvenida ── */}
            {step === 3 && (
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center" }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }} style={{ fontSize: "4rem" }}>
                  🌹
                </motion.div>
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "0.5rem" }}>
                    ¡Bienvenido a <span className="gradient-gold">VIVA</span>, {form.name.split(" ")[0]}!
                  </h2>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.6 }}>
                    Tu cuenta está lista. Tu legado familiar comienza hoy.
                    {(form.memorialName || form.familyName) && (
                      <> El memorial de <strong>{form.memorialName || form.familyName}</strong> será tu primer espacio eterno.</>
                    )}
                  </p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                  {["Feed personal", "Árbol genealógico", "Marketplace", "Mapa memorial"].map(f => (
                    <span key={f} className="tag tag-gold">{f}</span>
                  ))}
                </div>
                <button
                  className="btn-gold"
                  onClick={handleFinish}
                  disabled={loading}
                  style={{ fontSize: "1rem", padding: "0.9rem 2.5rem", width: "100%", opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                      <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ display: "inline-block" }}>⟳</motion.span>
                      Creando tu cuenta...
                    </span>
                  ) : "✨ Entrar a VIVA"}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" style={{ color: "var(--viva-gold)", textDecoration: "none", fontWeight: 600 }}>
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
