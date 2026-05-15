"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AppNavbar from "@/components/AppNavbar";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const TABS = ["Altares", "Personas", "Tendencias", "Recuerdos"];

function EmptyState({ icon, title, subtitle, cta, ctaHref }: {
  icon: string; title: string; subtitle: string; cta?: string; ctaHref?: string;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>{icon}</div>
      <h3 style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--viva-gold)", marginBottom: "0.5rem" }}>{title}</h3>
      <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.6, maxWidth: 380, margin: "0 auto 1.5rem" }}>{subtitle}</p>
      {cta && ctaHref && <Link href={ctaHref}><button className="btn-gold" style={{ fontSize: "0.88rem" }}>{cta}</button></Link>}
    </motion.div>
  );
}

function AltarCard({ altar }: { altar: any }) {
  const years = altar.born && altar.died ? parseInt(altar.died) - parseInt(altar.born) : null;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="card card-hover" style={{ padding: "1.5rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--altar-marigold), var(--altar-rose))" }} />
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", border: "2px solid var(--altar-marigold)", background: "rgba(255,157,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", flexShrink: 0, animation: "candleGlow 3s ease infinite" }}>
          {altar.photoUrl ? <img src={altar.photoUrl} alt={altar.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : "🌹"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)", marginBottom: "0.2rem" }}>{altar.name}</div>
          {years && <div style={{ fontSize: "0.8rem", color: "var(--altar-marigold)" }}>{altar.born} — {altar.died} · {years} años</div>}
          {altar.estado && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>📍 {altar.estado}, México</div>}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.6rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            <span>👥 {altar.connectedFamilies?.length || 0} familias</span>
            <span>🕯️ {altar.velas || 0} velas</span>
            <span>🌹 {altar.flores || 0} flores</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <Link href={`/altar/${altar.id}`} style={{ textDecoration: "none", flex: 1 }}>
          <button className="btn-gold" style={{ width: "100%", fontSize: "0.82rem", padding: "0.5rem 1rem" }}>🕯️ Ver Altar</button>
        </Link>
        <Link href={`/altar/${altar.id}`} style={{ textDecoration: "none" }}>
          <button className="btn-glass" style={{ fontSize: "0.82rem", padding: "0.5rem 1rem" }}>🌹 Adoptar</button>
        </Link>
      </div>
    </motion.div>
  );
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "altares" ? "Altares" : "Altares";
  const [tab, setTab] = useState(initialTab);
  const [search, setSearch] = useState("");
  const { getAllDeceased } = useAuth();
  const allAltares = getAllDeceased();
  const filteredAltares = search.trim()
    ? allAltares.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.estado?.toLowerCase().includes(search.toLowerCase()))
    : allAltares;

  return (
    <div style={{ minHeight: "100vh", background: "var(--viva-black)" }}>
      <AppNavbar />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 className="font-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, marginBottom: "0.5rem" }}>
            🔍 <span className="gradient-gold">Explorar</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Descubre Altares, familias y recuerdos de todo México</p>
        </motion.div>

        {/* Search */}
        <div style={{ maxWidth: 500, margin: "0 auto 1.5rem" }}>
          <input className="input-viva" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Buscar por nombre, estado, familia..." style={{ textAlign: "center" }} />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "2rem", flexWrap: "wrap" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={tab === t ? "btn-gold" : "btn-glass"} style={{ fontSize: "0.85rem" }}>
              {t === "Altares" ? "🕯️" : t === "Personas" ? "👥" : t === "Tendencias" ? "📊" : "🌹"} {t}
            </button>
          ))}
        </div>

        {/* Altares tab */}
        {tab === "Altares" && (
          filteredAltares.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
              {filteredAltares.map(a => <AltarCard key={a.id} altar={a} />)}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="card" style={{ padding: "1.5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 160, border: "2px dashed var(--glass-border)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>➕</div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>¿Falta un Altar?</p>
                <Link href="/genealogy"><button className="btn-gold" style={{ fontSize: "0.82rem" }}>+ Crear Altar</button></Link>
              </motion.div>
            </div>
          ) : (
            <div>
              <EmptyState icon="🕯️" title="Aún no hay Altares públicos"
                subtitle="Sé el primero en crear un Altar eterno. Honra a tus seres queridos con un santuario digital que la comunidad puede adoptar."
                cta="🌹 Crear primer Altar" ctaHref="/genealogy" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", maxWidth: 700, margin: "0 auto" }}>
                {[
                  { icon: "🕯️", title: "Santuario Cinematográfico", desc: "Diseño Día de Muertos con partículas y velas animadas" },
                  { icon: "🌹", title: "Adoptar Altar", desc: "Comunidad que mantiene vivo el legado de tus seres queridos" },
                  { icon: "📍", title: "Mapa de México", desc: "Altares georeferenciados por estado" },
                ].map(f => (
                  <div key={f.title} className="card" style={{ padding: "1.25rem", textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>{f.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.25rem" }}>{f.title}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {tab === "Personas" && (
          <EmptyState icon="👥" title="La comunidad está creciendo"
            subtitle="Invita a tu familia a unirse a VIVA. Conecta generaciones y construye tu árbol genealógico juntos."
            cta="✉️ Invitar familiar" ctaHref="/register" />
        )}
        {tab === "Tendencias" && (
          <EmptyState icon="📊" title="Las tendencias comenzarán pronto"
            subtitle="Cuando la comunidad empiece a compartir recuerdos y adoptar Altares, los más activos aparecerán aquí en tiempo real." />
        )}
        {tab === "Recuerdos" && (
          <EmptyState icon="🌹" title="Comparte el primer recuerdo"
            subtitle="Los recuerdos publicados por la comunidad aparecerán aquí. Inicia sesión y comparte algo significativo."
            cta="Iniciar sesión" ctaHref="/login" />
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--viva-black)" }} />}><ExploreContent /></Suspense>;
}
