import React, { useState } from "react";

export default function PlotTextInput({ onParse }) {
  const [plotText, setPlotText] = useState("");

  const handleParse = () => {
    if (plotText.trim()) {
      onParse(plotText);
      setPlotText("");
    }
  };

  return (
    <div className="p-4">
      <label className="font-semibold block mb-1">
        Enter Legal Description or Metes & Bounds
      </label>
      <textarea
        className="w-full h-32 p-2 border rounded text-sm text-gray-800"
        placeholder="Paste plot calls here..."
        value={plotText}
        onChange={(e) => setPlotText(e.target.value)}
      />
      <button
        onClick={handleParse}
        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Plot Description
      </button>
    </div>
  );
}
