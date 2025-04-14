import React from 'react';
import { useParcelContext } from '../../context/ParcelContext';
import useMapInteractions from '../../hooks/useMapInteractions';

const OverlayManager = ({ mapRef }) => {
  const { parcels, activeParcelId, setActiveParcel } = useParcelContext();
  const { fitMapToParcels, centerOnParcel } = useMapInteractions(mapRef);
  
  // Handle fit to parcels button click
  const handleFitToParcels = () => {
    fitMapToParcels();
  };
  
  // Handle parcel selection
  const handleParcelSelect = (e) => {
    const parcelId = e.target.value;
    if (parcelId) {
      centerOnParcel(parcelId);
      setActiveParcel(parcelId);
    }
  };
  
  // Only show if there are parcels
  if (parcels.length === 0) {
    return null;
  }
  
  return (
    <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md z-[1000] max-w-xs">
      <div className="flex flex-col space-y-2">
        <h3 className="font-bold text-sm">Parcels</h3>
        
        <select 
          className="form-input"
          value={activeParcelId || ''}
          onChange={handleParcelSelect}
        >
          <option value="">Select a parcel</option>
          {parcels.map(parcel => (
            <option key={parcel.id} value={parcel.id}>
              {parcel.name}
            </option>
          ))}
        </select>
        
        <button 
          className="btn btn-primary text-sm"
          onClick={handleFitToParcels}
          disabled={parcels.length === 0}
        >
          Fit to All Parcels
        </button>
        
        {parcels.length > 1 && (
          <div className="text-xs text-gray-600 mt-1">
            {parcels.length} parcels loaded
          </div>
        )}
      </div>
    </div>
  );
};

export default OverlayManager;
