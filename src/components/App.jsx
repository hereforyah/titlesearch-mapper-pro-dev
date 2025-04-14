import CountySelector from "./CountySelector";
import MapViewer from "./map/MapViewer";
import React, { useState } from "react";
import "leaflet/dist/leaflet.css";

function App() {
  const [selectedCounty, setSelectedCounty] = useState(null);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "300px", padding: "20px", background: "#f9f9f9" }}>
        <h2>Mapper Tool 🗺️</h2>
        <CountySelector onCountyChange={setSelectedCounty} />
      </div>
      <div style={{ flex: 1 }}>
        <MapViewer selectedCounty={selectedCounty} />
      </div>
    </div>
  );
}

export default App;
