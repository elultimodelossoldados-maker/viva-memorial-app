// VIVA — Data Layer
// Plataforma limpia — sin datos demo precargados.
// Todo el contenido lo generan los usuarios reales.

// ─── Parentesco Options (used in register & genealogy forms) ─────────────────
export const PARENTESCO_OPTIONS = [
  { group: "Padres", items: ["Padre", "Madre"] },
  { group: "Hijos", items: ["Hijo", "Hija"] },
  { group: "Hermanos", items: ["Hermano", "Hermana"] },
  { group: "Abuelos", items: ["Abuelo", "Abuela"] },
  { group: "Nietos", items: ["Nieto", "Nieta"] },
  { group: "Bisabuelos", items: ["Bisabuelo", "Bisabuela"] },
  { group: "Bisnietos", items: ["Bisnieto", "Bisnieta"] },
  { group: "Tíos", items: ["Tío", "Tía"] },
  { group: "Sobrinos", items: ["Sobrino", "Sobrina"] },
  { group: "Primos", items: ["Primo", "Prima"] },
  { group: "Pareja", items: ["Esposo", "Esposa", "Pareja"] },
  { group: "Suegros", items: ["Suegro", "Suegra"] },
  { group: "Cuñados", items: ["Cuñado", "Cuñada"] },
  { group: "Padrinos", items: ["Padrino", "Madrina"] },
  { group: "Otros", items: ["Tutor", "Familiar", "Amigo cercano", "Otro"] },
];

export const PARENTESCO_FLAT = PARENTESCO_OPTIONS.flatMap(g => g.items);

// ─── Estados de México (32 entidades federativas) ─────────────────────────────
export const ESTADOS_MEXICO = [
  { clave: "AGS", nombre: "Aguascalientes",       region: "Centro-Norte" },
  { clave: "BC",  nombre: "Baja California",       region: "Noroeste" },
  { clave: "BCS", nombre: "Baja California Sur",   region: "Noroeste" },
  { clave: "CAM", nombre: "Campeche",              region: "Sureste" },
  { clave: "CHP", nombre: "Chiapas",               region: "Sur" },
  { clave: "CHH", nombre: "Chihuahua",             region: "Norte" },
  { clave: "CMX", nombre: "Ciudad de México",      region: "Centro" },
  { clave: "COA", nombre: "Coahuila",              region: "Norte" },
  { clave: "COL", nombre: "Colima",                region: "Occidente" },
  { clave: "DUR", nombre: "Durango",               region: "Norte" },
  { clave: "GTO", nombre: "Guanajuato",            region: "Centro" },
  { clave: "GRO", nombre: "Guerrero",              region: "Sur" },
  { clave: "HGO", nombre: "Hidalgo",               region: "Centro" },
  { clave: "JAL", nombre: "Jalisco",               region: "Occidente" },
  { clave: "MEX", nombre: "Estado de México",      region: "Centro" },
  { clave: "MCH", nombre: "Michoacán",             region: "Occidente" },
  { clave: "MOR", nombre: "Morelos",               region: "Centro" },
  { clave: "NAY", nombre: "Nayarit",               region: "Occidente" },
  { clave: "NL",  nombre: "Nuevo León",            region: "Norte" },
  { clave: "OAX", nombre: "Oaxaca",                region: "Sur" },
  { clave: "PUE", nombre: "Puebla",                region: "Centro" },
  { clave: "QRO", nombre: "Querétaro",             region: "Centro" },
  { clave: "QR",  nombre: "Quintana Roo",          region: "Sureste" },
  { clave: "SLP", nombre: "San Luis Potosí",       region: "Centro-Norte" },
  { clave: "SIN", nombre: "Sinaloa",               region: "Noroeste" },
  { clave: "SON", nombre: "Sonora",                region: "Noroeste" },
  { clave: "TAB", nombre: "Tabasco",               region: "Sureste" },
  { clave: "TAM", nombre: "Tamaulipas",            region: "Norte" },
  { clave: "TLA", nombre: "Tlaxcala",              region: "Centro" },
  { clave: "VER", nombre: "Veracruz",              region: "Centro-Golfo" },
  { clave: "YUC", nombre: "Yucatán",               region: "Sureste" },
  { clave: "ZAC", nombre: "Zacatecas",             region: "Centro-Norte" },
] as const;

export type EstadoMexico = typeof ESTADOS_MEXICO[number]["nombre"];

// Group states by region for the selector
export const ESTADOS_BY_REGION = ESTADOS_MEXICO.reduce((acc, e) => {
  if (!acc[e.region]) acc[e.region] = [];
  acc[e.region].push(e);
  return acc;
}, {} as Record<string, typeof ESTADOS_MEXICO[number][]>);

// ─── Empty collections — populated by real users ─────────────────────────────
export const POSTS: never[] = [];
export const MEMORIALS: never[] = [];
export const USERS: never[] = [];
export const STORIES: never[] = [];
export const NOTIFICATIONS: any[] = [];
export const TRENDING: never[] = [];
export const MARKETPLACE_ITEMS: never[] = [];
export const MAP_LOCATIONS: never[] = [];
export const FAMILY_TREE = null;
export const DEMO_USER = null;
