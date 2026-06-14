export function getTheme(darkMode) {
  if (darkMode) {
    return {
      bg:          "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)",
      sidebar:     "#1e293b",
      card:        "rgba(30,41,59,0.95)",
      cardBorder:  "rgba(255,255,255,0.08)",
      text:        "#f1f5f9",
      muted:       "#94a3b8",
      accent:      "#38bdf8",
      accentBg:    "rgba(56,189,248,0.15)",
      hover:       "rgba(255,255,255,0.06)",
      input:       "rgba(255,255,255,0.08)",
      inputBorder: "rgba(255,255,255,0.12)",
      statBg:      "rgba(255,255,255,0.05)",
      rowBg:       "rgba(255,255,255,0.04)",
      shadow:      "0 4px 24px rgba(0,0,0,0.4)",
      dropBg:      "#1e293b",
    };
  }
  return {
    bg:          "linear-gradient(135deg,#c8e6f7 0%,#a8d4f0 40%,#7bb8e8 100%)",
    sidebar:     "#1a6eb5",
    card:        "rgba(255,255,255,0.78)",
    cardBorder:  "rgba(255,255,255,0.6)",
    text:        "#1e3a5f",
    muted:       "#5b8db8",
    accent:      "#1a6eb5",
    accentBg:    "rgba(26,110,181,0.12)",
    hover:       "rgba(255,255,255,0.55)",
    input:       "rgba(255,255,255,0.72)",
    inputBorder: "rgba(26,110,181,0.18)",
    statBg:      "rgba(26,110,181,0.06)",
    rowBg:       "rgba(26,110,181,0.05)",
    shadow:      "0 4px 24px rgba(26,110,181,0.12)",
    dropBg:      "white",
  };
}