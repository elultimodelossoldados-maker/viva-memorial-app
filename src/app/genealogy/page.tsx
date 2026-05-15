"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppNavbar from "@/components/AppNavbar";
import { useAuth, FamilyMember } from "@/lib/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PARENTESCO_OPTIONS, PARENTESCO_FLAT } from "@/lib/data";
import LocationPicker from "@/components/LocationPicker";
import { formatLocation } from "@/lib/locations";

const ESTADOS_MEXICO = [
  "Aguascalientes","Baja California","Baja California Sur","Campeche","Chiapas",
  "Chihuahua","Ciudad de México","Coahuila","Colima","Durango",
  "Estado de México","Guanajuato","Guerrero","Hidalgo","Jalisco",
  "Michoacán","Morelos","Nayarit","Nuevo León","Oaxaca",
  "Puebla","Querétaro","Quintana Roo","San Luis Potosí","Sinaloa",
  "Sonora","Tabasco","Tamaulipas","Tlaxcala","Veracruz",
  "Yucatán","Zacatecas"
];

// ── Add Member Modal ──────────────────────────────────────────────────────────
function AddMemberModal({ onSave, onClose }: {
  onSave: (data: Omit<FamilyMember, "id" | "addedAt">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: "", relation: "", born: "", died: "", pais: "", estado: "", municipio: "", living: true });
  const [search, setSearch] = useState("");
  const [showRelation, setShowRelation] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customVal, setCustomVal] = useState("");
  const [error, setError] = useState("");

  const filtered = search.trim() ? PARENTESCO_FLAT.filter(p => p.toLowerCase().includes(search.toLowerCase())) : null;

  const selectRelation = (val: string) => {
    if (val === "Otro") { setCustomMode(true); setShowRelation(false); return; }
    setForm(f => ({ ...f, relation: val }));
    setShowRelation(false); setSearch("");
  };

  const handleSave = () => {
    if (!form.name.trim()) { setError("Ingresa el nombre del familiar."); return; }
    if (!form.relation.trim()) { setError("Selecciona o escribe la relación."); return; }
    if (!form.living && !form.died.trim()) {
      setError("Para crear un Altar, necesitas el año de fallecimiento."); return;
    }
    onSave({
      name: form.name.trim(), relation: form.relation.trim(),
      born: form.born || undefined,
      died: form.living ? undefined : form.died,
      estado: form.estado || undefined,
      pais: form.pais || undefined,
      municipio: form.municipio || undefined,
      living: form.living,
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
        onClick={e => e.stopPropagation()}
        style={{ background: "var(--viva-card)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: "2rem", width: "100%", maxWidth: 500, boxShadow: "var(--shadow-modal)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>🌳 Agregar familiar al árbol</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.3rem" }}>✕</button>
        </div>

        {error && (
          <div style={{ background: "rgba(212,69,107,0.1)", border: "1px solid rgba(212,69,107,0.3)", borderRadius: 10, padding: "0.6rem 1rem", marginBottom: "1rem", fontSize: "0.82rem", color: "#f48ca8" }}>⚠️ {error}</div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Name */}
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Nombre completo *</label>
            <input className="input-viva" value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setError(""); }} placeholder="Ej: María García López" autoFocus />
          </div>

          {/* Relation */}
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Relación contigo *</label>
            {customMode ? (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input className="input-viva" value={customVal} onChange={e => setCustomVal(e.target.value)} placeholder="Ej: Compadre, Ahijado..." autoFocus />
                <button className="btn-gold" style={{ fontSize: "0.82rem", padding: "0.5rem 1rem", flexShrink: 0 }}
                  onClick={() => { if (customVal.trim()) { setForm(f => ({ ...f, relation: customVal.trim() })); setCustomMode(false); setCustomVal(""); } }}>OK</button>
              </div>
            ) : (
              <div style={{ position: "relative" }}>
                <button type="button" onClick={() => { setShowRelation(o => !o); setError(""); }}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 12, padding: "0.75rem 1rem", cursor: "pointer", color: form.relation ? "var(--text-primary)" : "var(--text-muted)", fontSize: "0.9rem" }}>
                  <span>{form.relation || "Seleccionar relación..."}</span>
                  <span style={{ fontSize: "0.75rem" }}>{showRelation ? "▲" : "▼"}</span>
                </button>
                <AnimatePresence>
                  {showRelation && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#1a1a2e", border: "1px solid rgba(201,168,76,0.35)", borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.7)", zIndex: 9999, maxHeight: 260, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                      <div style={{ padding: "0.6rem" }}>
                        <input className="input-viva" placeholder="🔍 Buscar..." value={search} onChange={e => setSearch(e.target.value)} autoFocus style={{ fontSize: "0.83rem", padding: "0.45rem 0.75rem" }} />
                      </div>
                      <div style={{ overflowY: "auto", flex: 1 }}>
                        {(filtered ?? PARENTESCO_OPTIONS.flatMap(g => g.items)).map(p => (
                          <div key={p} onClick={() => selectRelation(p)}
                            style={{ padding: "0.6rem 1rem", cursor: "pointer", fontSize: "0.88rem", color: form.relation === p ? "#c9a84c" : "#d0c8b8", background: form.relation === p ? "rgba(201,168,76,0.1)" : "transparent", transition: "background 0.15s" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                            onMouseLeave={e => (e.currentTarget.style.background = form.relation === p ? "rgba(201,168,76,0.1)" : "transparent")}>
                            {form.relation === p ? "✓ " : ""}{p}
                          </div>
                        ))}
                      </div>
                      <div style={{ borderTop: "1px solid var(--glass-border)", display: "flex" }}>
                        <button type="button" onClick={() => { setForm(f => ({ ...f, relation: "" })); setShowRelation(false); }} style={{ flex: 1, padding: "0.6rem", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.8rem" }}>Omitir</button>
                        <button type="button" onClick={() => selectRelation("Otro")} style={{ flex: 1, padding: "0.6rem", background: "none", border: "none", color: "var(--viva-gold)", cursor: "pointer", fontSize: "0.8rem" }}>✏️ Otro</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Living toggle */}
          <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input type="checkbox" checked={form.living} onChange={e => setForm(f => ({ ...f, living: e.target.checked }))} />
            Persona viva
          </label>

          {/* Birth date */}
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Año de nacimiento {!form.living && "*"}</label>
            <input className="input-viva" type="number" min="1850" max={new Date().getFullYear()} value={form.born} onChange={e => setForm(f => ({ ...f, born: e.target.value }))} placeholder="Ej: 1945" />
          </div>

          {/* Deceased fields */}
          {!form.living && (
            <>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", color: "var(--viva-gold)", marginBottom: "0.4rem" }}>⚰️ Año de fallecimiento *</label>
                <input className="input-viva" type="number" min="1850" max={new Date().getFullYear()} value={form.died} onChange={e => setForm(f => ({ ...f, died: e.target.value }))} placeholder="Ej: 2020" style={{ borderColor: "var(--gold-border)" }} />
              </div>
              <div style={{ background: "rgba(245,166,35,0.05)", borderRadius: 14, padding: "1rem", border: "1px solid var(--gold-border)" }}>
                <p style={{ fontSize: "0.82rem", color: "var(--viva-gold)", marginBottom: "0.75rem", fontWeight: 600 }}>📍 Lugar donde descansa *</p>
                <LocationPicker
                  pais={form.pais}
                  estado={form.estado}
                  municipio={form.municipio}
                  onChange={(field, value) => {
                    if (field === "pais") setForm(f => ({ ...f, pais: value, estado: "", municipio: "" }));
                    else if (field === "estado") setForm(f => ({ ...f, estado: value, municipio: "" }));
                    else setForm(f => ({ ...f, municipio: value }));
                  }}
                  required
                  labelColor="var(--viva-gold-lt)"
                />
              </div>
              <div style={{ background: "rgba(245,166,35,0.06)", border: "1px solid var(--gold-border)", borderRadius: 12, padding: "0.75rem 1rem", fontSize: "0.8rem", color: "var(--viva-gold-lt)" }}>
                🕯️ Al guardar, se creará o enlazará automáticamente el <strong>Altar Digital</strong> de este familiar.
              </div>
            </>
          )}

          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
            <button className="btn-glass" onClick={onClose} style={{ flex: 1, fontSize: "0.9rem" }}>Cancelar</button>
            <button className="btn-gold" onClick={handleSave} style={{ flex: 2, fontSize: "0.9rem" }} disabled={!form.name.trim()}>
              {form.living ? "🌳 Agregar al árbol" : "🕯️ Crear Altar"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Family Node Card ──────────────────────────────────────────────────────────
function FamilyNode({ member }: { member: FamilyMember }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
    >
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "var(--gold-glass)", border: "2px solid var(--viva-gold)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.6rem", boxShadow: "0 0 20px rgba(201,168,76,0.15)",
      }}>
        {member.name.charAt(0).toUpperCase()}
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: 700, fontSize: "0.82rem", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.name.split(" ")[0]}</div>
        <div style={{ fontSize: "0.68rem", color: "var(--viva-gold)" }}>{member.relation}</div>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function GenealogyPage() {
  const { isAuthenticated, user, getFamilyMembers, addFamilyMember } = useAuth();
  const router = useRouter();
  const familyMembers = isAuthenticated ? getFamilyMembers() : [];
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [savedToast, setSavedToast] = useState("");

  const filtered = search.trim()
    ? familyMembers.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.relation.toLowerCase().includes(search.toLowerCase()))
    : familyMembers;

  const handleSave = async (data: Omit<FamilyMember, "id" | "addedAt">) => {
    const ok = await addFamilyMember(data);
    setShowAddModal(false);
    if (ok) {
      setSavedToast(`✅ ${data.name} agregado al árbol`);
      setTimeout(() => setSavedToast(""), 3500);
    } else {
      setSavedToast("⚠️ No se pudo agregar el familiar");
      setTimeout(() => setSavedToast(""), 3500);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--viva-black)" }}>
      <AppNavbar />
      <AnimatePresence>
        {showAddModal && <AddMemberModal onSave={handleSave} onClose={() => setShowAddModal(false)} />}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {savedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", top: 72, left: "50%", transform: "translateX(-50%)", background: "rgba(26,140,100,0.9)", border: "1px solid rgba(26,140,100,0.5)", borderRadius: 12, padding: "0.6rem 1.5rem", fontSize: "0.85rem", color: "#fff", zIndex: 300, backdropFilter: "blur(16px)", whiteSpace: "nowrap" }}
          >
            ✅ {savedToast}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginBottom: "0.5rem" }}>
            🌳 <span className="gradient-gold">Árbol Genealógico</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            {user ? `Árbol de ${user.name.split(" ")[0]} · ${familyMembers.length} ${familyMembers.length === 1 ? "familiar" : "familiares"}` : "Construye el legado de tu familia"}
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            {familyMembers.length > 0 && (
              <input
                className="input-viva"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="🔍 Buscar familiar..."
                style={{ maxWidth: 240 }}
              />
            )}
            <button className="btn-gold" style={{ fontSize: "0.85rem" }} onClick={() => setShowAddModal(true)}>+ Agregar familiar</button>
            <button className="btn-glass" style={{ fontSize: "0.85rem" }}>📥 Exportar PDF</button>
            <button className="btn-glass" style={{ fontSize: "0.85rem" }}>🔗 Compartir árbol</button>
          </div>
        </motion.div>

        {/* Empty state */}
        {familyMembers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: "var(--viva-card)", border: "1px solid var(--glass-border)",
              borderRadius: 20, padding: "4rem 2rem", textAlign: "center",
              maxWidth: 680, margin: "0 auto",
            }}
          >
            {/* Visual tree placeholder */}
            <div style={{ position: "relative", height: 200, marginBottom: "2rem" }}>
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%", border: "3px dashed var(--viva-gold)",
                  background: "var(--gold-glass)", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "2rem", cursor: "pointer",
                }} onClick={() => setShowAddModal(true)}>+</div>
                <div style={{ fontSize: "0.72rem", color: "var(--viva-gold)", marginTop: "0.4rem", textAlign: "center" }}>Tú</div>
              </div>
              <div style={{ position: "absolute", top: 75, left: "50%", width: 2, height: 40, background: "var(--gold-border)", transform: "translateX(-50%)" }} />
              <div style={{ position: "absolute", top: 115, left: "50%", transform: "translateX(-50%)", display: "flex", gap: "3rem" }}>
                {["Padre", "Madre"].map((label) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 2, height: 20, background: "var(--gold-border)" }} />
                    <div
                      onClick={() => setShowAddModal(true)}
                      style={{
                        width: 58, height: 58, borderRadius: "50%", border: "2px dashed var(--glass-border)",
                        background: "var(--glass-bg)", display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "border-color 0.2s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--viva-gold)")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--glass-border)")}
                    >
                      <span style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>+</span>
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <h3 style={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--viva-gold)", marginBottom: "0.5rem" }}>
              Tu árbol está esperando
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.6, maxWidth: 420, margin: "0 auto 2rem" }}>
              Agrega el primer familiar y comienza a conectar generaciones. Cada nodo puede tener su propio memorial eterno.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-gold" style={{ fontSize: "0.92rem", padding: "0.75rem 2rem" }} onClick={() => setShowAddModal(true)}>
                🌳 Agregar primer familiar
              </button>
              {!isAuthenticated && (
                <Link href="/register">
                  <button className="btn-glass" style={{ fontSize: "0.92rem" }}>Crear cuenta gratis</button>
                </Link>
              )}
            </div>
          </motion.div>
        )}

        {/* Family tree with real members */}
        {familyMembers.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* User root node */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "var(--gold-glass)", border: "3px solid var(--viva-gold)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.8rem", boxShadow: "var(--shadow-gold)",
              }}>
                {user?.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", marginTop: "0.4rem" }}>{user?.name?.split(" ")[0]}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--viva-gold)" }}>Tú</div>
              <div style={{ width: 2, height: 30, background: "var(--gold-border)", margin: "0.5rem 0" }} />
            </div>

            {/* Family members grid */}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "2rem",
              justifyContent: "center", background: "var(--viva-card)",
              border: "1px solid var(--glass-border)", borderRadius: 20,
              padding: "2.5rem",
            }}>
              {filtered.map(m => (
                <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: m.died ? "rgba(255,157,0,0.1)" : "var(--gold-glass)", border: `2px solid ${m.died ? "var(--altar-marigold)" : "var(--viva-gold)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", boxShadow: "0 0 20px rgba(201,168,76,0.15)" }}>
                      {m.died ? "🕯️" : m.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.82rem", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name.split(" ")[0]}</div>
                      <div style={{ fontSize: "0.68rem", color: "var(--viva-gold)" }}>{m.relation}</div>
                      {m.altarId && (
                        <Link href={`/altar/${m.altarId}`} style={{ textDecoration: "none" }}>
                          <div style={{ fontSize: "0.65rem", color: "var(--altar-marigold)", marginTop: "0.2rem", cursor: "pointer" }}>Ver Altar →</div>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}
              {/* Add more node */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}
                onClick={() => setShowAddModal(true)}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  border: "2px dashed var(--glass-border)", background: "var(--glass-bg)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem", transition: "all 0.2s",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "var(--viva-gold)";
                    (e.currentTarget as HTMLDivElement).style.background = "var(--gold-glass)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "var(--glass-border)";
                    (e.currentTarget as HTMLDivElement).style.background = "var(--glass-bg)";
                  }}
                >+</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Agregar</div>
              </div>
            </div>

            {/* Legend / stats */}
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
              <div className="card" style={{ padding: "0.75rem 1.5rem", textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: "1.3rem", color: "var(--viva-gold)" }}>{familyMembers.length}</div>
                <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>Familiares</div>
              </div>
              <div className="card" style={{ padding: "0.75rem 1.5rem", textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: "1.3rem", color: "var(--viva-gold)" }}>1</div>
                <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>Generaciones</div>
              </div>
              <div className="card" style={{ padding: "0.75rem 1.5rem", textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: "1.3rem", color: "var(--viva-gold)" }}>0</div>
                <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>Memoriales</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
