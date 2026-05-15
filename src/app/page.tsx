"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

// Particle system
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; color: string;
    }> = [];

    const colors = ["#c9a84c", "#e8650a", "#d4456b", "#f0c060"];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.2,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = canvas.height;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

// Animated counter
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return <span>{count.toLocaleString("es-MX")}{suffix}</span>;
}

const features = [
  { icon: "⚰️", title: "Memorial Eterno", desc: "Perfiles eternos con biografía IA, galería infinita, línea del tiempo y música memorial personalizada." },
  { icon: "🌳", title: "Árbol Genealógico Vivo", desc: "Conecta generaciones con un árbol interactivo. Descubre familiares y une historias a través del tiempo." },
  { icon: "🗺️", title: "Mapa Memorial Mundial", desc: "Localiza tumbas, altares y cementerios históricos. Sugiere negocios afiliados cercanos automáticamente." },
  { icon: "🛒", title: "Marketplace Memorial", desc: "Envía flores, contrata serenatas, compra veladoras y placas QR. Todo con un clic desde cualquier lugar." },
  { icon: "🔴", title: "Homenajes en Vivo", desc: "Transmite funerales, aniversarios y reuniones familiares en tiempo real desde cualquier lugar del mundo." },
  { icon: "🤖", title: "IA Emocional", desc: "Restaura fotos antiguas, coloriza imágenes, genera documentales familiares y detecta parientes automáticamente." },
  { icon: "🔒", title: "Legacy Vault™", desc: "Programa cartas, videos y mensajes para el futuro. Tu legado llegará cuando más importe." },
  { icon: "🌼", title: "Ofrenda Digital", desc: "Enciende velas, deja flores y envía bendiciones a cualquier memorial del mundo, en cualquier momento." },
];

const stats = [
  { value: 2400000, suffix: "+", label: "Memoriales Creados" },
  { value: 890000, suffix: "+", label: "Familias Conectadas" },
  { value: 45, suffix: " países", label: "Alcance Global" },
  { value: 12000000, suffix: "+", label: "Recuerdos Preservados" },
];

const testimonials = [
  {
    name: "Ana Martínez",
    location: "Ciudad de México",
    avatar: "https://i.pravatar.cc/80?img=47",
    text: "VIVA me permitió crear el memorial más hermoso para mi abuela. Toda mi familia en EE.UU. pudo conectarse y dejar sus recuerdos. Fue mágico.",
    rating: 5,
  },
  {
    name: "Jorge Ramírez",
    location: "Guadalajara, Jalisco",
    avatar: "https://i.pravatar.cc/80?img=12",
    text: "El árbol genealógico encontró a primos que no sabíamos que existían en Michoacán. Llevamos 3 meses contactándonos gracias a VIVA.",
    rating: 5,
  },
  {
    name: "Carmen Vázquez",
    location: "Oaxaca",
    avatar: "https://i.pravatar.cc/80?img=45",
    text: "La restauración de fotos con IA es increíble. Vi a mi bisabuela en color por primera vez. Lloré de emoción. Esta plataforma es única en el mundo.",
    rating: 5,
  },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveFeature(p => (p + 1) % features.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ background: "var(--viva-black)", minHeight: "100vh", position: "relative" }}>
      <ParticleCanvas />

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "1rem 2rem",
        background: scrolled ? "rgba(8,8,16,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.1)" : "none",
        transition: "all 0.3s ease",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.8rem" }}>🌹</span>
            <span className="font-display" style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--viva-gold)", letterSpacing: "0.1em" }}>
              VIVA
            </span>
            <span className="tag tag-rose" style={{ fontSize: "0.6rem" }}>BETA</span>
          </div>
        </Link>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/explore" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.2s" }}
            onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--viva-gold)"}
            onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--text-secondary)"}>
            Explorar
          </Link>
          <Link href="/marketplace" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.2s" }}
            onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--viva-gold)"}
            onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--text-secondary)"}>
            Marketplace
          </Link>
          <Link href="/login">
            <button className="btn-glass" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}>
              Iniciar Sesión
            </button>
          </Link>
          <Link href="/register">
            <button className="btn-gold" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}>
              Crear Cuenta
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {/* Background gradient orbs */}
        <div style={{ position: "absolute", top: "20%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,69,107,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(107,47,160,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, position: "relative", zIndex: 1, textAlign: "center", padding: "0 1.5rem", maxWidth: 900 }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
              <span className="tag tag-gold" style={{ fontSize: "0.8rem", padding: "6px 18px", letterSpacing: "0.15em" }}>
                🌹 La Primera Red Social Memorial del Mundo
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="font-display"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 900, lineHeight: 1.05, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}
          >
            <span className="gradient-gold">El Legado</span>
            <br />
            <span style={{ color: "var(--text-primary)" }}>de tu Familia,</span>
            <br />
            <span className="gradient-rose">Eterno y Vivo</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ fontSize: "1.2rem", color: "var(--text-secondary)", maxWidth: 650, margin: "0 auto 2.5rem", lineHeight: 1.7 }}
          >
            VIVA es una celebración eterna del amor, la memoria y el legado familiar.
            Conecta generaciones, preserva recuerdos y honra a quienes siempre amarás.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link href="/register">
              <button className="btn-gold" style={{ fontSize: "1rem", padding: "0.9rem 2.5rem" }}>
                🌹 Crear tu Memorial Gratis
              </button>
            </Link>
            <Link href="/explore">
              <button className="btn-glass" style={{ fontSize: "1rem", padding: "0.9rem 2.5rem" }}>
                ✨ Explorar Memoriales
              </button>
            </Link>
          </motion.div>


        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)" }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center" }}
          >
            <div>↓</div>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.15em", marginTop: 4 }}>DESCUBRIR</div>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "6rem 2rem", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <div style={{ fontSize: "0.8rem", color: "var(--viva-gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            ✦ Todo en una plataforma ✦
          </div>
          <h2 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, marginBottom: "1rem" }}>
            <span className="gradient-gold">Funciones que</span>
            <br />
            <span style={{ color: "var(--text-primary)" }}>transforman la memoria</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
            Facebook, TikTok, Spotify, Pinterest y Apple fusionados en una sola experiencia emocional premium.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card card-hover"
              style={{ padding: "1.75rem", cursor: "pointer" }}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)", fontSize: "1rem" }}>{f.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>



      {/* EMOTIONAL SECTION */}
      <section style={{ padding: "6rem 2rem", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>🌹 🕯️ ❤️ 🌼</div>
            <h2 className="font-display" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1.3, marginBottom: "1.5rem" }}>
              <span style={{ color: "var(--text-primary)" }}>No es tristeza.</span>
              <br />
              <span className="gradient-gold">Es celebración eterna.</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: 1.8, marginBottom: "2rem" }}>
              VIVA nació para transformar el duelo en gratitud, el silencio en historias,
              y los recuerdos en un legado que las generaciones futuras podrán conocer, sentir y amar.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
              {["Nostalgia", "Unión Familiar", "Orgullo Generacional", "Espiritualidad", "Eternidad", "Celebración de la Vida"].map(tag => (
                <span key={tag} className="tag tag-gold">{tag}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "5rem 2rem", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 className="font-display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, marginBottom: "0.5rem" }}>
              Lo que dicen nuestras <span className="gradient-gold">familias</span>
            </h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card"
                style={{ padding: "1.75rem" }}
              >
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1rem" }}>
                  <img src={t.avatar} alt={t.name} className="avatar" style={{ width: 48, height: 48 }} />
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>{t.name}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{t.location}</div>
                  </div>
                </div>
                <div style={{ color: "var(--viva-gold)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
                  {"★".repeat(t.rating)}
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.7, fontStyle: "italic" }}>"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "6rem 2rem", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 700, margin: "0 auto", textAlign: "center",
            background: "linear-gradient(135deg, rgba(201,168,76,0.08), rgba(212,69,107,0.08))",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 24, padding: "4rem 2rem",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>🌹</div>
          <h2 className="font-display" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, marginBottom: "1rem" }}>
            <span className="gradient-gold">Comienza hoy.</span>
            <br />
            <span style={{ color: "var(--text-primary)" }}>El legado no espera.</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", marginBottom: "2rem", lineHeight: 1.7 }}>
            Crea el primer memorial de tu familia en menos de 5 minutos.
            Gratis, para siempre.
          </p>
          <Link href="/register">
            <button className="btn-gold" style={{ fontSize: "1.1rem", padding: "1rem 3rem" }}>
              🌹 Crear mi primer Memorial
            </button>
          </Link>
          <div style={{ marginTop: "1.5rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
            Sin tarjeta de crédito • Sin fecha de vencimiento • Con amor ❤️
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--glass-border)", padding: "3rem 2rem", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.5rem" }}>🌹</span>
              <span className="font-display" style={{ fontSize: "1.3rem", color: "var(--viva-gold)", fontWeight: 700 }}>VIVA</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.83rem", maxWidth: 240, lineHeight: 1.6 }}>
              La primera red social memorial, genealógica y emocional del mundo.
            </p>
          </div>
          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            {([
              { title: "Plataforma", links: [
                { l: "Feed", href: "/feed" }, { l: "Explorar", href: "/explore" },
                { l: "Mapa", href: "/map" }, { l: "Marketplace", href: "/marketplace" },
              ]},
              { title: "Legal", links: [
                { l: "Privacidad", href: "#" }, { l: "Términos", href: "#" }, { l: "Cookies", href: "#" },
              ]},
              { title: "Soporte", links: [
                { l: "Centro de Ayuda", href: "/feed" }, { l: "Contacto", href: "/feed" }, { l: "Comunidad", href: "/explore" },
              ]},
            ] as const).map(col => (
              <div key={col.title}>
                <div style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.83rem", marginBottom: "0.75rem", letterSpacing: "0.05em" }}>{col.title}</div>
                {col.links.map(item => (
                  <Link key={item.l} href={item.href} style={{ display: "block", color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "0.4rem", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--viva-gold)"}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--text-muted)"}
                  >{item.l}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "2rem", color: "var(--text-muted)", fontSize: "0.78rem", borderTop: "1px solid var(--glass-border)", paddingTop: "1.5rem" }}>
          © 2025 VIVA — Hecho con ❤️ en México 🇲🇽 · Una celebración eterna del amor y la memoria.
        </div>
      </footer>
    </div>
  );
}
