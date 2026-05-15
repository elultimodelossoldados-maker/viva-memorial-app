"use client";
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { supabase } from "./supabase";
import type { User as SBUser, Session } from "@supabase/supabase-js";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string; name: string; username: string; email: string;
  avatar: string; bio: string; location: string;
  pais?: string; estado?: string; municipio?: string;
  genero?: string; nacimiento?: string;
  followers: number; following: number; memorialsCreated: number;
  verified: boolean; familyTree: string; createdAt: string;
}

export interface FamilyMember {
  id: string; name: string; relation: string;
  born?: string; died?: string; estado?: string;
  pais?: string; municipio?: string; living?: boolean;
  addedAt: string; altarId?: string;
}

export type OfrendarTipo = "vela" | "flor" | "mensaje" | "foto" | "oración" | "carta" | "cancion";
export interface Ofrenda { id: string; tipo: OfrendarTipo; contenido?: string; userId: string; createdAt: string; emoji?: string; userName?: string; }

export interface ConnectedFamily {
  userId: string; userName: string; userAvatar?: string;
  relation?: string; connectedAt: string;
}

export interface DeceasedPerson {
  id: string; name: string; born?: string; died?: string;
  bio?: string; photoUrl?: string; estado?: string;
  pais?: string; municipio?: string; relation?: string;
  createdBy: string; familyTreeId: string;
  connectedFamilies: ConnectedFamily[]; velas: number; flores: number;
  ofrendas: Ofrenda[];
}

export interface RegisterData {
  name: string; username: string; email: string; password: string;
  // Optional onboarding
  familyName?: string; familyRelation?: string;
  memorialName?: string; memorialBorn?: string; memorialDied?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  getAllUsers: () => User[];
  getFamilyMembers: (userId?: string) => FamilyMember[];
  addFamilyMember: (member: Omit<FamilyMember, "id" | "addedAt">) => Promise<boolean>;
  getDeceasedPerson: (id: string) => DeceasedPerson | null;
  getAllDeceased: () => DeceasedPerson[];
  adoptarAltar: (altarId: string, relation: string) => Promise<void>;
  desadoptarAltar: (altarId: string) => Promise<void>;
  isAltarAdoptado: (altarId: string) => boolean;
  getAltaresAdoptados: () => DeceasedPerson[];
  dejarOfrenda: (altarId: string, tipo: OfrendarTipo, contenido?: string) => Promise<void>;
  encenderVela: (altarId: string) => Promise<number>;
  dejarFlor: (altarId: string) => Promise<number>;
  updateAltar: (altarId: string, data: Partial<DeceasedPerson>) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<{ ok: boolean; error?: string }>;
  createAltar: (data: Omit<DeceasedPerson, "id" | "createdBy" | "familyTreeId" | "connectedFamilies" | "velas" | "flores" | "ofrendas">) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => { const c = useContext(AuthContext); if (!c) throw new Error("useAuth must be inside AuthProvider"); return c; };

// ── Helper: map DB row → User ─────────────────────────────────────────────────
function rowToUser(row: Record<string, unknown>, email: string): User {
  return {
    id: row.id as string,
    name: (row.name as string) || "",
    username: (row.username as string) || "",
    email,
    avatar: (row.avatar as string) || "",
    bio: (row.bio as string) || "",
    location: (row.location as string) || "",
    pais: (row.pais as string) || "",
    estado: (row.estado as string) || "",
    municipio: (row.municipio as string) || "",
    genero: (row.genero as string) || "",
    nacimiento: (row.nacimiento as string) || "",
    followers: (row.followers as number) || 0,
    following: (row.following as number) || 0,
    memorialsCreated: 0,
    verified: (row.verified as boolean) || false,
    familyTree: row.id as string,
    createdAt: (row.created_at as string) || new Date().toISOString(),
  };
}

// ── Helper: map DB row → DeceasedPerson ───────────────────────────────────────
function rowToAltar(row: Record<string, unknown>): DeceasedPerson {
  return {
    id: row.id as string,
    name: row.name as string,
    born: (row.born as string) || undefined,
    died: (row.died as string) || undefined,
    bio: (row.bio as string) || "",
    photoUrl: (row.photo_url as string) || "",
    estado: (row.estado as string) || "",
    pais: (row.pais as string) || "",
    municipio: (row.municipio as string) || "",
    relation: (row.relation as string) || "",
    createdBy: (row.created_by as string) || "",
    familyTreeId: (row.created_by as string) || "",
    connectedFamilies: (row.connected_families as ConnectedFamily[]) || [],
    velas: (row.velas as number) || 0,
    flores: (row.flores as number) || 0,
    ofrendas: (row.ofrendas as Ofrenda[]) || [],
  };
}

// ── Helper: map DB row → FamilyMember ────────────────────────────────────────
function rowToMember(row: Record<string, unknown>): FamilyMember {
  return {
    id: row.id as string,
    name: row.name as string,
    relation: (row.relation as string) || "",
    born: (row.born as string) || undefined,
    died: (row.died as string) || undefined,
    estado: (row.estado as string) || undefined,
    pais: (row.pais as string) || undefined,
    municipio: (row.municipio as string) || undefined,
    living: (row.living as boolean) !== false,
    addedAt: (row.added_at as string) || new Date().toISOString(),
    altarId: (row.altar_id as string) || undefined,
  };
}

// ── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [altarsCache, setAltarsCache] = useState<Map<string, DeceasedPerson>>(new Map());
  const [familyCache, setFamilyCache] = useState<FamilyMember[]>([]);
  const [adoptionsCache, setAdoptionsCache] = useState<Set<string>>(new Set());
  const [allUsersCache, setAllUsersCache] = useState<User[]>([]);
  const sbUserRef = useRef<SBUser | null>(null);

  // ── Load altars ────────────────────────────────────────────────────────────
  const loadAltars = async () => {
    const { data } = await supabase.from("altars").select("*");
    if (data) {
      const map = new Map<string, DeceasedPerson>();
      data.forEach((r: Record<string, unknown>) => { const a = rowToAltar(r); map.set(a.id, a); });
      setAltarsCache(map);
    }
  };

  // ── Load family members ────────────────────────────────────────────────────
  const loadFamily = async (userId: string) => {
    const { data } = await supabase.from("family_members").select("*").eq("user_id", userId);
    if (data) setFamilyCache(data.map((r: Record<string, unknown>) => rowToMember(r)));
  };

  // ── Load adoptions ─────────────────────────────────────────────────────────
  const loadAdoptions = async (userId: string) => {
    const { data } = await supabase.from("altar_adoptions").select("altar_id").eq("user_id", userId);
    if (data) setAdoptionsCache(new Set(data.map((r: { altar_id: string }) => r.altar_id)));
  };

  // ── Load all users ─────────────────────────────────────────────────────────
  const loadAllUsers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    if (data) setAllUsersCache(data.map((r: Record<string, unknown>) => rowToUser(r, "")));
  };

  // ── Session init ───────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const timeout = new Promise<void>(r => setTimeout(r, 4000));
      try {
        await Promise.race([
          (async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session && mounted) await onSession(session);
            await Promise.all([loadAltars(), loadAllUsers()]);
          })(),
          timeout,
        ]);
      } catch (e) {
        console.error("VIVA init error:", e);
      } finally {
        setHydrated(true); // Always fire — never leave a blank screen
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session) { await onSession(session); }
      else { setUser(null); setFamilyCache([]); setAdoptionsCache(new Set()); sbUserRef.current = null; }
    });

    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  const onSession = async (session: Session) => {
    sbUserRef.current = session.user;
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    if (profile) {
      setUser(rowToUser(profile as Record<string, unknown>, session.user.email || ""));
      await loadFamily(session.user.id);
      await loadAdoptions(session.user.id);
    }
  };

  // ── Auth functions ─────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  };

  const register = async (data: RegisterData): Promise<{ ok: boolean; error?: string }> => {
    // Check username uniqueness
    const { data: existing } = await supabase.from("profiles").select("id").eq("username", data.username).single();
    if (existing) return { ok: false, error: "Ese nombre de usuario ya está en uso" };

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email, password: data.password,
      options: { data: { name: data.name, username: data.username } },
    });
    if (error) return { ok: false, error: error.message };
    if (!authData.user) return { ok: false, error: "Error al crear usuario" };

    // Insert profile explicitly
    await supabase.from("profiles").upsert({
      id: authData.user.id, name: data.name, username: data.username,
      bio: "", avatar: "", location: "",
    });

    // Auto-login immediately (email confirmation is disabled)
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: data.email, password: data.password,
    });
    if (loginError) return { ok: false, error: loginError.message };

    // Wait for session to fully propagate before inserting related data
    await new Promise(r => setTimeout(r, 800));

    // Save family member + altar from onboarding wizard
    if (data.familyName?.trim()) {
      const isDeceased = !!data.memorialDied;
      let altarId: string | null = null;

      // Create altar for deceased family members
      if (isDeceased) {
        const memName = (data.memorialName || data.familyName).trim();
        const { data: altar, error: altarErr } = await supabase.from("altars").insert({
          name: memName,
          born: data.memorialBorn || "",
          died: data.memorialDied || "",
          bio: "", photo_url: "", estado: "", pais: "", municipio: "",
          relation: data.familyRelation || "",
          created_by: authData.user.id,
          velas: 0, flores: 0, connected_families: [], ofrendas: [],
        }).select("id").single();
        if (!altarErr && altar) altarId = altar.id as string;
      }

      // Add family member to tree
      await supabase.from("family_members").insert({
        user_id: authData.user.id,
        name: data.familyName.trim(),
        relation: data.familyRelation || "",
        born: data.memorialBorn || "",
        died: data.memorialDied || "",
        living: !isDeceased,
        altar_id: altarId,
      });

      // Reload altars cache
      await loadAltars();
    }

    return { ok: true };
  };

  const logout = async () => { await supabase.auth.signOut(); };

  // ── Profile ────────────────────────────────────────────────────────────────
  const updateProfile = async (data: Partial<User>): Promise<{ ok: boolean; error?: string }> => {
    if (!user || !sbUserRef.current) return { ok: false, error: "No hay sesión activa" };

    if (data.username && data.username !== user.username) {
      const { data: ex } = await supabase.from("profiles").select("id").eq("username", data.username).single();
      if (ex) return { ok: false, error: "Ese nombre de usuario ya está en uso" };
    }

    const update: Record<string, unknown> = {};
    if (data.name !== undefined) update.name = data.name;
    if (data.username !== undefined) update.username = data.username;
    if (data.bio !== undefined) update.bio = data.bio;
    if (data.avatar !== undefined) update.avatar = data.avatar;
    if (data.location !== undefined) update.location = data.location;
    if (data.pais !== undefined) update.pais = data.pais;
    if (data.estado !== undefined) update.estado = data.estado;
    if (data.municipio !== undefined) update.municipio = data.municipio;
    if (data.genero !== undefined) update.genero = data.genero;
    if (data.nacimiento !== undefined) update.nacimiento = data.nacimiento;

    const { error } = await supabase.from("profiles").update(update).eq("id", user.id);
    if (error) return { ok: false, error: error.message };

    setUser(prev => prev ? { ...prev, ...data } : prev);
    return { ok: true };
  };

  // ── Altars ─────────────────────────────────────────────────────────────────
  const getAllDeceased = (): DeceasedPerson[] => Array.from(altarsCache.values());
  const getDeceasedPerson = (id: string): DeceasedPerson | null => altarsCache.get(id) || null;

  const createAltar = async (data: Omit<DeceasedPerson, "id" | "createdBy" | "familyTreeId" | "connectedFamilies" | "velas" | "flores" | "ofrendas">): Promise<string | null> => {
    if (!user) return null;
    const { data: inserted, error } = await supabase.from("altars").insert({
      name: data.name, born: data.born || "", died: data.died || "",
      bio: data.bio || "", photo_url: data.photoUrl || "",
      estado: data.estado || "", pais: data.pais || "", municipio: data.municipio || "",
      relation: data.relation || "", created_by: user.id,
      velas: 0, flores: 0, connected_families: [], ofrendas: [],
    }).select("id").single();
    if (error || !inserted) return null;
    await loadAltars();
    return inserted.id as string;
  };

  const updateAltar = async (altarId: string, data: Partial<DeceasedPerson>): Promise<boolean> => {
    const update: Record<string, unknown> = {};
    if (data.bio !== undefined) update.bio = data.bio;
    if (data.photoUrl !== undefined) update.photo_url = data.photoUrl;
    if (data.pais !== undefined) update.pais = data.pais;
    if (data.estado !== undefined) update.estado = data.estado;
    if (data.municipio !== undefined) update.municipio = data.municipio;
    if (data.name !== undefined) update.name = data.name;
    if (data.born !== undefined) update.born = data.born;
    if (data.died !== undefined) update.died = data.died;
    if (data.connectedFamilies !== undefined) update.connected_families = data.connectedFamilies;
    if (data.ofrendas !== undefined) update.ofrendas = data.ofrendas;
    if (data.velas !== undefined) update.velas = data.velas;
    if (data.flores !== undefined) update.flores = data.flores;

    const { error } = await supabase.from("altars").update(update).eq("id", altarId);
    if (error) return false;

    setAltarsCache(prev => {
      const map = new Map(prev);
      const existing = map.get(altarId);
      if (existing) map.set(altarId, { ...existing, ...data });
      return map;
    });
    return true;
  };

  // ── Ofrendas / Velas / Flores ──────────────────────────────────────────────
  const dejarOfrenda = async (altarId: string, tipo: OfrendarTipo, contenido?: string) => {
    if (!user) return;
    const altar = altarsCache.get(altarId);
    if (!altar) return;
    const ofrenda: Ofrenda = { id: `of-${Date.now()}`, tipo, contenido, userId: user.id, createdAt: new Date().toISOString() };
    const newOfrendas = [...altar.ofrendas, ofrenda];
    await updateAltar(altarId, { ofrendas: newOfrendas });
  };

  const encenderVela = async (altarId: string): Promise<number> => {
    const altar = altarsCache.get(altarId);
    if (!altar) return 0;
    const newVelas = altar.velas + 1;
    await updateAltar(altarId, { velas: newVelas });
    return newVelas;
  };

  const dejarFlor = async (altarId: string): Promise<number> => {
    const altar = altarsCache.get(altarId);
    if (!altar) return 0;
    const newFlores = altar.flores + 1;
    await updateAltar(altarId, { flores: newFlores });
    return newFlores;
  };

  // ── Adoptions ──────────────────────────────────────────────────────────────
  const adoptarAltar = async (altarId: string, relation: string) => {
    if (!user) return;
    await supabase.from("altar_adoptions").upsert({ user_id: user.id, altar_id: altarId, relation });
    setAdoptionsCache(prev => new Set([...prev, altarId]));

    // Add user to connected_families as ConnectedFamily object
    const altar = altarsCache.get(altarId);
    if (altar) {
      const alreadyIn = altar.connectedFamilies.some(f => f.userId === user.id);
      if (!alreadyIn) {
        const newFamily: ConnectedFamily = {
          userId: user.id, userName: user.name, userAvatar: user.avatar,
          relation, connectedAt: new Date().toISOString(),
        };
        await updateAltar(altarId, { connectedFamilies: [...altar.connectedFamilies, newFamily] });
      }
    }
  };

  const desadoptarAltar = async (altarId: string) => {
    if (!user) return;
    await supabase.from("altar_adoptions").delete().eq("user_id", user.id).eq("altar_id", altarId);
    setAdoptionsCache(prev => { const s = new Set(prev); s.delete(altarId); return s; });
  };

  const isAltarAdoptado = (altarId: string): boolean => adoptionsCache.has(altarId);

  const getAltaresAdoptados = (): DeceasedPerson[] =>
    Array.from(adoptionsCache).map(id => altarsCache.get(id)).filter(Boolean) as DeceasedPerson[];

  // ── Family ─────────────────────────────────────────────────────────────────
  const getFamilyMembers = (userId?: string): FamilyMember[] => {
    if (userId && userId !== user?.id) return [];
    return familyCache;
  };

  const addFamilyMember = async (member: Omit<FamilyMember, "id" | "addedAt">): Promise<boolean> => {
    if (!user) return false;

    let altarId: string | null = null;

    // If deceased, create an altar first
    if (member.died && !member.living) {
      altarId = await createAltar({
        name: member.name, born: member.born, died: member.died,
        estado: member.estado, pais: member.pais, municipio: member.municipio,
        relation: member.relation, bio: "", photoUrl: "",
      });
    }

    const { error } = await supabase.from("family_members").insert({
      user_id: user.id, name: member.name, relation: member.relation,
      born: member.born || "", died: member.died || "",
      estado: member.estado || "", pais: member.pais || "", municipio: member.municipio || "",
      living: member.living !== false, altar_id: altarId,
    });

    if (error) return false;
    await loadFamily(user.id);
    return true;
  };

  // ── All users (for public profiles) ───────────────────────────────────────
  const getAllUsers = (): User[] => allUsersCache;

  if (!hydrated) return (
    <div style={{
      minHeight: "100vh", background: "#0a0a14",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: "1rem",
    }}>
      <div style={{ fontSize: "2.5rem", animation: "pulse 1.5s ease-in-out infinite" }}>🌹</div>
      <div style={{ color: "rgba(201,168,76,0.7)", fontSize: "0.85rem", letterSpacing: "0.15em" }}>VIVA</div>
    </div>
  );

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, hydrated,
      login, register, logout,
      getAllUsers, getFamilyMembers, addFamilyMember,
      getDeceasedPerson, getAllDeceased,
      adoptarAltar, desadoptarAltar, isAltarAdoptado, getAltaresAdoptados,
      dejarOfrenda, encenderVela, dejarFlor,
      updateAltar, updateProfile, createAltar,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
