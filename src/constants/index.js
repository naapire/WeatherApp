import { Cloud, CloudRain, Sun, Wind } from "lucide-react";

export const GEODB_KEY  = "958331fa39mshb31e15a8bbfb0bcp17197ajsn311fe5a2fefa";
export const GEODB_HOST = "wft-geo-db.p.rapidapi.com";

export const HINT_CITIES = [
  { city: "Accra",    countryCode: "GH" },
  { city: "London",   countryCode: "GB" },
  { city: "New York", countryCode: "US" },
  { city: "Tokyo",    countryCode: "JP" },
  { city: "Lagos",    countryCode: "NG" },
  { city: "Paris",    countryCode: "FR" },
];

export function getConditionMeta(id) {
  if (id >= 200 && id < 300) return { Icon: CloudRain, desc: "Thunderstorm", color: "#a78bfa" };
  if (id >= 300 && id < 400) return { Icon: CloudRain, desc: "Drizzle",      color: "#67e8f9" };
  if (id >= 500 && id < 600) return { Icon: CloudRain, desc: "Rain",         color: "#93c5fd" };
  if (id >= 600 && id < 700) return { Icon: Cloud,     desc: "Snow",         color: "#e2e8f0" };
  if (id >= 700 && id < 800) return { Icon: Wind,      desc: "Hazy",         color: "#d1d5db" };
  if (id === 800)             return { Icon: Sun,       desc: "Clear",        color: "#fde68a" };
  if (id > 800)               return { Icon: Cloud,     desc: "Cloudy",       color: "#cbd5e1" };
  return                             { Icon: Sun,       desc: "Sunny",        color: "#fde68a" };
}