"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppNavbar from "@/components/AppNavbar";
import { useAuth } from "@/lib/auth-context";
import LocationPicker from "@/components/LocationPicker";
import Link from "next/link";
import { formatLocation } from "@/lib/locations";

export default function ProfilePage() {
  const { user, isAuthenticated, getFamilyMembers, getAllDeceased, getAltaresAdoptados, updateProfile } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPais, setEditPais] = useState("");
  const [editEstado, setEditEstado] = useState("");
  const [editMunicipio, setEditMunicipio] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editGenero, setEditGenero] = useState("");
  const [editNacimiento, setEditNacimiento] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState("");
  const [toastError, setToastError] = useState(false);
  const [activeTab, setActiveTab] = useState<"altares"|"familiares"|"publicaciones">("altares");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, error = false) => {
    setToast(msg); setToastError(error); setTimeout(() => setToast(""), 3500);
  };

  const openEdit = () => {
    setEditName(user?.name || "");
    setEditUsername(user?.username || "");
    setEditBio(user?.bio || "");
    setEditPais((user as any)?.pais || "");
    setEditEstado((user as any)?.estado || "");
    setEditMunicipio((user as any)?.municipio || "");
    setEditAvatar(user?.avatar || "");
    setEditGenero((user as any)?.genero || "");
    setEditNacimiento((user as any)?.nacimiento || "");
    setEditMode(true);
  };

  const processImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) { showToast("⚠️ Solo imágenes", true); return; }
    if (file.size > 5 * 1024 * 1024) { showToast("⚠️ Máx 5 MB", true); return; }
    const reader = new FileReader();
    reader.onload = e => setEditAvatar(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateProfile({
      name: editName, username: editUsername, bio: editBio,
      avatar: editAvatar, pais: editPais, estado: editEstado, municipio: editMunicipio,
      genero: editGenero, nacimiento: editNacimiento,
      location: formatLocation(editPais, editEstado, editMunicipio) || editMunicipio || editEstado || editPais,
    });
    setSaving(false);
    if (result.ok) { setEditMode(false); showToast("✅ Perfil actualizado"); }
    else showToast("⚠️ " + result.error, true);
  };

  if (!isAuthenticated || !user) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--viva-black)" }}>
        <AppNavbar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", gap: "1.5rem", padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "5rem" }}>👤</div>
          <h1 className="font-display" style={{ color: "var(--viva-gold)", fontSize: "2rem", fontWeight: 900 }}>Tu Perfil</h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: 400 }}>Inicia sesión para ver tu perfil de VIVA.</p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link href="/login"><button className="btn-gold">🌹 Iniciar Sesión</button></Link>
            <Link href="/register"><button className="btn-glass">Crear cuenta</button></Link>
          </div>
        </div>
      </div>
    );
  }

  const familyMembers = getFamilyMembers();
  const allDeceased = getAllDeceased();
  const adoptados = getAltaresAdoptados();
  const misCreados = allDeceased.filter(d => d.createdBy === user.id);
  const misAdoptados = adoptados.filter(d => d.createdBy !== user.id);
  const todosAltares = [...misCreados, ...misAdoptados.filter(a => !misCreados.find(c => c.id === a.id))];
  const userPais = (user as any).pais;
  const userEstado = (user as any).estado;
  const userMunicipio = (user as any).municipio;
  const locationDisplay = formatLocation(userPais, userEstado, userMunicipio) || user.location;

  return (
    <div style={{ minHeight: "100vh", background: "var(--viva-black)" }}>
      <AppNavbar />

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", top: 72, left: "50%", transform: "translateX(-50%)", background: toastError ? "rgba(212,69,107,0.9)" : "rgba(26,140,100,0.9)", border: `1px solid ${toastError ? "rgba(212,69,107,0.5)" : "rgba(26,140,100,0.5)"}`, borderRadius: 12, padding: "0.6rem 1.5rem", fontSize: "0.85rem", color: "#fff", zIndex: 300, backdropFilter: "blur(16px)", whiteSpace: "nowrap" }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input — OUTSIDE overflow:hidden so click works */}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => { const f = e.target.files?.[0]; if (f) processImage(f); }} />

      {/* Cover */}
      <div style={{ height: 220, background: "linear-gradient(135deg, #0f0f2a, #1a0f2e, #0f1a1a)", position: "relative", overflow: "hidden" }}>
        {[...Array(10)].map((_, i) => (
          <motion.div key={i} animate={{ y: [-10, -50], opacity: [0.7, 0] }} transition={{ repeat: Infinity, duration: 3 + i * 0.4, delay: i * 0.5 }}
            style={{ position: "absolute", left: `${8 + i * 9}%`, bottom: "20%", width: 4, height: 4, borderRadius: "50%", background: i % 2 === 0 ? "var(--viva-gold)" : "var(--viva-rose)" }} />
        ))}
      </div>

      {/* Avatar — outside cover so not clipped by overflow:hidden */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ marginTop: "-3.5rem", position: "relative", zIndex: 10, cursor: editMode ? "pointer" : "default" }}
          onClick={() => editMode && fileRef.current?.click()}>
          <img src={editMode ? (editAvatar || user.avatar) : user.avatar} alt={user.name}
            style={{ width: 106, height: 106, borderRadius: "50%", objectFit: "cover", border: "4px solid var(--viva-gold)", boxShadow: "var(--shadow-gold)", display: "block" }} />
          {editMode && (
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem" }}>📷</div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "5rem auto 0", padding: "0 1.5rem 4rem" }}>
        <AnimatePresence mode="wait">
          {!editMode ? (
            <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h1 style={{ fontWeight: 900, fontSize: "1.6rem", marginBottom: "0.2rem" }}>{user.name}</h1>
              <p style={{ color: "var(--viva-gold)", fontSize: "0.85rem", marginBottom: "0.4rem" }}>@{user.username}</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", maxWidth: 420, margin: "0 auto 0.75rem" }}>{user.bio}</p>
              {locationDisplay && <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "0.4rem" }}>📍 {locationDisplay}</p>}
              {(() => {
                const g = (user as any).genero;
                const n = (user as any).nacimiento;
                const age = n ? new Date().getFullYear() - parseInt(n) : null;
                const parts = [g ? (g === "masculino" ? "♂ Masculino" : g === "femenino" ? "♀ Femenino" : "⚧ Otro") : null, age ? `🎂 ${age} años` : null].filter(Boolean);
                return parts.length > 0 ? <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "1.25rem" }}>{parts.join(" · ")}</p> : <div style={{ marginBottom: "1.25rem" }} />;
              })()}
              <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "1.25rem" }}>
                {[{ val: user.followers, label: "Seguidores" }, { val: user.following, label: "Siguiendo" }, { val: todosAltares.length, label: "Altares" }, { val: familyMembers.length, label: "Familiares" }].map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--viva-gold)" }}>{s.val}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn-gold" style={{ fontSize: "0.85rem" }} onClick={openEdit}>✏️ Editar perfil</button>
                <Link href="/genealogy"><button className="btn-glass" style={{ fontSize: "0.85rem" }}>🌳 Árbol familiar</button></Link>
                <button className="btn-glass" style={{ fontSize: "0.85rem" }} onClick={() => { navigator.clipboard?.writeText(window.location.href); showToast("🔗 Enlace copiado"); }}>📤 Compartir</button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: "var(--viva-card)", border: "1px solid var(--glass-border)", borderRadius: 20, padding: "2rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>✏️ Editar Perfil</h2>
                <button onClick={() => setEditMode(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.3rem" }}>✕</button>
              </div>

              {/* Photo upload button */}
              <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
                <button type="button" onClick={() => fileRef.current?.click()}
                  style={{ background: "rgba(245,166,35,0.15)", border: "2px solid rgba(245,166,35,0.6)", borderRadius: 50, padding: "0.6rem 1.8rem", color: "#f5a623", cursor: "pointer", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.01em" }}>
                  📷 Cambiar foto de perfil
                </button>
                {editAvatar !== user.avatar && (
                  <button type="button" onClick={() => setEditAvatar(user.avatar)} style={{ marginLeft: "0.5rem", background: "none", border: "1px solid rgba(212,69,107,0.4)", borderRadius: 50, padding: "0.5rem 0.75rem", color: "#f48ca8", cursor: "pointer", fontSize: "0.8rem" }}>✕ Quitar</button>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>👤 Nombre completo</label>
                    <input className="input-viva" value={editName} onChange={e => setEditName(e.target.value)} placeholder={user.name} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>@ Nombre de usuario</label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "var(--viva-gold)", fontSize: "0.9rem" }}>@</span>
                      <input className="input-viva" value={editUsername} onChange={e => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} style={{ paddingLeft: "1.8rem" }} placeholder={user.username} />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>📝 Biografía</label>
                  <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3}
                    style={{ width: "100%", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: 12, padding: "0.75rem 1rem", color: "var(--text-primary)", fontSize: "0.9rem", resize: "vertical", fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box" }} />
                </div>

                <div style={{ background: "var(--glass-bg)", borderRadius: 14, padding: "1.25rem", border: "1px solid var(--glass-border)" }}>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "1rem", fontWeight: 600 }}>📍 Ubicación</p>
                  <LocationPicker pais={editPais} estado={editEstado} municipio={editMunicipio}
                    onChange={(f, v) => { if (f === "pais") { setEditPais(v); setEditEstado(""); setEditMunicipio(""); } else if (f === "estado") { setEditEstado(v); setEditMunicipio(""); } else setEditMunicipio(v); }} />
                </div>

                {/* Gender + Birth year */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>⚧ Género</label>
                    <select className="input-viva" value={editGenero} onChange={e => setEditGenero(e.target.value)}>
                      <option value="">Prefiero no decir</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>🎂 Año de nacimiento</label>
                    <input className="input-viva" type="number" min="1920" max={new Date().getFullYear()} value={editNacimiento} onChange={e => setEditNacimiento(e.target.value)} placeholder="Ej: 1990" />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <button className="btn-glass" style={{ flex: 1 }} onClick={() => setEditMode(false)}>Cancelar</button>
                  <button className="btn-gold" style={{ flex: 2, opacity: saving ? 0.7 : 1 }} onClick={handleSave} disabled={saving}>
                    {saving ? "⟳ Guardando..." : "✅ Guardar cambios"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.75rem", flexWrap: "wrap" }}>
          {([{ k: "altares", l: `🕯️ Mis Altares (${todosAltares.length})` }, { k: "familiares", l: `🌳 Familiares (${familyMembers.length})` }, { k: "publicaciones", l: "📝 Publicaciones" }] as const).map(t => (
            <button key={t.k} onClick={() => setActiveTab(t.k)}
              style={{ background: activeTab === t.k ? "var(--gold-glass)" : "transparent", border: `1px solid ${activeTab === t.k ? "var(--gold-border)" : "transparent"}`, borderRadius: 50, padding: "0.4rem 1rem", cursor: "pointer", color: activeTab === t.k ? "var(--viva-gold)" : "var(--text-muted)", fontSize: "0.85rem", transition: "all 0.2s" }}>
              {t.l}
            </button>
          ))}
        </div>

        {activeTab === "altares" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {todosAltares.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🕯️</div>
                <h3 style={{ color: "var(--viva-gold)", marginBottom: "0.5rem" }}>Aún no tienes Altares</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>Crea un altar para un ser querido o adopta uno de la comunidad.</p>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/genealogy"><button className="btn-gold" style={{ fontSize: "0.88rem" }}>+ Crear Altar</button></Link>
                  <Link href="/explore?tab=altares"><button className="btn-glass" style={{ fontSize: "0.88rem" }}>🔍 Explorar</button></Link>
                </div>
              </div>
            ) : (
              <>
                {misCreados.length > 0 && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h3 style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem", letterSpacing: "0.05em" }}>✨ CREADOS POR MÍ</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
                      {misCreados.map(a => <AltarCard key={a.id} altar={a} badge="Creador" badgeColor="var(--viva-gold)" />)}
                    </div>
                  </div>
                )}
                {misAdoptados.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem", letterSpacing: "0.05em" }}>🌹 ADOPTADOS</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
                      {misAdoptados.map(a => <AltarCard key={a.id} altar={a} badge="Adoptado" badgeColor="var(--viva-rose)" />)}
                    </div>
                  </div>
                )}
                <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                  <Link href="/genealogy"><button className="btn-gold" style={{ fontSize: "0.85rem" }}>+ Crear otro Altar</button></Link>
                </div>
              </>
            )}
          </motion.div>
        )}

        {activeTab === "familiares" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {familyMembers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌳</div>
                <h3 style={{ color: "var(--viva-gold)", marginBottom: "0.5rem" }}>Tu árbol está vacío</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>Agrega familiares para construir tu árbol genealógico.</p>
                <Link href="/genealogy"><button className="btn-gold" style={{ fontSize: "0.88rem" }}>🌳 Ir al árbol genealógico</button></Link>
              </div>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
                  {familyMembers.map(m => (
                    <div key={m.id} className="card" style={{ padding: "1.25rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <div style={{ width: 50, height: 50, borderRadius: "50%", background: m.died ? "rgba(255,157,0,0.1)" : "var(--gold-glass)", border: `2px solid ${m.died ? "var(--viva-orange)" : "var(--viva-gold)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>
                        {m.died ? "🕯️" : m.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--viva-gold)" }}>{m.relation}</div>
                        {m.died && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{m.born} — {m.died}</div>}
                        {m.altarId && <Link href={`/altar/${m.altarId}`} style={{ textDecoration: "none" }}><div style={{ fontSize: "0.7rem", color: "var(--viva-orange)", marginTop: "0.2rem" }}>Ver Altar →</div></Link>}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: "center" }}>
                  <Link href="/genealogy"><button className="btn-gold" style={{ fontSize: "0.85rem" }}>+ Agregar familiar</button></Link>
                </div>
              </>
            )}
          </motion.div>
        )}

        {activeTab === "publicaciones" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: "3rem", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🌹</div>
            <h3 style={{ color: "var(--viva-gold)", marginBottom: "0.5rem" }}>Aún sin publicaciones</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>Comparte recuerdos en el feed memorial.</p>
            <Link href="/feed"><button className="btn-gold" style={{ fontSize: "0.85rem" }}>🏠 Ir al Feed</button></Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function AltarCard({ altar, badge, badgeColor }: { altar: any; badge: string; badgeColor: string }) {
  const years = altar.born && altar.died ? parseInt(altar.died) - parseInt(altar.born) : null;
  const loc = formatLocation(altar.pais, altar.estado, altar.municipio) || (altar.estado ? `${altar.estado}, México` : "");
  return (
    <motion.div whileHover={{ y: -3 }} className="card" style={{ padding: "1.25rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${badgeColor}, transparent)` }} />
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", border: `2px solid ${badgeColor}`, background: "rgba(255,157,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0, overflow: "hidden" }}>
          {altar.photoUrl ? <img src={altar.photoUrl} alt={altar.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : "🌹"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
            <span style={{ fontWeight: 700, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{altar.name}</span>
            <span style={{ fontSize: "0.6rem", background: `${badgeColor}22`, color: badgeColor, border: `1px solid ${badgeColor}44`, borderRadius: 50, padding: "1px 6px", flexShrink: 0 }}>{badge}</span>
          </div>
          {years && <div style={{ fontSize: "0.75rem", color: "var(--viva-gold)" }}>{altar.born} — {altar.died} · {years} años</div>}
          {loc && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>📍 {loc}</div>}
          <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
            <span>🕯️ {altar.velas || 0}</span><span>👥 {altar.connectedFamilies?.length || 0}</span>
          </div>
        </div>
      </div>
      <Link href={`/altar/${altar.id}`} style={{ textDecoration: "none", display: "block", marginTop: "0.85rem" }}>
        <button style={{ width: "100%", padding: "0.5rem", borderRadius: 50, border: `1px solid ${badgeColor}44`, background: `${badgeColor}11`, color: badgeColor, cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, transition: "all 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.background = `${badgeColor}22`)}
          onMouseLeave={e => (e.currentTarget.style.background = `${badgeColor}11`)}>
          🕯️ Ver Altar
        </button>
      </Link>
    </motion.div>
  );
}
