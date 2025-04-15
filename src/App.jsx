import React, { useState } from "react";
import CountySelector from "./components/CountySelector";
import PlotTextInput from "./components/forms/PlotTextInput";
import MapViewer from "./components/map/MapViewer";
import { parseMetesAndBounds } from "./utils/metesAndBoundsParser";
import detectCountyFromPlss from "./utils/detectCountyFromPlss";
import "leaflet/dist/leaflet.css";
import "./assets/styles/tailwind.css";

// Define reasonable starting points per county
const startingPoints = {
  Leon: { lat: 30.4, lng: -84.3 },
  Walton: { lat: 30.6, lng: -86.2 },
  // Add more counties here as needed
};

export default function App() {
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [plots, setPlots] = useState([]);

  const handleCountyChange = (county) => {
    setSelectedCounty(county);
    console.log("✅ Selected County:", county);
  };

  const handlePlotTextSubmit = (text) => {
    console.log("📝 Plot input received:\n", text);

    // Attempt to detect county from PLSS if not selected
    let detectedCounty = selectedCounty;
    if (!selectedCounty) {
      const detected = detectCountyFromPlss(text);
      if (detected) {
        console.log("🕵️‍♂️ Detected County from PLSS:", detected);
        detectedCounty = detected;
        setSelectedCounty(detected);
      }
    }

    const startingPoint = startingPoints[detectedCounty] || { lat: 0, lng: 0 };
    const parsed = parseMetesAndBounds(text, startingPoint);

    console.log("🧪 Parsed Result:", parsed);

    if (parsed && parsed.coordinates?.length) {
      const newPlot = {
        id: plots.length + 1,
        county: detectedCounty,
        text,
        ...parsed,
      };
      setPlots((prev) => [...prev, newPlot]);
    } else {
      console.warn("⚠️ No coordinates parsed.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="w-[360px] bg-gray-100 p-4 overflow-y-auto shadow-md">
        <h1 className="text-xl font-bold mb-4">🗺️ TitleSearch Mapper</h1>
        <CountySelector onCountyChange={handleCountyChange} />
        <PlotTextInput onParse={handlePlotTextSubmit} />
        <div className="text-sm text-gray-500 mt-4">
          Total Plots: {plots.length}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1">
        <MapViewer selectedCounty={selectedCounty} plots={plots} />
      </div>
    </div>
  );
}
