import React from 'react';
import { Polygon, Polyline, CircleMarker, Tooltip } from 'react-leaflet';
import { useParcelContext } from '../../context/ParcelContext';

const ParcelLayer = () => {
  const { parcels, activeParcelId, setActiveParcel, intersections } = useParcelContext();
  
  // Function to handle parcel click
  const handleParcelClick = (parcelId) => {
    setActiveParcel(parcelId);
  };
  
  // Function to check if a parcel has intersections
  const hasIntersections = (parcelId) => {
    return intersections.some(
      intersection => 
        intersection.parcelId1 === parcelId || 
        intersection.parcelId2 === parcelId
    );
  };
  
  return (
    <>
      {parcels.map(parcel => {
        // Convert coordinates to Leaflet format [lat, lng]
        const positions = parcel.coordinates.map(coord => [coord.lat, coord.lng]);
        
        // Skip if not enough points to form a polygon
        if (positions.length < 3) return null;
        
        // Determine if this parcel has intersections
        const hasIntersection = hasIntersections(parcel.id);
        
        // Determine styling based on active state and intersections
        const isActive = parcel.id === activeParcelId;
        const style = {
          ...parcel.style,
          weight: isActive ? 4 : parcel.style.weight,
          color: hasIntersection ? '#ff0000' : parcel.style.color,
          fillOpacity: isActive ? 0.4 : parcel.style.fillOpacity
        };
        
        // Render segments if available (for curves)
        const segments = parcel.segments || [];
        
        return (
          <React.Fragment key={parcel.id}>
            {/* Render the main parcel polygon */}
            <Polygon
              positions={positions}
              pathOptions={style}
              eventHandlers={{
                click: () => handleParcelClick(parcel.id)
              }}
            >
              <Tooltip sticky>
                <div>
                  <strong>{parcel.name}</strong>
                  {hasIntersection && (
                    <div className="text-red-500 font-bold">
                      Warning: Parcel has intersections
                    </div>
                  )}
                  {!parcel.isClosed && (
                    <div className="text-amber-500 font-bold">
                      Warning: Parcel is not closed
                    </div>
                  )}
                </div>
              </Tooltip>
            </Polygon>
            
            {/* Render curve segments with more detail */}
            {segments.filter(segment => segment.type === 'Curve').map((segment, idx) => (
              <Polyline
                key={`curve-${parcel.id}-${idx}`}
                positions={segment.points.map(point => [point.lat, point.lng])}
                pathOptions={{
                  color: style.color,
                  weight: style.weight,
                  opacity: 1
                }}
              />
            ))}
            
            {/* Render closing suggestion if parcel is not closed */}
            {!parcel.isClosed && parcel.closingSuggestion && (
              <Polyline
                positions={[
                  [parcel.coordinates[parcel.coordinates.length - 1].lat, 
                   parcel.coordinates[parcel.coordinates.length - 1].lng],
                  [parcel.coordinates[0].lat, parcel.coordinates[0].lng]
                ]}
                pathOptions={{
                  color: '#FFA500',
                  weight: 2,
                  opacity: 0.7,
                  dashArray: '5, 5'
                }}
              >
                <Tooltip>Suggested closing: {parcel.closingSuggestion.description}</Tooltip>
              </Polyline>
            )}
            
            {/* Render start point marker */}
            <CircleMarker
              center={[parcel.coordinates[0].lat, parcel.coordinates[0].lng]}
              radius={5}
              pathOptions={{
                color: '#00FF00',
                fillColor: '#00FF00',
                fillOpacity: 1
              }}
            >
              <Tooltip>Start Point</Tooltip>
            </CircleMarker>
          </React.Fragment>
        );
      })}
      
      {/* Render intersection points */}
      {intersections.flatMap(intersection => 
        intersection.intersectionPoints.map((point, index) => (
          <CircleMarker
            key={`${intersection.parcelId1}-${intersection.parcelId2}-${index}`}
            center={[point.lat, point.lng]}
            radius={5}
            pathOptions={{
              color: '#ff0000',
              fillColor: '#ff0000',
              fillOpacity: 1
            }}
          >
            <Tooltip>Intersection Point</Tooltip>
          </CircleMarker>
        ))
      )}
    </>
  );
};

export default ParcelLayer;
