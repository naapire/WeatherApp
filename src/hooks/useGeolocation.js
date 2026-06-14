import { useState, useEffect } from "react";

const OWM_KEY = import.meta.env.VITE_WEATHER_API_KEY;

async function reverseGeocode(lat, lon) {
  const res  = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OWM_KEY}&units=metric`
  );
  const json = await res.json();
  return { city: json.name || null, country: json.sys?.country || null };
}

export function useGeolocation() {
  const [locationGranted, setLocationGranted] = useState(null);
  const [geoLoading,      setGeoLoading]      = useState(false);
  const [detectedCity,    setDetectedCity]    = useState(null);
  const [userCountry,     setUserCountry]     = useState(null);

  // Ask once on mount
  useEffect(() => {
    if (!navigator.geolocation) { setLocationGranted(false); return; }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setLocationGranted(true);
        try {
          const { city, country } = await reverseGeocode(latitude, longitude);
          if (city)    setDetectedCity(city);
          if (country) setUserCountry(country);
        } catch { /* fall back to default city */ }
        finally { setGeoLoading(false); }
      },
      () => { setLocationGranted(false); setGeoLoading(false); }
    );
  }, []);

  // Manual "locate me" button
  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setLocationGranted(true);
        try {
          const { city, country } = await reverseGeocode(latitude, longitude);
          if (city)    setDetectedCity(city);
          if (country) setUserCountry(country);
        } catch { /* skip */ }
        finally { setGeoLoading(false); }
      },
      () => setGeoLoading(false)
    );
  };

  return { locationGranted, geoLoading, detectedCity, userCountry, setUserCountry, handleLocateMe };
}