import { useState, useEffect, useCallback } from "react";

const API_KEY = "107859b2df7893d5ad4b770c93e4e8e7";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export function useWeather(cityName) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWeather = useCallback(async (city) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );

      if (res.status === 404) throw new Error(`City "${city}" not found.`);
      if (!res.ok) throw new Error("Failed to fetch weather data.");

      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchForecast = useCallback(async (city) => {
    try {
      const res = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&cnt=40`
      );
      if (!res.ok) return;

      const data = await res.json();

      // Pick one reading per day closest to midday
      const days = {};
      data.list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString("en-US", { weekday: "short" });
        const hour = date.getHours();
        if (
          !days[day] ||
          Math.abs(hour - 12) <
            Math.abs(new Date(days[day].dt * 1000).getHours() - 12)
        ) {
          days[day] = item;
        }
      });

      setForecast(
        Object.entries(days)
          .slice(0, 5)
          .map(([day, item]) => ({
            day,
            temp: Math.round(item.main.temp),
            id: item.weather[0].id,
          }))
      );
    } catch {
      // Forecast is non-critical
    }
  }, []);

  useEffect(() => {
    if (cityName) {
      fetchWeather(cityName);
      fetchForecast(cityName);
    }
  }, [cityName, fetchWeather, fetchForecast]);

  return { weather, forecast, loading, error };
}