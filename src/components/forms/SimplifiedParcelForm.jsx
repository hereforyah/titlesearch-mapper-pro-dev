import React, { useState, useEffect } from 'react';
import { useParcelContext } from '../../context/ParcelContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import useParcelCalculation from '../../hooks/useParcelCalculation';
import floridaCountyCoordinates from '../../utils/floridaCountyCoordinates';
import { getCoordinatesFromPLSS, parsePLSSString } from '../../utils/plssData';

// Florida counties - comprehensive list
const floridaCounties = [
  { value: 'alachua', label: 'Alachua County' },
  { value: 'baker', label: 'Baker County' },
  { value: 'bay', label: 'Bay County' },
  { value: 'bradford', label: 'Bradford County' },
  { value: 'brevard', label: 'Brevard County' },
  { value: 'broward', label: 'Broward County' },
  { value: 'calhoun', label: 'Calhoun County' },
  { value: 'charlotte', label: 'Charlotte County' },
  { value: 'citrus', label: 'Citrus County' },
  { value: 'clay', label: 'Clay County' },
  { value: 'collier', label: 'Collier County' },
  { value: 'columbia', label: 'Columbia County' },
  { value: 'desoto', label: 'DeSoto County' },
  { value: 'dixie', label: 'Dixie County' },
  { value: 'duval', label: 'Duval County' },
  { value: 'escambia', label: 'Escambia County' },
  { value: 'flagler', label: 'Flagler County' },
  { value: 'franklin', label: 'Franklin County' },
  { value: 'gadsden', label: 'Gadsden County' },
  { value: 'gilchrist', label: 'Gilchrist County' },
  { value: 'glades', label: 'Glades County' },
  { value: 'gulf', label: 'Gulf County' },
  { value: 'hamilton', label: 'Hamilton County' },
  { value: 'hardee', label: 'Hardee County' },
  { value: 'hendry', label: 'Hendry County' },
  { value: 'hernando', label: 'Hernando County' },
  { value: 'highlands', label: 'Highlands County' },
  { value: 'hillsborough', label: 'Hillsborough County' },
  { value: 'holmes', label: 'Holmes County' },
  { value: 'indianriver', label: 'Indian River County' },
  { value: 'jackson', label: 'Jackson County' },
  { value: 'jefferson', label: 'Jefferson County' },
  { value: 'lafayette', label: 'Lafayette County' },
  { value: 'lake', label: 'Lake County' },
  { value: 'lee', label: 'Lee County' },
  { value: 'leon', label: 'Leon County' },
  { value: 'levy', label: 'Levy County' },
  { value: 'liberty', label: 'Liberty County' },
  { value: 'madison', label: 'Madison County' },
  { value: 'manatee', label: 'Manatee County' },
  { value: 'marion', label: 'Marion County' },
  { value: 'martin', label: 'Martin County' },
  { value: 'miami-dade', label: 'Miami-Dade County' },
  { value: 'monroe', label: 'Monroe County' },
  { value: 'nassau', label: 'Nassau County' },
  { value: 'okaloosa', label: 'Okaloosa County' },
  { value: 'okeechobee', label: 'Okeechobee County' },
  { value: 'orange', label: 'Orange County' },
  { value: 'osceola', label: 'Osceola County' },
  { value: 'palmbeach', label: 'Palm Beach County' },
  { value: 'pasco', label: 'Pasco County' },
  { value: 'pinellas', label: 'Pinellas County' },
  { value: 'polk', label: 'Polk County' },
  { value: 'putnam', label: 'Putnam County' },
  { value: 'stjohns', label: 'St. Johns County' },
  { value: 'stlucie', label: 'St. Lucie County' },
  { value: 'santarosa', label: 'Santa Rosa County' },
  { value: 'sarasota', label: 'Sarasota County' },
  { value: 'seminole', label: 'Seminole County' },
  { value: 'sumter', label: 'Sumter County' },
  { value: 'suwannee', label: 'Suwannee County' },
  { value: 'taylor', label: 'Taylor County' },
  { value: 'union', label: 'Union County' },
  { value: 'volusia', label: 'Volusia County' },
  { value: 'wakulla', label: 'Wakulla County' },
  { value: 'walton', label: 'Walton County' },
  { value: 'washington', label: 'Washington County' }
];

const SimplifiedParcelForm = () => {
  const [selectedState] = useState('FL'); // Fixed to Florida as per requirements
  const [selectedCounty, setSelectedCounty] = useState('');
  const [plotCalls, setPlotCalls] = useState('');
  const [parsingStatus, setParsingStatus] = useState(null);
  const [closingSuggestion, setClosingSuggestion] = useState(null);
  
  const { addParcel, clearParcels } = useParcelContext();
  const { calculateParcelFromDescription, parsingError, parsingResult } = useParcelCalculation();
  const { updateMapSettings } = useAppSettings();
  
  // Update map view when county is selected
  useEffect(() => {
    if (selectedCounty) {
      const countyData = floridaCountyCoordinates[selectedCounty];
      if (countyData) {
        updateMapSettings({
          center: countyData.center,
          zoom: countyData.zoom
        });
      }
    } else {
      // If no county selected, show all of Florida
      const floridaData = floridaCountyCoordinates.florida;
      updateMapSettings({
        center: floridaData.center,
        zoom: floridaData.zoom
      });
    }
  }, [selectedCounty, updateMapSettings]);
  
  // Handle county selection
  const handleCountyChange = (e) => {
    const county = e.target.value;
    setSelectedCounty(county);
    setParsingStatus(null);
    setClosingSuggestion(null);
  };
  
  // Handle plot map button click
  const handlePlotMap = (e) => {
    e.preventDefault();
    
    if (!plotCalls.trim()) {
      return;
    }
    
    // Create a name based on location information
    let parcelName = 'Unnamed Parcel';
    if (selectedCounty) {
      const countyLabel = floridaCounties.find(c => c.value === selectedCounty)?.label || selectedCounty;
      parcelName = `${countyLabel}, Florida`;
    }
    
    // Check for PLSS notation to determine starting point
    const firstLine = plotCalls.trim().split('\n')[0];
    const plssData = parsePLSSString(firstLine);
    
    let startPoint = { lat: 0, lng: 0 };
    
    if (plssData && selectedCounty) {
      // Use PLSS data to determine starting point
      const plssCoordinates = getCoordinatesFromPLSS(selectedCounty, plssData);
      if (plssCoordinates) {
        startPoint = plssCoordinates;
      }
    } else if (selectedCounty) {
      // Use county center as starting point
      const countyData = floridaCountyCoordinates[selectedCounty];
      if (countyData) {
        startPoint = { lat: countyData.center[0], lng: countyData.center[1] };
      }
    }
    
    const result = calculateParcelFromDescription(
      plotCalls,
      parcelName,
      startPoint
    );
    
    if (result) {
      addParcel(result);
      
      // Check for closure and set status
      if (result.isClosed === false && result.closingSuggestion) {
        setClosingSuggestion(result.closingSuggestion);
        setParsingStatus({
          type: 'warning',
          message: `Parcel plotted successfully. Suggested closing point: ${result.closingSuggestion.description}`
        });
      } else if (result.isValid) {
        setClosingSuggestion(null);
        setParsingStatus({
          type: 'success',
          message: 'Parcel plotted successfully.'
        });
      } else {
        setClosingSuggestion(null);
        setParsingStatus({
          type: 'error',
          message: result.errors?.join(' ') || 'Error plotting parcel.'
        });
      }
    }
  };
  
  // Handle reset map button click
  const handleResetMap = () => {
    clearParcels();
    setPlotCalls('');
    setParsingStatus(null);
    setClosingSuggestion(null);
  };
  
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="mr-2">📍</span> Florida Property Mapper
        </h2>
        <p className="text-sm text-gray-500 mt-1">Map parcels using legal descriptions</p>
      </div>
      
      <form onSubmit={handlePlotMap} className="space-y-5">
        {/* State Display - Fixed to Florida */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700">
            Florida
          </div>
          <p className="text-xs text-gray-500 mt-1">Currently supporting Florida properties only</p>
        </div>
        
        {/* County Dropdown */}
        <div>
          <label htmlFor="county-select" className="block text-sm font-medium text-gray-700 mb-1">
            County
          </label>
          <select
            id="county-select"
            className="form-select w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
            value={selectedCounty}
            onChange={handleCountyChange}
          >
            <option value="">-- Select Florida County --</option>
            {floridaCounties.map(county => (
              <option key={county.value} value={county.value}>
                {county.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Map will automatically zoom to selected county</p>
        </div>
        
        {/* Legal Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="plot-calls" className="block text-sm font-medium text-gray-700">
              <span className="flex items-center">
                <span className="mr-2">📝</span> Legal Description
              </span>
            </label>
            <span className="text-xs text-gray-500">Paste or type plot calls</span>
          </div>
          
          <textarea
            id="plot-calls"
            className="form-textarea min-h-[200px] w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
            value={plotCalls}
            onChange={(e) => setPlotCalls(e.target.value)}
            placeholder="/SW,20,2S,19W
N90E 160
curve left radius 606.00 arc 226.59 delta 21.2524 chord N33.4731W 225.27
N01.2931E 200.61
curve right radius 11559.19 arc 608.86 delta 03.0105 chord N76.0935E 608.79
S03.4532E 159.37
N88.0949W 93.25"
          />
          
          {parsingError && (
            <div className="mt-2 text-red-500 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {parsingError}
            </div>
          )}
          
          {parsingStatus && (
            <div className={`mt-2 text-sm flex items-center ${
              parsingStatus.type === 'success' ? 'text-green-600' : 
              parsingStatus.type === 'warning' ? 'text-amber-600' : 
              'text-red-500'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {parsingStatus.type === 'success' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : parsingStatus.type === 'warning' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
              {parsingStatus.message}
            </div>
          )}
          
          {parsingResult && parsingResult.isValid && (
            <div className="mt-2 text-green-600 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Valid parcel: {parsingResult.coordinates.length} points, 
              Area: {parsingResult.area.toFixed(2)} sq ft, 
              Perimeter: {parsingResult.perimeter.toFixed(2)} ft
            </div>
          )}
          
          {closingSuggestion && (
            <div className="mt-2 bg-amber-50 border border-amber-200 p-3 rounded-md">
              <h4 className="text-amber-800 font-medium text-sm">Parcel Not Closed</h4>
              <p className="text-amber-700 text-xs mt-1">
                The parcel doesn't close properly. Add this line to complete the parcel:
              </p>
              <code className="block mt-2 bg-white p-2 rounded border border-amber-200 text-amber-800 text-xs font-mono">
                {closingSuggestion.description}
              </code>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between pt-3">
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center"
            onClick={handleResetMap}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Map
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={!plotCalls.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Plot Map
          </button>
        </div>
      </form>
    </div>
  );
};

export default SimplifiedParcelForm;
