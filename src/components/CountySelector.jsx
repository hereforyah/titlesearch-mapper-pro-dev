import React from "react";
import floridaCounties from "../utils/floridaCounties";

function CountySelector({ onCountyChange }) {
  const handleChange = (event) => {
    const selected = event.target.value;
    console.log("✅ Selected County:", selected);
    if (onCountyChange) {
      onCountyChange(selected);
    } else {
      console.warn("🚨 onCountyChange is not a function!");
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-1">
        Select Florida County:
      </label>
      <select
        id="county"
        name="county"
        onChange={handleChange}
        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">-- Select County --</option>
        {floridaCounties.map((countyName) => (
          <option key={countyName} value={countyName}>
            {countyName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CountySelector;
