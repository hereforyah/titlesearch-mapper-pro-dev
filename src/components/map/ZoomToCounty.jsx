// src/components/map/ZoomToCounty.jsx

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import floridaCountyBounds from "../../utils/floridaCountyBounds";

export default function ZoomToCounty({ selectedCounty }) {
  const map = useMap();

  useEffect(() => {
    console.log("🟢 ZoomToCounty - selectedCounty:", selectedCounty);
    if (!selectedCounty) return;

    const bounds = floridaCountyBounds[selectedCounty];
    if (bounds) {
      console.log("📍 Zooming to county bounds:", bounds);
      map.fitBounds(bounds);
    } else {
      console.warn("⚠️ No bounds found for:", selectedCounty);
    }
  }, [selectedCounty, map]);

  return null;
}