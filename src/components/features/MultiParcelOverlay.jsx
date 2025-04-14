import React, { useState, useEffect } from 'react';
import { useParcelContext } from '../../context/ParcelContext';
import useMapInteractions from '../../hooks/useMapInteractions';

const MultiParcelOverlay = ({ mapRef }) => {
  const { parcels, intersections } = useParcelContext();
  const [showIntersections, setShowIntersections] = useState(true);
  const [highlightMode, setHighlightMode] = useState('none'); // none, active, all
  const { fitMapToParcels } = useMapInteractions(mapRef);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Only show if there are multiple parcels
  if (parcels.length < 2) {
    return null;
  }
  
  const hasIntersections = intersections.length > 0;
  
  // Toggle collapsed state for mobile
  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <div className={`
      absolute bottom-4 right-4 bg-white rounded-md shadow-md z-[1000] max-w-xs
      ${isMobile ? 'right-2 bottom-16 max-w-[calc(100%-1rem)]' : ''}
      ${isCollapsed && isMobile ? 'p-2' : 'p-3'}
    `}>
      {isMobile && isCollapsed ? (
        <button 
          className="w-full text-xs font-medium text-gray-700 flex items-center justify-between"
          onClick={toggleCollapsed}
        >
          <span>Multi-Parcel Controls</span>
          <span>{hasIntersections ? '⚠️' : '✓'}</span>
        </button>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm">Multi-Parcel Overlay</h3>
            {isMobile && (
              <button 
                className="text-gray-500 text-xs"
                onClick={toggleCollapsed}
              >
                Minimize
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Highlight Mode
              </label>
              <select
                className="form-input text-sm py-1"
                value={highlightMode}
                onChange={(e) => setHighlightMode(e.target.value)}
              >
                <option value="none">No Highlight</option>
                <option value="active">Active Parcel Only</option>
                <option value="all">All Parcels</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                id="show-intersections"
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
                checked={showIntersections}
                onChange={(e) => setShowIntersections(e.target.checked)}
              />
              <label htmlFor="show-intersections" className="ml-2 block text-xs text-gray-700">
                Show intersections
              </label>
            </div>
            
            {hasIntersections && showIntersections && (
              <div className="text-xs text-red-600 font-medium">
                Warning: {intersections.length} intersection{intersections.length > 1 ? 's' : ''} detected!
              </div>
            )}
            
            <button
              className="btn btn-primary text-sm w-full"
              onClick={fitMapToParcels}
            >
              Fit All Parcels
            </button>
            
            <div className="text-xs text-gray-600">
              {parcels.length} parcels loaded
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MultiParcelOverlay;
