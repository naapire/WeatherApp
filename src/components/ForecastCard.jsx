import { Loader2 } from "lucide-react";
import { getConditionMeta } from "../constants";

export default function ForecastCard({ forecast, loading, T }) {
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.cardBorder}`,
      borderRadius: 20, padding: 18, backdropFilter: "blur(16px)",
      boxShadow: T.shadow, flex: "1 1 auto", overflowY: "auto",
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 12 }}>
        5-Day Forecast
      </div>

      {loading ? (
        <Loader2 size={22} color={T.accent} style={{ animation: "spin 1s linear infinite" }} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {forecast.map((item, i) => {
            const { Icon: FI, color: fc } = getConditionMeta(item.id);
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "7px 10px", borderRadius: 10, background: T.rowBg,
              }}>
                <span style={{ fontSize: 12, color: T.muted, width: 32 }}>{item.day}</span>
                <FI size={16} color={fc} />
                <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{item.temp}°</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}