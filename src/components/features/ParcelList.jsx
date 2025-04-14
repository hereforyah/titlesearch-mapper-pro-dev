import React from 'react';
import { useParcelContext } from '../../context/ParcelContext';
import useMapInteractions from '../../hooks/useMapInteractions';

const ParcelList = () => {
  const { parcels, activeParcelId, setActiveParcel, removeParcel } = useParcelContext();
  const { centerOnParcel } = useMapInteractions();
  
  if (parcels.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No parcels added yet.</p>
        <p className="mt-2 text-sm">Use the Input tab to add parcels to the map.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Parcels</h2>
      
      <div className="space-y-3">
        {parcels.map(parcel => (
          <div 
            key={parcel.id}
            className={`p-3 border rounded-md ${
              activeParcelId === parcel.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{parcel.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {parcel.coordinates.length} points
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  onClick={() => centerOnParcel(parcel.id)}
                  title="Center on map"
                >
                  View
                </button>
                <button
                  className="text-red-600 hover:text-red-800 text-sm"
                  onClick={() => removeParcel(parcel.id)}
                  title="Remove parcel"
                >
                  Remove
                </button>
              </div>
            </div>
            
            {activeParcelId === parcel.id && (
              <div className="mt-2 pt-2 border-t border-gray-200 text-sm">
                <div className="max-h-24 overflow-y-auto">
                  <p className="text-gray-700">{parcel.description}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParcelList;
