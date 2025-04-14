import React, { useState } from 'react';
import { useParcelContext } from '../../context/ParcelContext';
import useParcelCalculation from '../../hooks/useParcelCalculation';

const MetesAndBoundsForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startPoint, setStartPoint] = useState({ lat: 0, lng: 0 });
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const { addParcel } = useParcelContext();
  const { calculateParcelFromDescription, parsingError, parsingResult } = useParcelCalculation();
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!description.trim()) {
      return;
    }
    
    const parcel = calculateParcelFromDescription(
      description,
      name || 'Unnamed Parcel',
      startPoint
    );
    
    if (parcel) {
      addParcel(parcel);
      
      // Reset form
      setName('');
      setDescription('');
    }
  };
  
  // Handle description change with debounce
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  
  // Toggle advanced options
  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Metes & Bounds Input</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="parcel-name" className="block text-sm font-medium text-gray-700 mb-1">
            Parcel Name
          </label>
          <input
            id="parcel-name"
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter parcel name"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="metes-bounds" className="block text-sm font-medium text-gray-700 mb-1">
            Metes & Bounds Description
          </label>
          <textarea
            id="metes-bounds"
            className="form-input min-h-[150px]"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter metes and bounds description (e.g., N 45° 30' 20&quot; E 150.5')"
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
        
        <div className="mb-4">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={toggleAdvanced}
          >
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>
          
          {showAdvanced && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start-lat" className="block text-sm font-medium text-gray-700 mb-1">
                    Starting Latitude
                  </label>
                  <input
                    id="start-lat"
                    type="number"
                    step="any"
                    className="form-input"
                    value={startPoint.lat}
                    onChange={(e) => setStartPoint({ ...startPoint, lat: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label htmlFor="start-lng" className="block text-sm font-medium text-gray-700 mb-1">
                    Starting Longitude
                  </label>
                  <input
                    id="start-lng"
                    type="number"
                    step="any"
                    className="form-input"
                    value={startPoint.lng}
                    onChange={(e) => setStartPoint({ ...startPoint, lng: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Set the starting point for the parcel. Default is (0,0) which will be automatically adjusted to fit the map.
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!description.trim()}
          >
            Add Parcel to Map
          </button>
        </div>
      </form>
    </div>
  );
};

export default MetesAndBoundsForm;
