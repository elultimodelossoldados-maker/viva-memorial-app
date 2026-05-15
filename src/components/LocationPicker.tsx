"use client";
import { PAISES, getEstados, getMunicipios } from "@/lib/locations";

interface LocationPickerProps {
  pais: string;
  estado: string;
  municipio: string;
  onChange: (field: "pais" | "estado" | "municipio", value: string) => void;
  required?: boolean;
  labelColor?: string;
}

// Explicit dark styles so they always look correct regardless of CSS variables
const sel: React.CSSProperties = {
  width: "100%",
  background: "#12121f",
  border: "1px solid rgba(201,168,76,0.35)",
  borderRadius: 12,
  padding: "0.72rem 1rem",
  color: "#e8e0c8",
  fontSize: "0.9rem",
  outline: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  appearance: "auto",
};

const inp: React.CSSProperties = {
  width: "100%",
  background: "#12121f",
  border: "1px solid rgba(201,168,76,0.35)",
  borderRadius: 12,
  padding: "0.72rem 1rem",
  color: "#e8e0c8",
  fontSize: "0.9rem",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const lbl: React.CSSProperties = {
  display: "block",
  fontSize: "0.82rem",
  marginBottom: "0.35rem",
  fontWeight: 500,
};

// Countries with full dropdown support
const DROPDOWN_COUNTRIES = new Set(["México", "Estados Unidos", "España", "Colombia", "Argentina"]);

export default function LocationPicker({ pais, estado, municipio, onChange, required, labelColor = "#a09070" }: LocationPickerProps) {
  const hasDropdown = DROPDOWN_COUNTRIES.has(pais);
  const estados = hasDropdown ? getEstados(pais) : [];
  const municipios = hasDropdown && estado ? getMunicipios(pais, estado) : [];

  const handlePais = (v: string) => { onChange("pais", v); onChange("estado", ""); onChange("municipio", ""); };
  const handleEstado = (v: string) => { onChange("estado", v); onChange("municipio", ""); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* País */}
      <div>
        <label style={{ ...lbl, color: labelColor }}>🌎 País {required && "*"}</label>
        <select style={sel} value={pais} onChange={e => handlePais(e.target.value)}>
          <option value="" style={{ background: "#12121f" }}>Seleccionar país...</option>
          {PAISES.map(p => <option key={p} value={p} style={{ background: "#12121f" }}>{p}</option>)}
        </select>
      </div>

      {/* Estado */}
      {pais && (
        <div>
          <label style={{ ...lbl, color: labelColor }}>🗺️ Estado / Provincia {required && "*"}</label>
          {hasDropdown ? (
            <select style={sel} value={estado} onChange={e => handleEstado(e.target.value)}>
              <option value="" style={{ background: "#12121f" }}>Seleccionar estado...</option>
              {estados.map(e => <option key={e} value={e} style={{ background: "#12121f" }}>{e}</option>)}
            </select>
          ) : (
            <input style={inp} value={estado} onChange={e => onChange("estado", e.target.value)} placeholder="Escribe el estado o provincia..." />
          )}
        </div>
      )}

      {/* Municipio */}
      {pais && estado && (
        <div>
          <label style={{ ...lbl, color: labelColor }}>📍 Municipio / Ciudad</label>
          {hasDropdown && municipios.length > 0 ? (
            <select style={sel} value={municipio} onChange={e => onChange("municipio", e.target.value)}>
              <option value="" style={{ background: "#12121f" }}>Seleccionar municipio...</option>
              {municipios.map(m => <option key={m} value={m} style={{ background: "#12121f" }}>{m}</option>)}
            </select>
          ) : (
            <input style={inp} value={municipio} onChange={e => onChange("municipio", e.target.value)} placeholder="Escribe el municipio o ciudad..." />
          )}
        </div>
      )}
    </div>
  );
}
