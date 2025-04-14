import React, { useState } from 'react';
import { useParcelContext } from '../../context/ParcelContext';
import useParcelCalculation from '../../hooks/useParcelCalculation';

// Mock data for dropdowns - would be replaced with actual data in production
const states = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  // Add more states as needed
];

// County data would be dynamic based on state selection
const counties = {
  FL: [
    { value: 'walton', label: 'Walton County' },
    { value: 'bay', label: 'Bay County' },
    { value: 'okaloosa', label: 'Okaloosa County' },
    // Add more counties as needed
  ],
  GA: [
    { value: 'fulton', label: 'Fulton County' },
    { value: 'dekalb', label: 'DeKalb County' },
    // Add more counties as needed
  ],
  // Add more states with their counties
};

const ParcelInformationForm = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [section, setSection] = useState('');
  const [township, setTownship] = useState('');
  const [range, setRange] = useState('');
  const [plotCalls, setPlotCalls] = useState('');
  
  const { addParcel, clearParcels } = useParcelContext();
  const { calculateParcelFromDescription, parsingError, parsingResult } = useParcelCalculation();
  
  // Handle state change
  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setSelectedCounty(''); // Reset county when state changes
  };
  
  // Handle plot map button click
  const handlePlotMap = (e) => {
    e.preventDefault();
    
    if (!plotCalls.trim()) {
      return;
    }
    
    // Create a name based on location information
    let parcelName = 'Unnamed Parcel';
    if (selectedState && selectedCounty) {
      parcelName = `${selectedCounty}, ${selectedState}`;
    }
    if (section && township && range) {
      parcelName += ` (S${section}, T${township}, R${range})`;
    }
    
    const parcel = calculateParcelFromDescription(
      plotCalls,
      parcelName,
      { lat: 0, lng: 0 } // Default starting point
    );
    
    if (parcel) {
      addParcel(parcel);
    }
  };
  
  // Handle reset map button click
  const handleResetMap = () => {
    clearParcels();
    setPlotCalls('');
    // Optionally reset other fields if needed
    // setSection('');
    // setTownship('');
    // setRange('');
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-4 border-b pb-2">
        <h2 className="text-lg font-bold flex items-center">
          <span className="mr-2">📍</span> Parcel Information
        </h2>
      </div>
      
      <form onSubmit={handlePlotMap}>
        {/* State and County Dropdowns */}
        <div className="mb-4">
          <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select State
          </label>
          <select
            id="state-select"
            className="form-select w-full"
            value={selectedState}
            onChange={handleStateChange}
          >
            <option value="">-- Select State --</option>
            {states.map(state => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="county-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select County
          </label>
          <select
            id="county-select"
            className="form-select w-full"
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            disabled={!selectedState}
          >
            <option value="">-- Select County --</option>
            {selectedState && counties[selectedState] && 
              counties[selectedState].map(county => (
                <option key={county.value} value={county.value}>
                  {county.label}
                </option>
              ))
            }
          </select>
        </div>
        
        {/* Section, Township, Range */}
        <div className="mb-4 border-b pb-2">
          <h3 className="text-md font-semibold flex items-center mb-2">
            <span className="mr-2">🧭</span> Section, Township, Range
          </h3>
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
                Section (Optional)
              </label>
              <input
                id="section"
                type="text"
                className="form-input w-full"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="e.g., 20"
              />
            </div>
            
            <div>
              <label htmlFor="township" className="block text-sm font-medium text-gray-700 mb-1">
                Township (Optional)
              </label>
              <input
                id="township"
                type="text"
                className="form-input w-full"
                value={township}
                onChange={(e) => setTownship(e.target.value)}
                placeholder="e.g., 2S"
              />
            </div>
            
            <div>
              <label htmlFor="range" className="block text-sm font-medium text-gray-700 mb-1">
                Range (Optional)
              </label>
              <input
                id="range"
                type="text"
                className="form-input w-full"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="e.g., 19W"
              />
            </div>
          </div>
        </div>
        
        {/* Plot Calls */}
        <div className="mb-4">
          <h3 className="text-md font-semibold flex items-center mb-2">
            <span className="mr-2">📝</span> Plot Calls (Legal Description)
          </h3>
          
          <textarea
            id="plot-calls"
            className="form-input min-h-[150px] w-full"
            value={plotCalls}
            onChange={(e) => setPlotCalls(e.target.value)}
            placeholder="/SW,20,2S,19W
N90E 160
N01.2931E 200.61
S89.5417E 330.00
S00.0417W 200.00
N89.5417W 490.00"
          />
          
          {parsingError && (
            <div className="mt-2 text-red-500 text-sm">
              Error: {parsingError}
            </div>
          )}
          
          {parsingResult && parsingResult.isValid && (
            <div className="mt-2 text-green-500 text-sm">
              Valid parcel: {parsingResult.coordinates.length} points, 
              Area: {parsingResult.area.toFixed(2)} sq ft, 
              Perimeter: {parsingResult.perimeter.toFixed(2)} ft
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            className="btn bg-gray-500 hover:bg-gray-600 text-white"
            onClick={handleResetMap}
          >
            Reset Map
          </button>
          
          <button
            type="submit"
            className="btn bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!plotCalls.trim()}
          >
            Plot Map
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParcelInformationForm;
