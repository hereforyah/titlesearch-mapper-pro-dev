import React, { useState } from "react";
import CountySelector from "./components/CountySelector";
import MapViewer from "./components/map/MapViewer";
import { parseMetesAndBounds } from "./utils/metesAndBoundsParser"; // ✅ Correct path!
import "./assets/styles/tailwind.css";

function App() {
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [plotCalls, setPlotCalls] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);

  const handleCountyChange = (county) => {
    setSelectedCounty(county);
  };

  const handlePlotCallChange = (calls) => {
    setPlotCalls(calls);
    try {
      const parsed = parseMetesAndBounds(calls);
      setParsedData(parsed);
      setError(null);
    } catch (err) {
      console.error("Parsing error:", err);
      setParsedData(null);
      setError("Failed to parse metes and bounds description.");
    }
  };

  return (
    <div className="app-container flex">
      {/* Left Panel */}
      <div className="w-1/3 p-4 bg-gray-100">
        <h2 className="text-xl font-semibold mb-4">🗺️ Mapper Control Panel</h2>
        <CountySelector onCountyChange={handleCountyChange} />
        <textarea
          value={plotCalls}
          onChange={(e) => handlePlotCallChange(e.target.value)}
          placeholder="Enter metes and bounds description here..."
          className="w-full h-48 border rounded p-2 mt-4"
        />
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>

      {/* Map Viewer */}
      <div className="flex-1">
        <MapViewer
          county={selectedCounty}
          coordinates={parsedData?.coordinates || []}
          segments={parsedData?.segments || []}
        />
      </div>
    </div>
  );
}

export default App;
