import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import floridaCountyBounds from "../../utils/floridaCountyBounds";

function MapUpdater({ selectedCounty }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedCounty) return;

    console.log("🧭 Selected County:", selectedCounty);

    const bounds = floridaCountyBounds[selectedCounty];
    if (bounds) {
      console.log("📍 Zooming to bounds:", bounds);
      map.fitBounds(bounds);
    } else {
      console.warn("⚠️ County not found in bounds data:", selectedCounty);
    }
  }, [selectedCounty, map]);

  return null;
}

function MapViewer({ county }) {
  return (
    <MapContainer
      center={[27.994402, -81.760254]} // Florida center
      zoom={6}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater selectedCounty={county} />
    </MapContainer>
  );
}

export default MapViewer;
