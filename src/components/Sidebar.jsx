import { Cloud, LayoutDashboard, Map, Compass, MapPin, Settings, Moon } from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", Icon: LayoutDashboard, label: "Weather" },
  { id: "map",       Icon: Map,             label: "Map"     },
  { id: "compass",   Icon: Compass,         label: "Explore" },
  { id: "locations", Icon: MapPin,          label: "Saved"   },
  { id: "settings",  Icon: Settings,        label: "Settings"},
];

export default function Sidebar({ activeNav, setActiveNav, darkMode, setDarkMode, T }) {
  return (
    <>
      {/* ── Desktop sidebar (left column) ── */}
      <aside className="desktop-sidebar" style={{
        width: 72, background: T.sidebar, display: "flex", flexDirection: "column",
        alignItems: "center", padding: "20px 0", gap: 6, flexShrink: 0,
        boxShadow: "2px 0 20px rgba(0,0,0,0.2)", zIndex: 10,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
        }}>
          <Cloud size={22} color="white" />
        </div>

        {NAV_ITEMS.map(({ id, Icon, label }) => (
          <button key={id} title={label} onClick={() => setActiveNav(id)} style={{
            width: 44, height: 44, borderRadius: 12, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", color: "white",
            background: activeNav === id ? "rgba(255,255,255,0.25)" : "transparent",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => { if (activeNav !== id) e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={e => { if (activeNav !== id) e.currentTarget.style.background = "transparent"; }}
          >
            <Icon size={20} />
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <button onClick={() => setDarkMode(p => !p)} title="Toggle theme" style={{
          width: 44, height: 44, borderRadius: 12, border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.15)", color: "white",
        }}>
          <Moon size={18} />
        </button>
      </aside>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="mobile-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: T.sidebar, padding: "8px 0 12px",
        boxShadow: "0 -2px 20px rgba(0,0,0,0.2)",
        justifyContent: "space-around", alignItems: "center",
      }}>
        {NAV_ITEMS.map(({ id, Icon, label }) => (
          <button key={id} onClick={() => setActiveNav(id)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            border: "none", background: "transparent", cursor: "pointer",
            color: activeNav === id ? "white" : "rgba(255,255,255,0.5)",
            padding: "4px 12px", borderRadius: 10, transition: "color 0.2s",
          }}>
            <Icon size={20} />
            <span style={{ fontSize: 10, fontWeight: activeNav === id ? 700 : 400 }}>{label}</span>
          </button>
        ))}

        <button onClick={() => setDarkMode(p => !p)} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          border: "none", background: "transparent", cursor: "pointer",
          color: "rgba(255,255,255,0.5)", padding: "4px 12px", borderRadius: 10,
        }}>
          <Moon size={20} />
          <span style={{ fontSize: 10 }}>Theme</span>
        </button>
      </nav>
    </>
  );
}