import { useRef } from "react";
import { MapPin } from "lucide-react";
import { useMapbox } from "../hooks/useMapbox";
import "mapbox-gl/dist/mapbox-gl.css";

export default function MapView({ weather, darkMode, locationGranted, lastCoords, T }) {
  const containerRef = useRef(null);

  // FIX: lastCoords passed through so useMapbox can fly to "My Location"
  // GPS coordinates directly, instead of only reacting to `weather`.
  useMapbox({ containerRef, weather, darkMode, locationGranted, lastCoords });

  return (
    <div style={{
      flex: 1, width: "100%", borderRadius: 20, overflow: "hidden", position: "relative",
      border: `1px solid ${T.cardBorder}`, boxShadow: T.shadow,
    }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {weather && (
        <div style={{
          position: "absolute", bottom: 14, left: 14,
          background: darkMode ? "rgba(15,23,42,0.88)" : "rgba(255,255,255,0.88)",
          backdropFilter: "blur(12px)", borderRadius: 10,
          padding: "7px 12px", display: "flex", alignItems: "center", gap: 7,
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        }}>
          <MapPin size={13} color={T.accent} />
          <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>
            {weather.name}, {weather.sys?.country}
          </span>
          <span style={{ fontSize: 12, color: T.muted }}>· {Math.round(weather.main.temp)}°C</span>
        </div>
      )}
    </div>
  );
}