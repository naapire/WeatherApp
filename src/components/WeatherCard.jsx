import { Sun, Cloud, Droplets, Wind, Thermometer, MapPin, AlertCircle, Loader2 } from "lucide-react";
import { getConditionMeta } from "../constants";

export default function WeatherCard({ weather, loading, error, mapVisible, T }) {
  const mainCond = weather?.weather?.[0];
  const { Icon: MainIcon, color: mainColor } = mainCond
    ? getConditionMeta(mainCond.id)
    : { Icon: Sun, color: "#fde68a" };

  return (
    <div style={{
      background: T.card, border: `1px solid ${T.cardBorder}`,
      borderRadius: 20, padding: 18, backdropFilter: "blur(16px)", boxShadow: T.shadow,
    }}>
      <div style={{ fontSize: 10, color: T.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>
        Current Weather
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
          <Loader2 size={28} color={T.accent} style={{ animation: "spin 1s linear infinite" }} />
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "12px 0", color: "#f87171", fontSize: 12 }}>
          <AlertCircle size={22} style={{ margin: "0 auto 6px" }} /> {error}
        </div>
      ) : weather && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <MainIcon
              size={mapVisible ? 56 : 72}
              color={mainColor}
              style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.2))" }}
            />
            <div>
              <div style={{ fontSize: mapVisible ? 42 : 56, fontWeight: 800, color: T.text, lineHeight: 1 }}>
                {Math.round(weather.main.temp)}°
                <span style={{ fontSize: mapVisible ? 20 : 28 }}>C</span>
              </div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 3, textTransform: "capitalize" }}>
                {weather.weather[0].description}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 14, fontSize: 12, color: T.muted }}>
            <MapPin size={12} color={T.accent} />
            {weather.name}, {weather.sys.country}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { Icon: Droplets,    label: "Humidity",   value: `${weather.main.humidity}%`,                  color: "#67e8f9" },
              { Icon: Wind,        label: "Wind",       value: `${Math.round(weather.wind.speed * 3.6)} km/h`, color: "#93c5fd" },
              { Icon: Thermometer, label: "Feels Like", value: `${Math.round(weather.main.feels_like)}°`,    color: "#fda4af" },
              { Icon: Cloud,       label: "Condition",  value: weather.weather[0].main,                      color: "#d1d5db" },
            ].map(({ Icon: I, label, value, color }, idx) => (
              <div key={idx} style={{ background: T.statBg, borderRadius: 10, padding: "9px 11px" }}>
                <I size={15} color={color} style={{ marginBottom: 3 }} />
                <div style={{ fontSize: 10, color: T.muted }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{value}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}