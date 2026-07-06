import { Cloud, Loader2, Star } from "lucide-react";
import { getConditionMeta } from "../constants";
import { useNearbyCities } from "../hooks/useNearbyCities";

export default function NearbyCities({ weather, city, setCity, userCountry, locationGranted, isPinned, togglePin, T }) {
  const { nearbyCities, nearbyLoading } = useNearbyCities(weather);

  return (
    <div style={{
      width: 230, flexShrink: 0, background: T.card,
      border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: 18,
      backdropFilter: "blur(16px)", boxShadow: T.shadow,
      display: "flex", flexDirection: "column", gap: 12, overflowY: "auto",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Nearby Cities</span>
        {userCountry && (
          <span style={{ fontSize: 10, color: T.muted, background: T.statBg, padding: "2px 8px", borderRadius: 20 }}>
            {userCountry}
          </span>
        )}
      </div>

      {/* Loading skeletons */}
      {nearbyLoading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              height: 54, borderRadius: 12, background: T.rowBg,
              opacity: 0.4 + i * 0.12, animation: "pulse 1.5s ease-in-out infinite",
            }} />
          ))}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 4 }}>
            <Loader2 size={12} color={T.muted} style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ fontSize: 11, color: T.muted }}>Fetching nearby cities…</span>
          </div>
        </div>
      )}

      {/* Empty state — only shown when not loading and nothing came back */}
      {!nearbyLoading && nearbyCities.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ height: 54, borderRadius: 12, background: T.rowBg, opacity: 0.5 + i * 0.08 }} />
          ))}
          <p style={{ fontSize: 11, color: T.muted, textAlign: "center", marginTop: 4 }}>
            {locationGranted === false ? "Allow location to see nearby cities" : "Loading nearby cities…"}
          </p>
        </div>
      )}

      {/* City rows */}
      {!nearbyLoading && nearbyCities.map((item) => {
        const cond = item.weather?.[0];
        const { Icon: CI, desc, color: cc } = cond
          ? getConditionMeta(cond.id)
          : { Icon: Cloud, desc: "—", color: T.muted };
        const isSelected = item.name.toLowerCase() === city.toLowerCase();
        const pinned = isPinned(item.name);

        return (
          <div key={item.id} style={{
            display: "flex", alignItems: "center", gap: 4,
            borderRadius: 12, background: isSelected ? T.accentBg : T.rowBg,
          }}>
            <button
              onClick={() => setCity(item.name)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 10px",
                border: "none", background: "transparent", cursor: "pointer",
                flex: 1, textAlign: "left", minWidth: 0,
              }}
            >
              <CI size={20} color={cc} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 11, color: T.muted }}>{desc}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text, flexShrink: 0 }}>
                {item.main ? `${Math.round(item.main.temp)}°` : "—"}
              </div>
            </button>

            <button
              onClick={() => togglePin(item.name, item.country)}
              title={pinned ? "Unpin" : "Pin for quick access"}
              style={{
                width: 26, height: 26, border: "none", background: "transparent",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginRight: 6,
              }}
            >
              <Star size={14} color={pinned ? "#fbbf24" : T.muted} fill={pinned ? "#fbbf24" : "none"} />
            </button>
          </div>
        );
      })}

      {/* Save locations promo */}
      <div style={{ marginTop: "auto" }}>
        <div style={{ background: "linear-gradient(135deg,#1a6eb5,#0ea5e9)", borderRadius: 14, padding: 14, color: "white" }}>
          <Star size={16} style={{ marginBottom: 6, opacity: 0.9 }} />
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Save Locations</div>
          <div style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.5 }}>Tap the star on any city to pin it for quick access.</div>
        </div>
      </div>
    </div>
  );
}