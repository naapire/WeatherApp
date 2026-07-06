import { useState, useEffect, useCallback } from "react";

const OWM_KEY = import.meta.env.VITE_WEATHER_API_KEY;

async function reverseGeocode(lat, lon) {
  const res  = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OWM_KEY}&units=metric`
  );
  const json = await res.json();
  return { city: json.name || null, country: json.sys?.country || null };
}

export function useGeolocation(setCity) {
  const [locationGranted, setLocationGranted] = useState(null);
  const [geoLoading,      setGeoLoading]      = useState(false);
  const [userCountry,     setUserCountry]     = useState(null);
  const [lastCoords,      setLastCoords]      = useState(null);

  // Ask for permission once on mount
  useEffect(() => {
    if (!navigator.geolocation) { setLocationGranted(false); return; }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setLocationGranted(true);
        setLastCoords({ lat: latitude, lon: longitude });
        try {
          const { city, country } = await reverseGeocode(latitude, longitude);
          // Directly call setCity from App — no intermediate detectedCity state
          // that might not trigger a re-render if the value hasn't changed.
          if (city)    setCity(city);
          if (country) setUserCountry(country);
        } catch { /* fall back to default city */ }
        finally { setGeoLoading(false); }
      },
      () => { setLocationGranted(false); setGeoLoading(false); }
    );
  }, []);

  // "My Location" button — always forces city + coords to update
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setLocationGranted(true);
        // Always set a fresh coords object so MapView's effect fires
        // even if the user is already viewing their own city
        setLastCoords({ lat: latitude, lon: longitude, t: Date.now() });
        try {
          const { city, country } = await reverseGeocode(latitude, longitude);
          // Directly call setCity — bypasses the detectedCity middleman
          // that caused the bug where clicking My Location a second time
          // while already on your city did nothing
          if (city)    setCity(city);
          if (country) setUserCountry(country);
        } catch { /* skip */ }
        finally { setGeoLoading(false); }
      },
      () => setGeoLoading(false)
    );
  }, [setCity]);

  return { locationGranted, geoLoading, userCountry, setUserCountry, handleLocateMe, lastCoords };
}