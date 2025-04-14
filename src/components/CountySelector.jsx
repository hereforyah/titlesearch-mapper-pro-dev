import React, { useState } from 'react';

const floridaCounties = [
  'Alachua', 'Baker', 'Bay', 'Bradford', 'Brevard', 'Broward',
  'Calhoun', 'Charlotte', 'Citrus', 'Clay', 'Collier', 'Columbia',
  'DeSoto', 'Dixie', 'Duval', 'Escambia', 'Flagler', 'Franklin',
  'Gadsden', 'Gilchrist', 'Glades', 'Gulf', 'Hamilton', 'Hardee',
  'Hendry', 'Hernando', 'Highlands', 'Hillsborough', 'Holmes', 'Indian River',
  'Jackson', 'Jefferson', 'Lafayette', 'Lake', 'Lee', 'Leon',
  'Levy', 'Liberty', 'Madison', 'Manatee', 'Marion', 'Martin',
  'Miami-Dade', 'Monroe', 'Nassau', 'Okaloosa', 'Okeechobee', 'Orange',
  'Osceola', 'Palm Beach', 'Pasco', 'Pinellas', 'Polk', 'Putnam',
  'Santa Rosa', 'Sarasota', 'Seminole', 'St. Johns', 'St. Lucie', 'Sumter',
  'Suwannee', 'Taylor', 'Union', 'Volusia', 'Wakulla', 'Walton',
  'Washington'
];

const CountySelector = ({ selectedCounty, onCountyChange }) => {
  const [county, setCounty] = useState(selectedCounty || '');

  const handleChange = (event) => {
    const newCounty = event.target.value;
    setCounty(newCounty);
    onCountyChange(newCounty); // ✅ Pass to parent component
  };

  return (
    <div className="mb-4">
      <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-1">
        Select Florida County:
      </label>
      <select
        id="county"
        name="county"
        value={county}
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
};

export default CountySelector;
