"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function MemorialRedirect() {
  const pathname = usePathname();
  const id = pathname?.split("/memorial/")[1]?.replace(/\/$/, "") || "_";
  const router = useRouter();
  useEffect(() => { router.replace(`/altar/${id}`); }, [id, router]);
  return (
    <div style={{ minHeight: "100vh", background: "var(--altar-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem", animation: "candleFlicker 2s ease infinite" }}>🕯️</div>
        <p style={{ color: "var(--altar-text-muted)", fontSize: "0.9rem" }}>Redirigiendo al Altar...</p>
      </div>
    </div>
  );
}
