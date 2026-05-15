"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AppNavbar from "@/components/AppNavbar";
import { useAuth } from "@/lib/auth-context";

const REACTIONS = [
  { emoji: "🌹", label: "Lo recuerdo" },
  { emoji: "🕯️", label: "Enciendo una vela" },
  { emoji: "❤️", label: "Siempre conmigo" },
  { emoji: "🙏", label: "Bendiciones" },
  { emoji: "🌼", label: "Ofrenda" },
  { emoji: "🕊️", label: "Descansa en paz" },
];

function StoryBar({ user }: { user: any }) {
  return (
    <div style={{ background: "var(--viva-card)", border: "1px solid var(--glass-border)", borderRadius: 16, padding: "1rem", marginBottom: "1rem" }}>
      <div className="stories-scroll">
        <div className="story-item" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "var(--gold-glass)", border: "2px dashed var(--viva-gold)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem", transition: "all 0.2s",
          }}>+</div>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>Tu historia</span>
        </div>
        {user && (
          <div className="story-item" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <div style={{ padding: 0 }}>
              <img src={user.avatar} alt={user.name} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--viva-gold)", display: "block" }} />
            </div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-primary)", whiteSpace: "nowrap", maxWidth: 64, overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.name.split(" ")[0]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function PostCreator({ user }: { user: any }) {
  const [text, setText] = useState("");
  const [posted, setPosted] = useState(false);

  const handlePost = () => {
    if (!text.trim()) return;
    setPosted(true);
    setText("");
    setTimeout(() => setPosted(false), 3000);
  };

  return (
    <div style={{ background: "var(--viva-card)", border: "1px solid var(--glass-border)", borderRadius: 16, padding: "1.25rem", marginBottom: "1rem" }}>
      <AnimatePresence>
        {posted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ background: "rgba(26,140,100,0.15)", border: "1px solid rgba(26,140,100,0.3)", borderRadius: 10, padding: "0.6rem 1rem", marginBottom: "0.75rem", fontSize: "0.83rem", color: "#4caf80" }}
          >
            ✅ Recuerdo publicado — tu familia puede verlo ahora.
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
        <img src={user?.avatar} alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--viva-gold)", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <textarea
            className="input-viva"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={`¿Qué recuerdo tienes en mente, ${user?.name?.split(" ")[0] || "amigo"}? 🌹`}
            style={{ resize: "none", minHeight: 70, borderRadius: 12, lineHeight: 1.5 }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[
                { icon: "📷", label: "Foto/Video" },
                { icon: "🌹", label: "Memorial" },
                { icon: "😊", label: "Sentimiento" },
                { icon: "📍", label: "Lugar" },
              ].map(a => (
                <button key={a.label} className="btn-glass" style={{ fontSize: "0.75rem", padding: "5px 12px", display: "flex", alignItems: "center", gap: 4 }}>
                  {a.icon} <span style={{ display: "none" }}>{a.label}</span>
                </button>
              ))}
            </div>
            <button
              className="btn-gold"
              onClick={handlePost}
              disabled={!text.trim()}
              style={{ fontSize: "0.85rem", padding: "0.5rem 1.25rem", opacity: text.trim() ? 1 : 0.5 }}
            >
              Publicar 🌹
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: any }) {
  const [reactions, setReactions] = useState(post.reactions);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");

  const handleReact = (emoji: string) => {
    const newReactions = { ...reactions };
    if (userReaction === emoji) {
      newReactions[emoji] = Math.max(0, (newReactions[emoji] || 0) - 1);
      setUserReaction(null);
    } else {
      if (userReaction) newReactions[userReaction] = Math.max(0, (newReactions[userReaction] || 0) - 1);
      newReactions[emoji] = (newReactions[emoji] || 0) + 1;
      setUserReaction(emoji);
    }
    setReactions(newReactions);
    setShowReactions(false);
  };

  const topReactions = Object.entries(reactions).sort(([, a], [, b]) => (b as number) - (a as number)).slice(0, 3);
  const totalReactions = Object.values(reactions).reduce((s: number, v) => s + (v as number), 0);

  const typeIcon = post.type === "live" ? "🔴" : post.type === "anniversary" ? "🕯️" : post.type === "reel" ? "🎬" : post.type === "story" ? "📖" : "🌹";
  const typeLabel = post.type === "live" ? "En Vivo" : post.type === "anniversary" ? "Aniversario" : post.type === "reel" ? "Reel Memorial" : post.type === "story" ? "Historia" : "Recuerdo";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card animate-in"
      style={{ marginBottom: "1rem", overflow: "hidden" }}
    >
      {post.isLive && (
        <div style={{ background: "linear-gradient(90deg, #cc0000, #ff3333)", padding: "6px 1.25rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span className="live-badge">EN VIVO</span>
          <span style={{ fontSize: "0.82rem", color: "white" }}>👥 {post.liveViewers} espectadores</span>
        </div>
      )}
      {post.isAnniversary && (
        <div style={{ background: "linear-gradient(90deg, rgba(201,168,76,0.15), rgba(232,101,10,0.15))", padding: "8px 1.25rem", display: "flex", gap: "0.5rem", alignItems: "center", borderBottom: "1px solid var(--gold-border)" }}>
          <span className="flame">🕯️</span>
          <span style={{ fontSize: "0.82rem", color: "var(--viva-gold-lt)", fontWeight: 600 }}>Aniversario — Recordamos con amor</span>
        </div>
      )}

      <div style={{ padding: "1.25rem" }}>
        {/* Header */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.9rem" }}>
          <img src={post.author.avatar} alt={post.author.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--viva-gold)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{post.author.name}</span>
              {post.author.verified && <span style={{ fontSize: "0.75rem", color: "var(--viva-gold)" }}>✓</span>}
              <span className="tag tag-gold" style={{ fontSize: "0.65rem" }}>{typeIcon} {typeLabel}</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {new Date(post.timestamp).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}
            </div>
          </div>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1.2rem" }}>⋯</button>
        </div>

        {/* Content */}
        <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--text-primary)", marginBottom: post.image ? "1rem" : 0 }}>
          {post.content}
        </p>

        {/* Image */}
        {post.image && (
          <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: "0.9rem", position: "relative" }}>
            <img src={post.image} alt="post" style={{ width: "100%", display: "block", maxHeight: 380, objectFit: "cover" }} />
            {post.isLive && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <span style={{ fontSize: "1.5rem", marginLeft: 4 }}>▶</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Memorial link */}
        {post.memorial && (
          <Link href={`/memorial/${post.memorial.id}`} style={{ textDecoration: "none" }}>
            <div style={{ background: "var(--gold-glass)", border: "1px solid var(--gold-border)", borderRadius: 12, padding: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.9rem", cursor: "pointer", transition: "all 0.2s" }}>
              <img src={post.memorial.avatar} alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--viva-gold-lt)" }}>🌹 {post.memorial.name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{post.memorial.born} — {post.memorial.died} · Ver memorial →</div>
              </div>
            </div>
          </Link>
        )}

        {/* Reactions display */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem", padding: "0.5rem 0", borderBottom: "1px solid var(--glass-border)", fontSize: "0.82rem", color: "var(--text-muted)" }}>
          <span>
            {topReactions.map(([e]) => e).join(" ")} {totalReactions.toLocaleString("es-MX")}
          </span>
          <span style={{ cursor: "pointer" }} onClick={() => setShowComments(p => !p)}>
            {post.comments} comentarios
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "0.25rem", position: "relative", flexWrap: "wrap" }}>
          {/* React button */}
          <div style={{ position: "relative" }}>
            <button
              className={`reaction-btn ${userReaction ? "active" : ""}`}
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setTimeout(() => setShowReactions(false), 300)}
              onClick={() => handleReact(userReaction || "🌹")}
              style={{ gap: "6px" }}
            >
              {userReaction || "🌹"} {userReaction ? REACTIONS.find(r => r.emoji === userReaction)?.label : "Reaccionar"}
            </button>
            <AnimatePresence>
              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onMouseEnter={() => setShowReactions(true)}
                  onMouseLeave={() => setShowReactions(false)}
                  style={{
                    position: "absolute", bottom: "calc(100% + 8px)", left: 0,
                    background: "var(--viva-card)", border: "1px solid var(--glass-border)",
                    borderRadius: 50, padding: "8px 12px",
                    display: "flex", gap: "8px", zIndex: 50,
                    boxShadow: "var(--shadow-card)", whiteSpace: "nowrap",
                  }}
                >
                  {REACTIONS.map(r => (
                    <button
                      key={r.emoji}
                      onClick={() => handleReact(r.emoji)}
                      title={r.label}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: "1.5rem", transition: "transform 0.2s",
                        filter: userReaction === r.emoji ? "drop-shadow(0 0 6px gold)" : "none",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.3)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      {r.emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button className="reaction-btn">💬 Comentar</button>
          <button className="reaction-btn">↗️ Compartir</button>
          {post.type !== "live" && <button className="reaction-btn">🔖 Guardar</button>}
        </div>

        {/* Comments section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginTop: "0.9rem", paddingTop: "0.9rem", borderTop: "1px solid var(--glass-border)" }}
            >
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                <img src="https://i.pravatar.cc/150?img=1" alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                <input
                  className="input-viva"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Escribe un recuerdo o comentario..."
                  style={{ padding: "0.45rem 0.9rem", fontSize: "0.83rem" }}
                  onKeyDown={e => { if (e.key === "Enter") setComment(""); }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function TrendingPanel() {
  return (
    <div style={{ background: "var(--viva-card)", border: "1px solid var(--glass-border)", borderRadius: 16, padding: "1.25rem", marginBottom: "1rem" }}>
      <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        📈 Tendencias <span className="tag tag-rose" style={{ fontSize: "0.65rem" }}>BETA</span>
      </div>
      <div style={{ textAlign: "center", padding: "1.5rem 0", color: "var(--text-muted)", fontSize: "0.82rem" }}>
        <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>📊</div>
        Las tendencias aparecerán cuando la comunidad crezca.
      </div>
    </div>
  );
}

function UpcomingAnniversaries() {
  return (
    <div style={{ background: "var(--viva-card)", border: "1px solid var(--glass-border)", borderRadius: 16, padding: "1.25rem", marginBottom: "1rem" }}>
      <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem" }}>📅 Próximos Aniversarios</div>
      <div style={{ textAlign: "center", padding: "1.25rem 0", color: "var(--text-muted)", fontSize: "0.82rem" }}>
        <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>🕯️</div>
        Agrega memoriales para ver sus fechas importantes aquí.
        <div style={{ marginTop: "0.75rem" }}>
          <Link href="/memorial" style={{ color: "var(--viva-gold)", textDecoration: "none", fontSize: "0.8rem" }}>+ Crear primer memorial →</Link>
        </div>
      </div>
    </div>
  );
}

function SuggestedMemorials() {
  return (
    <div style={{ background: "var(--viva-card)", border: "1px solid var(--glass-border)", borderRadius: 16, padding: "1.25rem" }}>
      <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem" }}>🌹 Memoriales Destacados</div>
      <div style={{ textAlign: "center", padding: "1.25rem 0", color: "var(--text-muted)", fontSize: "0.82rem" }}>
        <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>⚰️</div>
        Los memoriales de tu familia aparecerán aquí.
      </div>
    </div>
  );
}

export default function FeedPage() {
  const { user, isAuthenticated, getFamilyMembers, getAltaresAdoptados } = useAuth();
  const familyMembers = isAuthenticated ? getFamilyMembers() : [];
  useRouter(); // kept for potential programmatic navigation

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--viva-black)" }}>
        <AppNavbar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", gap: "1.5rem", padding: "2rem", textAlign: "center" }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} style={{ fontSize: "5rem" }}>🌹</motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="font-display" style={{ color: "var(--viva-gold)", fontSize: "2.5rem", fontWeight: 900, marginBottom: "0.5rem" }}>Tu Feed Memorial</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: 400, margin: "0 auto 2rem" }}>Inicia sesión para ver los recuerdos de tu familia.</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/login"><button className="btn-gold" style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}>🌹 Iniciar Sesión</button></Link>
              <Link href="/register"><button className="btn-glass" style={{ fontSize: "1rem", padding: "0.75rem 2rem" }}>✨ Crear Cuenta</button></Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", maxWidth: 700, width: "100%", marginTop: "1rem" }}>
            {[
              { icon: "🌳", title: "Árbol Genealógico", desc: "Conecta 5 generaciones" },
              { icon: "⚰️", title: "Memoriales Eternos", desc: "Honra a quienes amaste" },
              { icon: "🔒", title: "Legacy Vault™", desc: "Cartas para el futuro" },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: "1.25rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.2rem" }}>{f.title}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{f.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--viva-black)" }}>
      <AppNavbar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem", display: "grid", gridTemplateColumns: "240px 1fr 280px", gap: "1.5rem" }}>

        {/* LEFT SIDEBAR */}
        <aside style={{ position: "sticky", top: 76, height: "fit-content" }}>
          <div style={{ background: "var(--viva-card)", border: "1px solid var(--glass-border)", borderRadius: 16, padding: "1rem", marginBottom: "1rem" }}>
            <Link href="/profile/me" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", padding: "0.5rem", borderRadius: 12, cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--glass-bg)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <img src={user?.avatar} alt={user?.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--viva-gold)" }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-primary)" }}>{user?.name}</div>
                  <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>Ver mi perfil</div>
                </div>
              </div>
            </Link>
            <div className="divider" style={{ margin: "0.75rem 0" }} />
            {[
              { href: "/feed", icon: "🏠", label: "Inicio" },
              { href: "/profile/me", icon: "👤", label: "Mi Perfil" },
              { href: "/genealogy", icon: "🌳", label: "Árbol Genealógico" },
              { href: "/explore?tab=altares", icon: "🕯️", label: "Altares" },
              { href: "/map", icon: "🗺️", label: "Mapa Memorial" },
              { href: "/live", icon: "🔴", label: "En Vivo" },
              { href: "/marketplace", icon: "🛒", label: "Marketplace" },
              { href: "/legacy-vault", icon: "🔒", label: "Legacy Vault™" },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                <div className="nav-item" style={{ marginBottom: "2px", fontSize: "0.85rem" }}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
          {/* Mis Altares */}
          <div style={{ background: "var(--viva-card)", border: "1px solid var(--glass-border)", borderRadius: 16, padding: "1rem", marginBottom: "1rem" }}>
            <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>🕯️ Mis Altares</span>
              <Link href="/explore?tab=altares" style={{ fontSize: "0.72rem", color: "var(--viva-gold)", textDecoration: "none" }}>Explorar →</Link>
            </div>
            {getAltaresAdoptados().length === 0 ? (
              <div style={{ textAlign: "center", padding: "0.75rem 0", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem", opacity: 0.4 }}>🕯️</div>
                Aún no has adoptado ningún Altar.
                <div style={{ marginTop: "0.5rem" }}>
                  <Link href="/explore?tab=altares" style={{ color: "var(--viva-gold)", fontSize: "0.75rem", textDecoration: "none" }}>Explorar Altares</Link>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {getAltaresAdoptados().slice(0, 4).map(a => (
                  <Link key={a.id} href={`/altar/${a.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.4rem 0.5rem", borderRadius: 10, cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--glass-bg)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,157,0,0.1)", border: "1px solid var(--altar-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0, animation: "candleGlow 3s ease infinite" }}>
                        🕯️
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.8rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-primary)" }}>{a.name}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--altar-marigold)" }}>{a.born} — {a.died}</div>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link href="/genealogy" style={{ textDecoration: "none" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--viva-gold)", textAlign: "center", marginTop: "0.25rem", cursor: "pointer" }}>+ Crear Altar</div>
                </Link>
              </div>
            )}
          </div>

          <div style={{ background: "var(--gold-glass)", border: "1px solid var(--gold-border)", borderRadius: 16, padding: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>🕯️</div>
            <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--viva-gold-lt)", marginBottom: "0.4rem" }}>Crear Altar</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>Honra a quien amas con un santuario eterno</div>
            <Link href="/genealogy">
              <button className="btn-gold" style={{ fontSize: "0.8rem", padding: "0.5rem 1rem", width: "100%" }}>+ Crear</button>
            </Link>
          </div>
        </aside>

        {/* MAIN FEED */}
        <main>
          <StoryBar user={user} />
          <PostCreator user={user} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: "var(--viva-card)", border: "1px solid var(--glass-border)",
              borderRadius: 16, padding: "3rem 2rem", textAlign: "center",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌹</div>
            <h3 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem", color: "var(--viva-gold)" }}>
              {familyMembers.length > 0 ? `Hola, ${user?.name?.split(" ")[0]} 👋` : "Tu feed está listo"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.6, maxWidth: 380, margin: "0 auto 1.5rem" }}>
              {familyMembers.length > 0
                ? `Tienes ${familyMembers.length} ${familyMembers.length === 1 ? "familiar registrado" : "familiares registrados"} — ${familyMembers.map(m => m.name.split(" ")[0]).join(", ")}. Publica tu primer recuerdo para comenzar.`
                : "Comparte tu primer recuerdo, crea un memorial o conecta con familiares para ver sus publicaciones aquí."}
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              {familyMembers.length > 0 ? (
                <>
                  <Link href="/genealogy"><button className="btn-gold" style={{ fontSize: "0.85rem" }}>🌳 Ver árbol familiar</button></Link>
                  <Link href="/explore"><button className="btn-glass" style={{ fontSize: "0.85rem" }}>🔍 Explorar memoriales</button></Link>
                </>
              ) : (
                <>
                  <Link href="/explore"><button className="btn-gold" style={{ fontSize: "0.85rem" }}>🔍 Explorar memoriales</button></Link>
                  <Link href="/genealogy"><button className="btn-glass" style={{ fontSize: "0.85rem" }}>🌳 Mi árbol familiar</button></Link>
                </>
              )}
            </div>
          </motion.div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside style={{ position: "sticky", top: 76, height: "fit-content" }}>
          <TrendingPanel />
          <UpcomingAnniversaries />
          <SuggestedMemorials />
        </aside>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          main > div, aside { grid-column: 1 / -1 !important; }
        }
      `}</style>
    </div>
  );
}
