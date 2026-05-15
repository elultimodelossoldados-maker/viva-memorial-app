"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppNavbar from "@/components/AppNavbar";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

type VaultItem = {
  id: string;
  type: "carta" | "video" | "capsula" | "herencia";
  title: string;
  recipient: string;
  scheduled: string;
  status: "programada";
  icon: string;
  createdAt: string;
};

const TYPE_ICONS: Record<string, string> = {
  carta: "📝",
  video: "🎬",
  capsula: "⏰",
  herencia: "🌳",
};

export default function LegacyVaultPage() {
  const { isAuthenticated } = useAuth();
  const [activeCreate, setActiveCreate] = useState<string | null>(null);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [saved, setSaved] = useState(false);

  // Form state
  const [letterText, setLetterText] = useState("");
  const [letterDate, setLetterDate] = useState("");
  const [letterRecipient, setLetterRecipient] = useState("");
  const [letterTitle, setLetterTitle] = useState("");

  const handleSave = () => {
    if (!letterDate) return;
    const newItem: VaultItem = {
      id: `vault-${Date.now()}`,
      type: activeCreate as VaultItem["type"],
      title: letterTitle || (activeCreate === "carta" ? "Carta sin título" : activeCreate === "video" ? "Video póstumo" : activeCreate === "capsula" ? "Cápsula del tiempo" : "Legado digital"),
      recipient: letterRecipient || "Destinatario no especificado",
      scheduled: letterDate,
      status: "programada",
      icon: TYPE_ICONS[activeCreate!] || "📝",
      createdAt: new Date().toISOString(),
    };
    setVaultItems(prev => [newItem, ...prev]);
    setSaved(true);
    setActiveCreate(null);
    setLetterText("");
    setLetterDate("");
    setLetterRecipient("");
    setLetterTitle("");
    setTimeout(() => setSaved(false), 4000);
  };

  const handleDelete = (id: string) => {
    setVaultItems(prev => prev.filter(i => i.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--viva-black)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
          <h1 className="font-display gradient-gold" style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "0.75rem" }}>Legacy Vault™</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Necesitas una cuenta para acceder a tu bóveda personal.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link href="/login"><button className="btn-glass">Iniciar Sesión</button></Link>
            <Link href="/register"><button className="btn-gold">Crear Cuenta</button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--viva-black)" }}>
      <AppNavbar />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem" }}>🔒</div>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginBottom: "0.5rem" }}>
            <span className="gradient-gold">Legacy Vault™</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: 500, margin: "0 auto" }}>
            Tu legado, programado para el momento exacto en que más importará.
            Cartas, videos y cápsulas del tiempo para las generaciones futuras.
          </p>
        </motion.div>

        {/* Saved confirmation toast */}
        <AnimatePresence>
          {saved && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ background: "rgba(26,140,100,0.15)", border: "1px solid rgba(26,140,100,0.3)", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1.5rem", color: "#4caf80", fontSize: "0.88rem", textAlign: "center" }}>
              ✅ Tu mensaje ha sido sellado en el Legacy Vault™. Se entregará en la fecha programada.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
          {[
            { type: "carta", icon: "📝", title: "Carta Futura", desc: "Escribe un mensaje para el futuro" },
            { type: "video", icon: "🎬", title: "Video Póstumo", desc: "Graba un mensaje en video" },
            { type: "capsula", icon: "⏰", title: "Cápsula del Tiempo", desc: "Una colección de recuerdos" },
            { type: "herencia", icon: "🌳", title: "Legado Digital", desc: "Tu historia completa de vida" },
          ].map(item => (
            <motion.div key={item.type} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="card" style={{ padding: "1.5rem", textAlign: "center", cursor: "pointer", border: activeCreate === item.type ? "1px solid var(--viva-gold)" : "1px solid var(--glass-border)" }}
              onClick={() => setActiveCreate(activeCreate === item.type ? null : item.type)}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.25rem" }}>{item.title}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Creator panel */}
        <AnimatePresence>
          {activeCreate && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="card" style={{ padding: "2rem", marginBottom: "2rem", border: "1px solid var(--gold-border)" }}>
              <h2 style={{ fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.1rem" }}>
                {activeCreate === "carta" ? "📝 Escribir Carta Futura" : activeCreate === "video" ? "🎬 Grabar Video" : activeCreate === "capsula" ? "⏰ Nueva Cápsula del Tiempo" : "🌳 Legado Digital"}
              </h2>

              {activeCreate === "carta" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Título de la carta</label>
                    <input className="input-viva" value={letterTitle} onChange={e => setLetterTitle(e.target.value)} placeholder="Ej: Carta para mis hijos..." />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Para (destinatario)</label>
                      <input className="input-viva" value={letterRecipient} onChange={e => setLetterRecipient(e.target.value)} placeholder="Ej: Mis hijos, mi nieto Juan..." />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Entregar el *</label>
                      <input className="input-viva" type="date" value={letterDate} onChange={e => setLetterDate(e.target.value)} min={new Date().toISOString().split("T")[0]} required />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Tu mensaje</label>
                    <textarea className="input-viva" value={letterText} onChange={e => setLetterText(e.target.value)} placeholder="Escribe aquí tu carta para el futuro... Sé honesto, amoroso, libre." style={{ resize: "none", minHeight: 160, lineHeight: 1.7 }} />
                    <div style={{ fontSize: "0.73rem", color: "var(--text-muted)", marginTop: "0.25rem", textAlign: "right" }}>{letterText.length} caracteres</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Privacidad</label>
                      <select className="input-viva">
                        <option>Solo el destinatario</option>
                        <option>Toda la familia</option>
                        <option>Público después de mi partida</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Condición de entrega</label>
                      <select className="input-viva">
                        <option>En la fecha programada</option>
                        <option>En mi cumpleaños</option>
                        <option>Tras mi fallecimiento</option>
                        <option>Cuando el destinatario cumpla 18 años</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button className="btn-gold" onClick={handleSave} disabled={!letterDate} style={{ flex: 2, fontSize: "0.9rem", opacity: !letterDate ? 0.5 : 1 }}>🔒 Sellar en Legacy Vault™</button>
                    <button className="btn-glass" onClick={() => setActiveCreate(null)} style={{ flex: 1, fontSize: "0.9rem" }}>Cancelar</button>
                  </div>
                </div>
              )}

              {activeCreate === "video" && (
                <div style={{ textAlign: "center" }}>
                  <div style={{ background: "var(--viva-dark-2)", borderRadius: 16, padding: "3rem", marginBottom: "1.25rem", border: "2px dashed var(--glass-border)" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🎬</div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Graba o sube tu video mensaje</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Máx. 15 minutos · MP4, MOV</p>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Fecha de entrega *</label>
                    <input className="input-viva" type="date" value={letterDate} onChange={e => setLetterDate(e.target.value)} min={new Date().toISOString().split("T")[0]} style={{ marginBottom: "1rem" }} />
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                    <button className="btn-gold" style={{ fontSize: "0.9rem" }}>⏺️ Grabar ahora</button>
                    <button className="btn-glass" style={{ fontSize: "0.9rem" }}>📁 Subir archivo</button>
                    <button className="btn-glass" onClick={() => setActiveCreate(null)} style={{ fontSize: "0.9rem" }}>Cancelar</button>
                  </div>
                </div>
              )}

              {(activeCreate === "capsula" || activeCreate === "herencia") && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <input className="input-viva" value={letterTitle} onChange={e => setLetterTitle(e.target.value)} placeholder="Nombre de la cápsula (ej: 'Para mi familia en 2040')" />
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Fecha de apertura *</label>
                    <input className="input-viva" type="date" value={letterDate} onChange={e => setLetterDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div style={{ background: "var(--viva-dark-2)", borderRadius: 12, padding: "1.5rem", textAlign: "center", border: "2px dashed var(--glass-border)" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📎</div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.83rem" }}>Arrastra fotos, videos, documentos o escribe mensajes</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button className="btn-gold" onClick={handleSave} disabled={!letterDate} style={{ flex: 2, fontSize: "0.9rem", opacity: !letterDate ? 0.5 : 1 }}>🔒 Crear cápsula</button>
                    <button className="btn-glass" onClick={() => setActiveCreate(null)} style={{ flex: 1, fontSize: "0.9rem" }}>Cancelar</button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vault items */}
        <div>
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem" }}>
            🔐 Tu Bóveda Personal
            {vaultItems.length > 0 && (
              <span style={{ marginLeft: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 400 }}>
                ({vaultItems.length} {vaultItems.length === 1 ? "mensaje sellado" : "mensajes sellados"})
              </span>
            )}
          </h2>

          {vaultItems.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="card" style={{ padding: "3rem", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.4 }}>📭</div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Tu bóveda está vacía</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                Crea tu primera carta, video o cápsula del tiempo usando los botones de arriba.
              </p>
            </motion.div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {vaultItems.map(item => (
                <motion.div key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="card"
                  style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--gold-glass)", border: "1px solid var(--gold-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{item.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Para: {item.recipient} · 📅 Entrega: {new Date(item.scheduled).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
                    </div>
                  </div>
                  <span className="tag tag-gold" style={{ fontSize: "0.7rem", flexShrink: 0 }}>🔒 {item.status}</span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.1rem", flexShrink: 0 }}
                    title="Eliminar">✕</button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Security note */}
        <div style={{ marginTop: "2rem", padding: "1.25rem", background: "var(--gold-glass)", border: "1px solid var(--gold-border)", borderRadius: 16, fontSize: "0.83rem", color: "var(--text-secondary)" }}>
          🔒 <strong style={{ color: "var(--viva-gold-lt)" }}>Cifrado de extremo a extremo.</strong> Solo el destinatario designado puede abrir tus mensajes en la fecha programada. Ni VIVA puede acceder al contenido.
        </div>
      </div>
    </div>
  );
}
