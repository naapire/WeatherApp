import { Star, MapPin, X } from "lucide-react";

/**
 * PinnedCities
 *
 * Shows the user's pinned cities as a compact quick-access list,
 * positioned above the forecast card. Renders nothing if no cities
 * are pinned yet.
 */
export default function PinnedCities({ pinnedCities, city, setCity, togglePin, T }) {
  if (!pinnedCities.length) return null;

  return (
    <div style={{
      background: T.card, border: `1px solid ${T.cardBorder}`,
      borderRadius: 20, padding: 16, backdropFilter: "blur(16px)", boxShadow: T.shadow,
    }}>
      <div style={{
        fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10,
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <Star size={14} color="#fbbf24" fill="#fbbf24" />
        Pinned
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {pinnedCities.map((p, i) => {
          const isSelected = city.toLowerCase() === p.name.toLowerCase();
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "7px 9px", borderRadius: 10,
              background: isSelected ? T.accentBg : T.rowBg,
            }}>
              <button
                onClick={() => setCity(p.name)}
                style={{
                  flex: 1, display: "flex", alignItems: "center", gap: 6,
                  border: "none", background: "transparent", cursor: "pointer",
                  textAlign: "left", color: T.text, fontSize: 13, fontWeight: 500,
                  padding: 0, minWidth: 0,
                }}
              >
                <MapPin size={12} color={T.accent} style={{ flexShrink: 0 }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.name}
                </span>
                {p.country && <span style={{ fontSize: 11, color: T.muted, flexShrink: 0 }}>{p.country}</span>}
              </button>
              <button
                onClick={() => togglePin(p.name, p.country)}
                title="Remove pin"
                style={{
                  width: 20, height: 20, border: "none", background: "transparent",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  color: T.muted, flexShrink: 0,
                }}
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}