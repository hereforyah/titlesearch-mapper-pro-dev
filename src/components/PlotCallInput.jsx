// src/components/PlotCallInput.jsx

import React from "react";

function PlotCallInput({ onPlotCallChange }) {
  const handleChange = (event) => {
    onPlotCallChange(event.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor="plotCalls" className="block text-sm font-medium text-gray-700 mb-1">
        Enter Plot Calls:
      </label>
      <textarea
        id="plotCalls"
        name="plotCalls"
        rows="8"
        onChange={handleChange}
        placeholder="Example:\n/SW,20,2S,19W\n/N90E 160\nN01.2931E 200.61"
        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

export default PlotCallInput;
