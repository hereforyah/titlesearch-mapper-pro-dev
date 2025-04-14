import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import floridaCountyBounds from "../../utils/floridaCountyBounds";


function MapUpdater({ selectedCounty }) {
  const map = useMap();

  useEffect(() => {
    console.log("Selected County:", selectedCounty); // ✅ Add this
    if (selectedCounty && floridaCountyBounds[selectedCounty]) {
      const bounds = floridaCountyBounds[selectedCounty];
      console.log("Zooming to bounds:", bounds);
      map.fitBounds(bounds);
    } else {
      console.warn("County not found in bounds data:", selectedCounty);
    }
  }, [selectedCounty, map]);
  

  return null;
}


function MapViewer({ selectedCounty }) {
  return (
    <MapContainer
      center={[27.994402, -81.760254]} // Center of Florida
      zoom={6}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater selectedCounty={selectedCounty} />
    </MapContainer>
  );
}

export default MapViewer;
