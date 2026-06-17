import { useRef, useState, useEffect } from "react";
import { Search, MapPin, Bell, Locate, Loader2 } from "lucide-react";
import { GEODB_KEY, GEODB_HOST, HINT_CITIES } from "../constants";

export default function Header({ city, setCity, geoLoading, handleLocateMe, T }) {
  const [input,       setInput]       = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSug,     setShowSug]     = useState(false);
  const [showHint,    setShowHint]    = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const searchRef    = useRef(null);
  const suggestTimer = useRef(null);

  // FIX: tracks whether the mouse is currently anywhere inside the search
  // wrapper, INCLUDING the dropdown itself (since the dropdown is a child
  // of searchRef's div). onBlur checks this before closing, so moving the
  // mouse from the input down into the list no longer makes it disappear.
  const isHoveringRef = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSug(false);
        setShowHint(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    setShowHint(false);
    clearTimeout(suggestTimer.current);
    if (!val.trim()) { setSuggestions([]); setShowSug(false); return; }

    suggestTimer.current = setTimeout(async () => {
      try {
        const res  = await fetch(
          `https://${GEODB_HOST}/v1/geo/cities?namePrefix=${encodeURIComponent(val)}&limit=6&minPopulation=10000&sort=-population&types=CITY`,
          { headers: { "X-RapidAPI-Key": GEODB_KEY, "X-RapidAPI-Host": GEODB_HOST } }
        );
        const json = await res.json();
        if (json.data?.length) { setSuggestions(json.data); setShowSug(true); }
        else                   { setSuggestions([]);         setShowSug(false); }
      } catch { setSuggestions([]); setShowSug(false); }
    }, 400);
  };

  const handleSearch = (val) => {
    const q = (val || input).trim();
    if (q) { setCity(q); setInput(""); setSuggestions([]); setShowSug(false); setShowHint(false); }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter")  handleSearch(input);
    if (e.key === "Escape") { setShowSug(false); setShowHint(false); }
  };

  const timeStr = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = currentTime.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  const dropRow = {
    width: "100%", display: "flex", alignItems: "center", gap: 10,
    padding: "9px 14px", border: "none", background: "transparent",
    color: T.text, cursor: "pointer", fontSize: 13, textAlign: "left",
  };

  return (
    <header style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", zIndex: 5, flexWrap: "wrap" }}>

      {/* Search */}
      <div
        ref={searchRef}
        style={{ position: "relative", flex: 1, minWidth: 0 }}
        onMouseEnter={() => {
          isHoveringRef.current = true;
          if (!input.trim() && !showSug) setShowHint(true);
        }}
        onMouseLeave={() => {
          isHoveringRef.current = false;
          if (!input.trim()) setShowHint(false);
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: T.input, border: `1px solid ${T.inputBorder}`,
          borderRadius: 14, padding: "10px 14px",
          backdropFilter: "blur(12px)", boxShadow: T.shadow,
        }}>
          <Search size={16} color={T.muted} />
          <input
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (!input.trim()) setShowHint(true); else if (suggestions.length) setShowSug(true); }}
            onBlur={() => setTimeout(() => {
              // FIX: only close if the mouse isn't currently over the
              // dropdown — previously this fired unconditionally and
              // cancelled the hover-open state before a click could land.
              if (!isHoveringRef.current) { setShowHint(false); setShowSug(false); }
            }, 120)}
            placeholder="Search for a city..."
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", color: T.text, fontSize: 14, minWidth: 0 }}
          />
          {geoLoading && <Loader2 size={15} color={T.muted} style={{ animation: "spin 1s linear infinite", flexShrink: 0 }} />}
        </div>

        {/* Hint dropdown */}
        {showHint && !input.trim() && !showSug && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
            background: T.dropBg, border: `1px solid ${T.inputBorder}`,
            borderRadius: 12, overflow: "hidden", zIndex: 100,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}>
            <div style={{ padding: "8px 14px 4px", fontSize: 10, color: T.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Popular Cities
            </div>
            {HINT_CITIES.map((h, i) => (
              <button key={i} onClick={() => handleSearch(h.city)} style={dropRow}
                onMouseEnter={e => e.currentTarget.style.background = T.hover}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <MapPin size={13} color={T.accent} />
                <span style={{ flex: 1 }}>{h.city}</span>
                <span style={{ fontSize: 11, color: T.muted }}>{h.countryCode}</span>
              </button>
            ))}
          </div>
        )}

        {/* Live suggestions */}
        {showSug && suggestions.length > 0 && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
            background: T.dropBg, border: `1px solid ${T.inputBorder}`,
            borderRadius: 12, overflow: "hidden", zIndex: 100,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}>
            <div style={{ padding: "8px 14px 4px", fontSize: 10, color: T.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Cities
            </div>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => handleSearch(s.city)} style={dropRow}
                onMouseEnter={e => e.currentTarget.style.background = T.hover}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <MapPin size={13} color={T.accent} />
                <span style={{ flex: 1 }}>{s.city}</span>
                <span style={{ fontSize: 11, color: T.muted }}>
                  {s.region ? `${s.region}, ` : ""}{s.countryCode}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Locate me */}
      <button onClick={handleLocateMe} style={{
        display: "flex", alignItems: "center", gap: 6, padding: "10px 14px",
        background: T.card, border: `1px solid ${T.cardBorder}`,
        borderRadius: 12, color: T.accent, cursor: "pointer", fontSize: 13,
        fontWeight: 500, backdropFilter: "blur(12px)", whiteSpace: "nowrap", boxShadow: T.shadow, flexShrink: 0,
      }}>
        <Locate size={15} />
        <span className="desktop-header-extras">My Location</span>
      </button>

      {/* Clock — hidden on mobile */}
      <div className="desktop-header-extras" style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: T.text, lineHeight: 1 }}>{timeStr}</div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{dateStr}</div>
      </div>

      <button className="desktop-header-extras" style={{
        width: 38, height: 38, borderRadius: 10, border: `1px solid ${T.cardBorder}`,
        background: T.card, display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", backdropFilter: "blur(12px)", flexShrink: 0,
      }}>
        <Bell size={17} color={T.muted} />
      </button>
    </header>
  );
}