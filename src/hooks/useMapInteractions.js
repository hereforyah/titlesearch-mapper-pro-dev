import { useState, useEffect, useRef } from 'react';
import { useParcelContext } from '../context/ParcelContext';
import { useAppSettings } from '../context/AppSettingsContext';
import { checkParcelIntersection } from '../utils/parcelUtils';

/**
 * Custom hook for map interactions
 * @param {Object} mapRef - Reference to the Leaflet map instance
 * @returns {Object} - Map interaction methods
 */
const useMapInteractions = (mapRef) => {
  const { parcels, activeParcelId, setActiveParcel, calculateIntersections } = useParcelContext();
  const { mapSettings, updateMapSettings } = useAppSettings();
  const [isDrawing, setIsDrawing] = useState(false);
  const drawLayerRef = useRef(null);

  // Update map when settings change
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      
      // Set center and zoom
      if (mapSettings.center && mapSettings.zoom) {
        map.setView(mapSettings.center, mapSettings.zoom);
      }
    }
  }, [mapRef, mapSettings]);

  // Save map state when it changes
  const handleMapChange = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      const center = map.getCenter();
      const zoom = map.getZoom();
      
      updateMapSettings({
        center: [center.lat, center.lng],
        zoom
      });
    }
  };

  // Calculate intersections between parcels
  useEffect(() => {
    if (parcels.length >= 2) {
      const intersections = [];
      
      // Check each pair of parcels for intersections
      for (let i = 0; i < parcels.length; i++) {
        for (let j = i + 1; j < parcels.length; j++) {
          const parcel1 = parcels[i];
          const parcel2 = parcels[j];
          
          const intersection = checkParcelIntersection(
            parcel1.coordinates,
            parcel2.coordinates
          );
          
          if (intersection.intersects) {
            intersections.push({
              parcelId1: parcel1.id,
              parcelId2: parcel2.id,
              intersectionPoints: intersection.points
            });
          }
        }
      }
      
      calculateIntersections(intersections);
    }
  }, [parcels, calculateIntersections]);

  // Fit map to show all parcels
  const fitMapToParcels = () => {
    if (mapRef.current && parcels.length > 0) {
      const map = mapRef.current;
      
      // Create bounds object
      const bounds = parcels.reduce((bounds, parcel) => {
        parcel.coordinates.forEach(coord => {
          bounds.extend([coord.lat, coord.lng]);
        });
        return bounds;
      }, L.latLngBounds([]));
      
      // Add padding
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 18
      });
    }
  };

  // Center map on a specific parcel
  const centerOnParcel = (parcelId) => {
    if (mapRef.current) {
      const map = mapRef.current;
      const parcel = parcels.find(p => p.id === parcelId);
      
      if (parcel && parcel.coordinates.length > 0) {
        // Calculate center of parcel
        const sumLat = parcel.coordinates.reduce((sum, coord) => sum + coord.lat, 0);
        const sumLng = parcel.coordinates.reduce((sum, coord) => sum + coord.lng, 0);
        const center = [
          sumLat / parcel.coordinates.length,
          sumLng / parcel.coordinates.length
        ];
        
        map.setView(center, 16);
        setActiveParcel(parcelId);
      }
    }
  };

  return {
    handleMapChange,
    fitMapToParcels,
    centerOnParcel,
    isDrawing,
    setIsDrawing,
    drawLayerRef
  };
};

export default useMapInteractions;
