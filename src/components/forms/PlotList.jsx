import React, { useState } from "react";
import CountySelector from "./components/CountySelector";
import MapViewer from "./components/map/MapViewer";
import PlotTextInput from "./components/forms/PlotTextInput";
import PlotList from "./components/forms/PlotList";
import { parseMetesAndBounds } from "./utils/metesAndBoundsParser";
import "./assets/styles/tailwind.css";

function App() {
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [plots, setPlots] = useState([]);

  const handleCountyChange = (county) => {
    setSelectedCounty(county);
  };

  const handleParse = (plotText) => {
    const result = parseMetesAndBounds(plotText, {
      lat: 30.4,
      lng: -86.6,
    });

    if (result && result.coordinates.length > 0) {
      const color = getColor(plots.length);
      setPlots([
        ...plots,
        {
          coordinates: result.coordinates,
          label: `Plot ${plots.length + 1}`,
          color,
        },
      ]);
    }
  };

  const handleFocus = (index) => {
    const focused = plots[index];
    if (focused) {
      setSelectedCounty(null); // cancel county zoom if any
      setPlots([...plots]); // force rerender (if needed)
    }
  };

  const handleRemove = (index) => {
    const updated = [...plots];
    updated.splice(index, 1);
    setPlots(updated);
  };

  const getColor = (i) => {
    const colors = [
      "#FF5733",
      "#2ECC71",
      "#3498DB",
      "#F1C40F",
      "#8E44AD",
      "#E67E22",
      "#1ABC9C",
    ];
    return colors[i % colors.length];
  };

  return (
    <div className="flex h-screen">
      <div className="w-[360px] p-4 bg-gray-50 border-r overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Title Mapper 🗺️</h2>
        <CountySelector onCountyChange={handleCountyChange} />
        <PlotTextInput onParse={handleParse} />
        <PlotList plots={plots} onFocus={handleFocus} onRemove={handleRemove} />
      </div>
      <div className="flex-1">
        <MapViewer selectedCounty={selectedCounty} plots={plots} />
      </div>
    </div>
  );
}

export default App;
