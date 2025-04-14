import React, { useState } from "react";
import MapViewer from "./components/map/MapViewer";
import CountySelector from "./components/CountySelector";
import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {
  const [selectedCounty, setSelectedCounty] = useState(null);

  return (
    <div className="app-container">
      <div className="sidebar">
        <h1>Mapper Tool 🗺️</h1>
        {/* ✅ Pass the prop here */}
        <CountySelector onCountyChange={setSelectedCounty} />
      </div>
      <div className="map-container">
        <MapViewer selectedCounty={selectedCounty} />
      </div>
    </div>
  );
}

export default App;
