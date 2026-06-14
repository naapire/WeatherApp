import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export function useMapbox({ containerRef, weather, darkMode, locationGranted }) {
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
        center:    [-0.187, 5.56],
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

  // Sync map style with dark mode
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(
      darkMode ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/streets-v12"
    );
  }, [darkMode]);
}