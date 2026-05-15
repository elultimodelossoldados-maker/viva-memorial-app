"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import AppNavbar from "@/components/AppNavbar";
import { useAuth } from "@/lib/auth-context";
import LocationPicker from "@/components/LocationPicker";
import { formatLocation } from "@/lib/locations";



export default function AltarPage() {
  const pathname = usePathname();
  const id = pathname?.split("/altar/")[1]?.replace(/\/$/, "") || "_";
  const { isAuthenticated, user, getDeceasedPerson, adoptarAltar, isAltarAdoptado, dejarOfrenda, encenderVela, updateAltar } = useAuth();

  const altar = getDeceasedPerson(id);
  const adoptado = isAltarAdoptado(id);
  const isCreator = isAuthenticated && user && altar?.createdBy === user.id;

  const [activeTab, setActiveTab] = useState("historia");
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [adoptRelation, setAdoptRelation] = useState("");
  const [ofrendaMsg, setOfrendaMsg] = useState("");
  const [toast, setToast] = useState("");
  const [velas, setVelas] = useState(altar?.velas || 0);

  // Edit state
  const [editBio, setEditBio] = useState(altar?.bio || "");
  const [editPhoto, setEditPhoto] = useState(altar?.photoUrl || "");
  const [editPais, setEditPais] = useState((altar as any)?.pais || "");
  const [editEstado, setEditEstado] = useState(altar?.estado || "");
  const [editMunicipio, setEditMunicipio] = useState((altar as any)?.municipio || "");
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const processImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) { showToast("⚠️ Solo se permiten imágenes"); return; }
    if (file.size > 5 * 1024 * 1024) { showToast("⚠️ La imagen no puede superar 5 MB"); return; }
    const reader = new FileReader();
    reader.onload = (e) => setEditPhoto(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (file) processImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0]; if (file) processImage(file);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    const ok = await updateAltar(id, { bio: editBio, photoUrl: editPhoto, pais: editPais, estado: editEstado, municipio: editMunicipio });
    setSaving(false);
    if (ok) showToast("✅ Altar actualizado");
    else showToast("⚠️ No se pudo guardar");
  };

  if (!altar) return (
    <div style={{ minHeight: "100vh", background: "var(--altar-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <AppNavbar />
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🕯️</div>
        <h1 style={{ color: "var(--altar-text)", fontFamily: "var(--font-display)", fontSize: "2rem", marginBottom: "0.5rem" }}>Altar no encontrado</h1>
        <p style={{ color: "var(--altar-text-muted)", marginBottom: "2rem" }}>Este altar no existe o aún no ha sido creado.</p>
        <Link href="/genealogy"><button className="btn-adopt">+ Crear un Altar</button></Link>
      </div>
    </div>
  );

  const years = altar.born && altar.died ? parseInt(altar.died) - parseInt(altar.born) : null;
  const adoptantes = altar.connectedFamilies || [];
  const tabs = [
    { k: "historia", l: "📖 Historia" },
    { k: "ofrendas", l: "🕯️ Ofrendas" },
    { k: "recuerdos", l: "💬 Recuerdos" },
    { k: "galeria", l: "📷 Galería" },
    { k: "familias", l: `👥 Familias (${adoptantes.length})` },
    ...(isCreator ? [{ k: "editar", l: "✏️ Editar Altar" }] : []),
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--altar-bg)", color: "var(--altar-text)" }}>
      <AppNavbar />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", top: 72, left: "50%", transform: "translateX(-50%)", background: "rgba(255,157,0,0.15)", border: "1px solid var(--altar-border)", borderRadius: 12, padding: "0.6rem 1.5rem", fontSize: "0.85rem", color: "var(--altar-candle)", zIndex: 300, backdropFilter: "blur(16px)", whiteSpace: "nowrap" }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
        className="altar-hero" style={{ paddingTop: "5rem", paddingBottom: "3rem", textAlign: "center" }}>
        {/* Petal particles */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {[...Array(18)].map((_, i) => (
            <motion.div key={i}
              animate={{ y: [0, -150], opacity: [0.9, 0], x: [0, (i % 2 === 0 ? 1 : -1) * 35], rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 5 + i * 0.3, delay: i * 0.6, ease: "easeOut" }}
              style={{ position: "absolute", left: `${4 + i * 5.2}%`, bottom: "5%", fontSize: "1.1rem" }}>
              🌼
            </motion.div>
          ))}
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Avatar */}
          <div style={{ width: 150, height: 150, borderRadius: "50%", border: "5px solid var(--altar-marigold)", background: "var(--altar-card)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem", margin: "0 auto 1.5rem", boxShadow: "0 0 60px var(--altar-gold-glow), 0 0 120px rgba(245,166,35,0.15)", animation: "candleGlow 3s ease infinite", overflow: "hidden", position: "relative" }}>
            {(editPhoto || altar.photoUrl)
              ? <img src={editPhoto || altar.photoUrl} alt={altar.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              : "🌹"}
            {isCreator && (
              <div onClick={() => { setActiveTab("editar"); window.scrollTo({ top: 400, behavior: "smooth" }); }}
                style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s", fontSize: "1.5rem", opacity: 0 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.55)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0"; (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0)"; }}
              >📷</div>
            )}
          </div>

          <h1 className="font-display" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, color: "var(--altar-text)", textShadow: "0 0 40px var(--altar-candle-glow)", marginBottom: "0.5rem" }}>
            {altar.name}
          </h1>
          {years && <p style={{ color: "var(--altar-marigold)", fontSize: "1.05rem", marginBottom: "0.3rem" }}>{altar.born} — {altar.died} · {years} años de vida</p>}
          {(() => {
            const loc = formatLocation((altar as any).pais || editPais, editEstado || altar.estado, (altar as any).municipio || editMunicipio);
            const display = loc || (altar.estado ? `${altar.estado}, México` : null);
            return display ? <p style={{ color: "var(--altar-text-muted)", fontSize: "0.88rem" }}>📍 {display}</p> : null;
          })()}
          <p style={{ color: "var(--altar-text-muted)", fontSize: "0.82rem", marginTop: "0.5rem" }}>
            ✨ {adoptantes.length} {adoptantes.length === 1 ? "familia ha adoptado" : "familias han adoptado"} este Altar
          </p>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1.75rem" }}>
            {isAuthenticated ? (
              <button className={`btn-adopt${adoptado ? " adopted" : ""}`}
                onClick={() => adoptado ? showToast("✓ Ya adoptaste este Altar") : setShowAdoptModal(true)}>
                {adoptado ? "✓ Altar Adoptado" : "🌹 ADOPTAR ALTAR"}
              </button>
            ) : (
              <Link href="/register"><button className="btn-adopt">🌹 Adoptar este Altar</button></Link>
            )}
            <button onClick={() => { encenderVela(id); setVelas(v => v + 1); showToast("🕯️ Vela encendida"); }}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 1.5rem", borderRadius: 50, border: "1px solid var(--altar-border)", background: "var(--altar-glass)", color: "var(--altar-candle)", cursor: "pointer", fontSize: "0.9rem", fontFamily: "var(--font-body)", transition: "all 0.2s" }}>
              🕯️ {velas} velas
            </button>
            <button onClick={() => { navigator.clipboard?.writeText(window.location.href); showToast("🔗 Enlace copiado"); }}
              style={{ padding: "0.8rem 1.5rem", borderRadius: 50, border: "1px solid var(--altar-border)", background: "var(--altar-glass)", color: "var(--altar-text-muted)", cursor: "pointer", fontSize: "0.9rem", fontFamily: "var(--font-body)" }}>
              📤 Compartir
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", margin: "1.5rem 0" }}>
          {tabs.map(t => (
            <button key={t.k} onClick={() => setActiveTab(t.k)}
              style={{ padding: "0.5rem 1.2rem", borderRadius: 50, border: `1px solid ${activeTab === t.k ? "var(--altar-marigold)" : "var(--altar-border)"}`, background: activeTab === t.k ? "rgba(245,166,35,0.15)" : "var(--altar-glass)", color: activeTab === t.k ? "var(--altar-marigold)" : "var(--altar-text-muted)", cursor: "pointer", fontSize: "0.85rem", fontFamily: "var(--font-body)", transition: "all 0.2s" }}>
              {t.l}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem" }}>
          {/* Tab Content */}
          <main>
            {activeTab === "historia" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="altar-card" style={{ padding: "2rem" }}>
                {(editBio || altar.bio) ? (
                  <>
                    <p style={{ lineHeight: 1.8, color: "var(--altar-text)", fontSize: "0.95rem", whiteSpace: "pre-wrap" }}>{editBio || altar.bio}</p>
                    {isCreator && (
                      <button onClick={() => setActiveTab("editar")} style={{ marginTop: "1.25rem", background: "none", border: "1px solid var(--altar-border)", borderRadius: 50, padding: "0.4rem 1rem", color: "var(--altar-marigold)", cursor: "pointer", fontSize: "0.78rem" }}>
                        ✏️ Editar historia
                      </button>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "2rem 0" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📖</div>
                    <h3 style={{ color: "var(--altar-marigold)", marginBottom: "0.5rem" }}>Historia por escribir</h3>
                    <p style={{ color: "var(--altar-text-muted)", fontSize: "0.88rem", maxWidth: 400, margin: "0 auto 1.5rem" }}>
                      Este Altar aún no tiene una historia de vida. Las familias adoptantes pueden contribuir con recuerdos y relatos.
                    </p>
                    {isCreator && <button className="btn-adopt" style={{ fontSize: "0.85rem" }} onClick={() => setActiveTab("editar")}>✍️ Escribir historia</button>}
                    {isAuthenticated && !isCreator && !adoptado && <button className="btn-adopt" style={{ fontSize: "0.85rem" }} onClick={() => setShowAdoptModal(true)}>🌹 Adoptar para contribuir</button>}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "ofrendas" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {isAuthenticated && (
                  <div className="altar-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
                    <h3 style={{ marginBottom: "1rem", color: "var(--altar-marigold)", fontSize: "0.95rem" }}>🕯️ Dejar una Ofrenda</h3>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                      {([["vela","🕯️","Vela"],["flor","🌹","Flor"],["mensaje","💬","Mensaje"],["carta","💌","Carta"],["cancion","🎵","Canción"]] as const).map(([t,e,l]) => (
                        <button key={t} onClick={() => { dejarOfrenda(id, t, ofrendaMsg || l); showToast(`${e} Ofrenda enviada`); }}
                          style={{ padding: "0.5rem 1rem", borderRadius: 50, border: "1px solid var(--altar-border)", background: "var(--altar-glass)", color: "var(--altar-text)", cursor: "pointer", fontSize: "0.82rem", fontFamily: "var(--font-body)", transition: "all 0.2s" }}>
                          {e} {l}
                        </button>
                      ))}
                    </div>
                    <textarea className="input-viva" value={ofrendaMsg} onChange={e => setOfrendaMsg(e.target.value)}
                      placeholder="Escribe un mensaje de amor... (opcional)"
                      style={{ resize: "none", minHeight: 80, background: "var(--altar-glass)", borderColor: "var(--altar-border)", color: "var(--altar-text)" }} />
                  </div>
                )}
                {(altar.ofrendas?.length ?? 0) > 0 ? altar.ofrendas.map(o => (
                  <div key={o.id} className="altar-card" style={{ padding: "1rem", marginBottom: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <div style={{ fontSize: "2rem", flexShrink: 0 }}>{o.emoji}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--altar-text)" }}>{o.userName}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--altar-text-muted)", marginBottom: "0.25rem" }}>{new Date(o.createdAt).toLocaleDateString("es-MX")}</div>
                      {o.contenido && <p style={{ fontSize: "0.88rem", color: "var(--altar-text)", lineHeight: 1.6 }}>{o.contenido}</p>}
                    </div>
                  </div>
                )) : (
                  <div className="altar-card" style={{ padding: "2.5rem", textAlign: "center" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🌼</div>
                    <h3 style={{ color: "var(--altar-marigold)", marginBottom: "0.5rem" }}>Sin ofrendas aún</h3>
                    <p style={{ color: "var(--altar-text-muted)", fontSize: "0.88rem" }}>Sé el primero en dejar una ofrenda en este Altar.</p>
                    {!isAuthenticated && <Link href="/register"><button className="btn-adopt" style={{ marginTop: "1rem", fontSize: "0.85rem" }}>Únete para ofrecer</button></Link>}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "recuerdos" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="altar-card" style={{ padding: "2.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>💬</div>
                <h3 style={{ color: "var(--altar-marigold)", marginBottom: "0.5rem" }}>Recuerdos Compartidos</h3>
                <p style={{ color: "var(--altar-text-muted)", fontSize: "0.88rem", maxWidth: 380, margin: "0 auto 1.5rem" }}>Los recuerdos de quienes han adoptado este Altar aparecerán aquí.</p>
                {!isAuthenticated && <Link href="/register"><button className="btn-adopt" style={{ fontSize: "0.85rem" }}>Únete para compartir</button></Link>}
                {isAuthenticated && !adoptado && <button className="btn-adopt" style={{ fontSize: "0.85rem" }} onClick={() => setShowAdoptModal(true)}>🌹 Adoptar para dejar recuerdos</button>}
              </motion.div>
            )}

            {activeTab === "galeria" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="altar-card" style={{ padding: "2.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>📷</div>
                <h3 style={{ color: "var(--altar-marigold)", marginBottom: "0.5rem" }}>Galería de Vida</h3>
                <p style={{ color: "var(--altar-text-muted)", fontSize: "0.88rem", maxWidth: 380, margin: "0 auto 1.5rem" }}>Las fotos que compartan las familias adoptantes aparecerán aquí.</p>
                {isAuthenticated && adoptado && <button className="btn-adopt" style={{ fontSize: "0.85rem" }}>📷 Agregar foto</button>}
              </motion.div>
            )}

            {activeTab === "familias" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {adoptantes.length === 0 ? (
                  <div className="altar-card" style={{ padding: "2.5rem", textAlign: "center" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>👥</div>
                    <h3 style={{ color: "var(--altar-marigold)", marginBottom: "0.5rem" }}>Ninguna familia aún</h3>
                    <p style={{ color: "var(--altar-text-muted)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>Sé la primera familia en adoptar este Altar y mantenerlo vivo.</p>
                    {isAuthenticated && !adoptado && <button className="btn-adopt" onClick={() => setShowAdoptModal(true)}>🌹 Adoptar este Altar</button>}
                  </div>
                ) : (
                  adoptantes.map((f, i) => (
                    <div key={i} className="altar-card" style={{ padding: "1rem", marginBottom: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      {f.userAvatar
                        ? <img src={f.userAvatar} alt={f.userName} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--altar-border)" }} />
                        : <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--altar-glass)", border: "1px solid var(--altar-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>{f.userName.charAt(0)}</div>}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--altar-text)" }}>{f.userName}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--altar-marigold)" }}>{f.relation}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--altar-text-muted)" }}>Adoptó el {new Date(f.connectedAt).toLocaleDateString("es-MX")}</div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* ── EDIT TAB (creator only) ─────────────────────── */}
            {activeTab === "editar" && isCreator && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="altar-card" style={{ padding: "2rem", marginBottom: "1.25rem" }}>
                  <h3 style={{ color: "var(--altar-marigold)", marginBottom: "1.25rem", fontSize: "1rem" }}>📷 Foto del Difunto</h3>

                  {editPhoto && (
                    <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                      <img src={editPhoto} alt="Foto" style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--altar-marigold)", boxShadow: "0 0 30px rgba(255,157,0,0.3)" }} />
                      <div style={{ marginTop: "0.5rem" }}>
                        <button onClick={() => setEditPhoto("")}
                          style={{ background: "none", border: "1px solid rgba(212,69,107,0.4)", borderRadius: 50, padding: "0.25rem 0.75rem", color: "#f48ca8", cursor: "pointer", fontSize: "0.75rem" }}>
                          ✕ Quitar foto
                        </button>
                      </div>
                    </div>
                  )}

                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    style={{
                      border: `2px dashed ${dragOver ? "var(--altar-marigold)" : "var(--altar-border)"}`,
                      borderRadius: 16, padding: "2.5rem", textAlign: "center", cursor: "pointer",
                      background: dragOver ? "rgba(255,157,0,0.06)" : "var(--altar-glass)",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📷</div>
                    <p style={{ color: "var(--altar-text-muted)", fontSize: "0.88rem", marginBottom: "0.5rem" }}>
                      Arrastra una foto o <span style={{ color: "var(--altar-marigold)", textDecoration: "underline" }}>haz clic para seleccionar</span>
                    </p>
                    <p style={{ color: "var(--altar-text-muted)", fontSize: "0.75rem" }}>JPG, PNG, WEBP · Máx. 5 MB</p>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileInput} />
                  </div>
                </div>

                <div className="altar-card" style={{ padding: "2rem", marginBottom: "1.25rem" }}>
                  <h3 style={{ color: "var(--altar-marigold)", marginBottom: "1rem", fontSize: "1rem" }}>📖 Biografía</h3>
                  <textarea
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    placeholder="Escribe la historia de vida, anécdotas, legado y recuerdos de este ser querido..."
                    rows={7}
                    style={{
                      width: "100%", background: "var(--altar-glass)", border: "1px solid var(--altar-border)",
                      borderRadius: 12, padding: "1rem", color: "var(--altar-text)", fontSize: "0.9rem",
                      lineHeight: 1.7, resize: "vertical", fontFamily: "var(--font-body)",
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "var(--altar-text-muted)", marginTop: "0.4rem", textAlign: "right" }}>{editBio.length} caracteres</p>
                </div>

                {/* Location editor */}
                <div className="altar-card" style={{ padding: "2rem", marginBottom: "1.25rem" }}>
                  <h3 style={{ color: "var(--altar-marigold)", marginBottom: "1rem", fontSize: "1rem" }}>📍 Lugar de descanso</h3>
                  <LocationPicker
                    pais={editPais}
                    estado={editEstado}
                    municipio={editMunicipio}
                    onChange={(field, value) => {
                      if (field === "pais") { setEditPais(value); setEditEstado(""); setEditMunicipio(""); }
                      else if (field === "estado") { setEditEstado(value); setEditMunicipio(""); }
                      else setEditMunicipio(value);
                    }}
                    labelColor="var(--altar-text-muted)"
                  />
                </div>

                <button
                  className="btn-adopt"
                  onClick={handleSaveEdit}
                  disabled={saving}
                  style={{ width: "100%", fontSize: "1rem", padding: "0.9rem", opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? "⟳ Guardando..." : "✅ Guardar cambios"}
                </button>
              </motion.div>
            )}
          </main>

          {/* Sidebar */}
          <aside>
            {/* Virtual Altar */}
            <div className="altar-card" style={{ padding: "1.25rem", marginBottom: "1rem", textAlign: "center" }}>
              <h3 style={{ fontSize: "0.9rem", marginBottom: "1rem", color: "var(--altar-marigold)" }}>🕯️ Altar Virtual</h3>
              <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap", minHeight: 60, alignItems: "center" }}>
                {velas === 0 ? (
                  <div style={{ color: "var(--altar-text-muted)", fontSize: "0.82rem" }}>
                    <div style={{ fontSize: "2.5rem", opacity: 0.3, marginBottom: "0.3rem" }}>🕯️</div>
                    Sin velas aún
                  </div>
                ) : (
                  [...Array(Math.min(velas, 9))].map((_, i) => (
                    <div key={i} className="altar-candle-el">
                      <span className="altar-candle-flame" style={{ animationDelay: `${i * 0.3}s` }}>🕯️</span>
                      <div className="altar-candle-glow-el" />
                    </div>
                  ))
                )}
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--altar-text-muted)", margin: "0.75rem 0" }}>{velas} {velas === 1 ? "vela encendida" : "velas encendidas"}</p>
              <button onClick={() => { encenderVela(id); setVelas(v => v + 1); showToast("🕯️ Vela encendida"); }}
                style={{ width: "100%", padding: "0.6rem", borderRadius: 50, border: "1px solid var(--altar-border)", background: "var(--altar-glass)", color: "var(--altar-candle)", cursor: "pointer", fontSize: "0.82rem", fontFamily: "var(--font-body)", transition: "all 0.2s" }}>
                🕯️ Encender vela
              </button>
            </div>

            {/* Stats */}
            <div className="altar-card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "0.9rem", marginBottom: "0.75rem", color: "var(--altar-marigold)" }}>📊 Estadísticas</h3>
              {[
                { icon: "👥", val: adoptantes.length, label: "Familias adoptantes" },
                { icon: "🕯️", val: velas, label: "Velas encendidas" },
                { icon: "🌹", val: altar.flores || 0, label: "Flores recibidas" },
                { icon: "🙏", val: altar.ofrendas?.length || 0, label: "Ofrendas" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid var(--altar-border)" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--altar-text-muted)" }}>{s.icon} {s.label}</span>
                  <span style={{ fontWeight: 700, color: "var(--altar-marigold)" }}>{s.val}</span>
                </div>
              ))}
            </div>

            {/* Location */}
            <div className="altar-card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "0.9rem", marginBottom: "0.75rem", color: "var(--altar-marigold)" }}>📍 Ubicación</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--altar-text-muted)" }}>{altar.estado ? `${altar.estado}, México` : "Sin ubicación registrada"}</p>
              <Link href="/map"><button style={{ width: "100%", marginTop: "0.75rem", padding: "0.6rem", borderRadius: 50, border: "1px solid var(--altar-border)", background: "var(--altar-glass)", color: "var(--altar-text-muted)", cursor: "pointer", fontSize: "0.82rem", fontFamily: "var(--font-body)" }}>🗺️ Ver en mapa →</button></Link>
            </div>

            {/* Marketplace CTA */}
            <div style={{ background: "var(--altar-glass)", border: "1px solid var(--altar-border)", borderRadius: 16, padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>🛒</div>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--altar-marigold)", marginBottom: "0.4rem" }}>Placa física QR</div>
              <div style={{ fontSize: "0.75rem", color: "var(--altar-text-muted)", marginBottom: "0.75rem" }}>Visita el Altar en el lugar de descanso con un código QR</div>
              <Link href="/marketplace"><button className="btn-adopt" style={{ fontSize: "0.8rem", padding: "0.5rem 1rem", width: "100%" }}>Ver en Tienda</button></Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Adopt Modal */}
      <AnimatePresence>
        {showAdoptModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
            onClick={() => setShowAdoptModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "var(--altar-card)", border: "1px solid var(--altar-border)", borderRadius: 24, padding: "2.5rem", width: "100%", maxWidth: 460, boxShadow: "var(--altar-shadow)" }}>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🌹</div>
                <h2 className="font-display" style={{ fontSize: "1.8rem", color: "var(--altar-text)", marginBottom: "0.5rem" }}>Adoptar Altar</h2>
                <p style={{ color: "var(--altar-text-muted)", fontSize: "0.88rem" }}>
                  ¿Cuál es tu relación con <strong style={{ color: "var(--altar-marigold)" }}>{altar.name}</strong>?
                </p>
              </div>
              <select className="input-viva" value={adoptRelation} onChange={e => setAdoptRelation(e.target.value)}
                style={{ marginBottom: "1.25rem", background: "var(--altar-glass)", borderColor: "var(--altar-border)", color: adoptRelation ? "var(--altar-text)" : "var(--altar-text-muted)" }}>
                <option value="">Seleccionar relación...</option>
                {["Nieto/a", "Hijo/a", "Bisnieto/a", "Sobrino/a", "Primo/a", "Amigo/a cercano", "Familiar", "Conocido", "Admirador"].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => setShowAdoptModal(false)}
                  style={{ flex: 1, padding: "0.8rem", borderRadius: 50, border: "1px solid var(--altar-border)", background: "transparent", color: "var(--altar-text-muted)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "0.9rem" }}>
                  Cancelar
                </button>
                <button className="btn-adopt" style={{ flex: 2 }} disabled={!adoptRelation}
                  onClick={() => { if (adoptRelation) { adoptarAltar(id, adoptRelation); setShowAdoptModal(false); showToast("🌹 ¡Altar adoptado! Ya es parte de tu familia."); } }}>
                  🌹 Adoptar Altar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          main + aside { display: none; }
        }
      `}</style>
    </div>
  );
}
