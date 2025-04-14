// src/App.jsx

import React, { useState, useEffect } from "react";
import MapViewer from "./components/map/MapViewer";
import CountySelector from "./components/CountySelector";
import "leaflet/dist/leaflet.css";
import "./assets/styles/tailwind.css";

function App() {
  const [selectedCounty, setSelectedCounty] = useState(() => {
    // Retrieve from localStorage on first load
    return localStorage.getItem("selectedCounty") || "";
  });

  useEffect(() => {
    if (selectedCounty) {
      console.log("💾 Saving county to localStorage:", selectedCounty);
      localStorage.setItem("selectedCounty", selectedCounty);
    }
  }, [selectedCounty]);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "300px", padding: "20px", background: "#f9f9f9" }}>
        <h2 className="text-lg font-semibold mb-4">Mapper Tool 🗺️</h2>
        <CountySelector onCountyChange={setSelectedCounty} />
      </div>
      <div style={{ flex: 1 }}>
        <MapViewer selectedCounty={selectedCounty} />
      </div>
    </div>
  );
}

export default App;
