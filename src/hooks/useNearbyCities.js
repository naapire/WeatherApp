import { useState, useEffect } from "react";
import { GEODB_KEY, GEODB_HOST } from "../constants";

const OWM_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export function useNearbyCities(weather) {
  const [nearbyCities,  setNearbyCities]  = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  useEffect(() => {
    if (!weather?.coord) return;
    const { lat, lon } = weather.coord;
    const currentCity  = weather.name;

    const fetchNearby = async () => {
      setNearbyLoading(true);
      setNearbyCities([]);

      try {
        const latStr = (lat >= 0 ? "+" : "") + parseFloat(lat).toFixed(4);
        const lonStr = (lon >= 0 ? "+" : "") + parseFloat(lon).toFixed(4);

        const geoRes  = await fetch(
          `https://${GEODB_HOST}/v1/geo/locations/${latStr}${lonStr}/nearbyCities?radius=100&minPopulation=10000&limit=6&sort=-population`,
          { headers: { "X-RapidAPI-Key": GEODB_KEY, "X-RapidAPI-Host": GEODB_HOST } }
        );
        const geoJson = await geoRes.json();

        // If there's no data array at all, just leave the list empty — no error shown
        if (!geoJson.data) return;

        const candidates = geoJson.data
          .filter(c => c.city.toLowerCase() !== currentCity.toLowerCase())
          .slice(0, 5);

        const withWeather = await Promise.all(
          candidates.map(async (c) => {
            try {
              const wRes  = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${c.latitude}&lon=${c.longitude}&appid=${OWM_KEY}&units=metric`
              );
              const wJson = await wRes.json();
              if (wJson.cod !== 200) return null;
              return {
                id: c.id, name: c.city, country: c.countryCode,
                main: wJson.main, weather: wJson.weather,
              };
            } catch { return null; }
          })
        );

        setNearbyCities(withWeather.filter(Boolean));
      } catch {
        // Silently fail — leave the list empty, no error message shown
      } finally {
        setNearbyLoading(false);
      }
    };

    fetchNearby();

  // Re-runs whenever the city changes — covers both manual search AND
  // My Location button, since both ultimately update weather.coord
  }, [weather?.coord?.lat, weather?.coord?.lon]);

  return { nearbyCities, nearbyLoading };
}