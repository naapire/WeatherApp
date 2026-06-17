import { useState, useEffect } from "react";
import "./styles/global.css";

import { getTheme }       from "./utils/theme";
import { useWeather }     from "./hooks/useWeather";
import { useGeolocation } from "./hooks/useGeolocation";
import { usePinnedCities } from "./hooks/usePinnedCities";

import Sidebar      from "./components/Sidebar";
import Header       from "./components/Header";
import WeatherCard  from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import MapView      from "./components/MapView";
import NearbyCities from "./components/NearbyCities";
import PinnedCities from "./components/PinnedCities";

export default function App() {
  const [city,      setCity]      = useState("Accra");
  const [darkMode,  setDarkMode]  = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  const {
    locationGranted, geoLoading, detectedCity, userCountry, setUserCountry,
    handleLocateMe, lastCoords,
  } = useGeolocation();

  const { weather, forecast, loading, error } = useWeather(city);
  const { pinnedCities, isPinned, togglePin } = usePinnedCities();

  useEffect(() => { if (detectedCity) setCity(detectedCity); }, [detectedCity]);

  // FIX: removed the `!userCountry` guard — it was only ever letting this
  // run once, which is why Nearby Cities stayed stuck on the first country
  // (e.g. "GH") even after searching a city in a different country.
  useEffect(() => {
    if (weather?.sys?.country) setUserCountry(weather.sys.country);
  }, [weather]);

  const T          = getTheme(darkMode);
  const mapVisible = locationGranted === true;

  // On mobile, which panel is shown is driven by activeNav
  const showMap      = activeNav === "map"      && mapVisible;
  const showNearby   = activeNav === "compass"  && mapVisible;
  const showWeather  = activeNav === "dashboard" || (!mapVisible);

  return (
    <div style={{
      height: "100vh", background: T.bg, display: "flex",
      fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden",
    }}>
      {/* Cloud blobs — light mode */}
      {!darkMode && [
        { top: "-50px", left: "8%",  w: 240 },
        { top: "-30px", left: "38%", w: 190 },
        { top: "-40px", right: "6%", w: 210 },
      ].map((c, i) => (
        <div key={i} style={{
          position: "absolute", top: c.top, left: c.left, right: c.right,
          width: c.w, height: c.w * 0.55, background: "white", borderRadius: "50%",
          opacity: 0.55, filter: "blur(3px)", pointerEvents: "none",
        }} />
      ))}

      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        T={T}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" }}>
        <Header
          city={city}
          setCity={setCity}
          geoLoading={geoLoading}
          handleLocateMe={handleLocateMe}
          T={T}
        />

        {/* ── Desktop body: all columns side by side ── */}
        <div className="desktop-body" style={{
          flex: 1, display: "flex", gap: 16, padding: "0 20px 20px",
          overflow: "hidden", minHeight: 0, width: "100%",
        }}>
          {/* Left column */}
          <div style={{
            ...(mapVisible ? { width: 260, flexShrink: 0 } : { flex: 1 }),
            display: "flex", flexDirection: "column", gap: 14, transition: "all 0.4s ease",
          }}>
            <WeatherCard
              weather={weather} loading={loading} error={error} mapVisible={mapVisible}
              isPinned={isPinned} togglePin={togglePin} T={T}
            />
            <PinnedCities pinnedCities={pinnedCities} city={city} setCity={setCity} togglePin={togglePin} T={T} />
            <ForecastCard forecast={forecast} loading={loading} T={T} />
          </div>

          {mapVisible && (
            <MapView
              weather={weather} darkMode={darkMode} locationGranted={locationGranted}
              lastCoords={lastCoords} T={T}
            />
          )}

          {mapVisible && (
            <NearbyCities
              weather={weather} city={city} setCity={setCity}
              userCountry={userCountry} locationGranted={locationGranted}
              isPinned={isPinned} togglePin={togglePin} T={T}
            />
          )}
        </div>

        {/* ── Mobile body: one panel at a time ── */}
        <div className="mobile-body" style={{
          flex: 1, overflow: "hidden", padding: "0 14px 80px", display: "flex", flexDirection: "column", gap: 14,
        }}>
          {/* Weather tab */}
          {(showWeather || !mapVisible) && activeNav !== "map" && activeNav !== "compass" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", paddingBottom: 8 }}>
              <WeatherCard
                weather={weather} loading={loading} error={error} mapVisible={false}
                isPinned={isPinned} togglePin={togglePin} T={T}
              />
              <PinnedCities pinnedCities={pinnedCities} city={city} setCity={setCity} togglePin={togglePin} T={T} />
              <ForecastCard forecast={forecast} loading={loading} T={T} />
            </div>
          )}

          {/* Map tab */}
          {showMap && (
            <div style={{ flex: 1, minHeight: 0 }}>
              <MapView
                weather={weather} darkMode={darkMode} locationGranted={locationGranted}
                lastCoords={lastCoords} T={T}
              />
            </div>
          )}

          {/* Nearby/Explore tab */}
          {showNearby && (
            <div style={{ overflowY: "auto", flex: 1 }}>
              <NearbyCities
                weather={weather} city={city} setCity={setCity}
                userCountry={userCountry} locationGranted={locationGranted}
                isPinned={isPinned} togglePin={togglePin} T={T}
              />
            </div>
          )}

          {/* Fallback for map/compass when location not granted */}
          {(activeNav === "map" || activeNav === "compass") && !mapVisible && (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto",
            }}>
              <WeatherCard
                weather={weather} loading={loading} error={error} mapVisible={false}
                isPinned={isPinned} togglePin={togglePin} T={T}
              />
              <ForecastCard forecast={forecast} loading={loading} T={T} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}