import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export function useMapbox({ containerRef, weather, darkMode, locationGranted, lastCoords }) {
  const mapRef    = useRef(null);
  const markerRef = useRef(null);

  // Init map once location is granted
  useEffect(() => {
    if (locationGranted !== true || mapRef.current) return;
    const t = setTimeout(() => {
      if (!containerRef.current) return;
      mapRef.current = new mapboxgl.Map({
        container: containerRef.current,
        style:     darkMode ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/streets-v12",
        // FIX: if we already have GPS coords by the time the map mounts,
        // start centred there instead of always defaulting to Accra.
        center:    lastCoords ? [lastCoords.lon, lastCoords.lat] : [-0.187, 5.56],
        zoom:      11,
      });
      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    }, 100);
    return () => clearTimeout(t);
  }, [locationGranted]);

  // Fly to city when weather changes
  useEffect(() => {
    if (!mapRef.current || !weather?.coord) return;
    const { lon, lat } = weather.coord;
    mapRef.current.flyTo({ center: [lon, lat], zoom: 11, speed: 1.4, curve: 1.5, essential: true });
    if (markerRef.current) markerRef.current.remove();
    markerRef.current = new mapboxgl.Marker({ color: "#38bdf8" })
      .setLngLat([lon, lat])
      .addTo(mapRef.current);
  }, [weather]);

  // FIX: fly directly to raw GPS coordinates whenever "My Location" is
  // clicked. This is the missing piece — previously the map only moved
  // via the `weather` effect above, which never re-fires if the resolved
  // city name doesn't change (e.g. user is already viewing their own city
  // and clicks My Location again — `city` state never updates, so
  // `weather` never refetches, so the map never moved).
  useEffect(() => {
    if (!mapRef.current || !lastCoords) return;
    mapRef.current.flyTo({
      center: [lastCoords.lon, lastCoords.lat],
      zoom: 12, speed: 1.4, curve: 1.5, essential: true,
    });
    if (markerRef.current) markerRef.current.remove();
    markerRef.current = new mapboxgl.Marker({ color: "#38bdf8" })
      .setLngLat([lastCoords.lon, lastCoords.lat])
      .addTo(mapRef.current);
  }, [lastCoords]);

  // Sync map style with dark mode
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(
      darkMode ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/streets-v12"
    );
  }, [darkMode]);
}