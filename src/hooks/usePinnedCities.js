import { useState, useEffect } from "react";

const STORAGE_KEY = "weatherapp_pinned_cities";

/**
 * usePinnedCities
 *
 * Lets the user pin/unpin cities for quick access. Persists to
 * localStorage so pins survive a page refresh.
 *
 * Returns:
 *   pinnedCities   array of { name, country }
 *   isPinned(name) boolean check
 *   togglePin(name, country)  add or remove a pin
 */
export function usePinnedCities() {
  const [pinnedCities, setPinnedCities] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pinnedCities));
    } catch {
      // storage unavailable or full — skip silently
    }
  }, [pinnedCities]);

  const isPinned = (name) =>
    pinnedCities.some(p => p.name.toLowerCase() === name?.toLowerCase());

  const togglePin = (name, country) => {
    if (!name) return;
    setPinnedCities(prev => {
      const exists = prev.some(p => p.name.toLowerCase() === name.toLowerCase());
      if (exists) return prev.filter(p => p.name.toLowerCase() !== name.toLowerCase());
      return [...prev, { name, country: country || "" }];
    });
  };

  return { pinnedCities, isPinned, togglePin };
}