# Titlesearch Pro Mapper - Technical Documentation

## Architecture Overview

Titlesearch Pro Mapper is built using a modern React.js architecture with a component-based structure. The application follows a clean separation of concerns with distinct layers for UI components, business logic, data management, and utilities.

### Key Technologies

- **Frontend Framework**: React.js with Vite
- **Mapping Library**: Leaflet.js with React-Leaflet
- **Styling**: Tailwind CSS
- **Export Capabilities**: jsPDF and html2canvas
- **State Management**: React Context API
- **Storage**: Browser localStorage

### Directory Structure

```
titlesearch-pro-mapper/
├── mapper/                  # Mapper application (Phase 1)
│   ├── src/
│   │   ├── assets/          # Static assets and styles
│   │   ├── components/      # React components
│   │   │   ├── layout/      # Layout components
│   │   │   ├── map/         # Map-related components
│   │   │   ├── forms/       # Input forms
│   │   │   ├── ui/          # Reusable UI components
│   │   │   └── features/    # Feature-specific components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   ├── public/              # Public assets
│   └── index.html           # Entry HTML file
├── scanner/                 # Scanner application (Phase 2)
└── shared/                  # Shared utilities
    └── utils/               # Common utility functions
```

## Component Architecture

### Core Components

#### App Component
The main application component that orchestrates the overall layout and state providers.

```jsx
// App.jsx
import React from 'react';
import { ParcelProvider } from '../context/ParcelContext';
import { AppSettingsProvider } from '../context/AppSettingsContext';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import MapViewer from './map/MapViewer';

const App = () => {
  // Mobile responsiveness logic
  
  return (
    <AppSettingsProvider>
      <ParcelProvider>
        <div className="flex flex-col h-screen">
          <Header />
          <div className="flex flex-1 overflow-hidden relative">
            <Sidebar />
            <main className="flex-1 relative">
              <MapViewer />
              {/* Mobile controls */}
            </main>
          </div>
        </div>
      </ParcelProvider>
    </AppSettingsProvider>
  );
};
```

#### MapViewer Component
The central map display component that integrates Leaflet.js and manages map interactions.

```jsx
// MapViewer.jsx
import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ParcelLayer from './ParcelLayer';
import ControlPanel from './ControlPanel';
import ExportPanel from '../features/ExportPanel';
import MultiParcelOverlay from '../features/MultiParcelOverlay';

const MapViewer = () => {
  const mapRef = useRef(null);
  
  // Map initialization and event handlers
  
  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[40.7128, -74.0060]} // Default: New York
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ParcelLayer />
        {/* Additional map components */}
      </MapContainer>
      
      <ControlPanel mapRef={mapRef} />
      <ExportPanel mapRef={mapRef} />
      <MultiParcelOverlay mapRef={mapRef} />
    </div>
  );
};
```

#### MetesAndBoundsForm Component
Handles user input for parcel descriptions and processes them for rendering.

```jsx
// MetesAndBoundsForm.jsx
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
  
  // Form submission and validation logic
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Metes & Bounds Input</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
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
```

### State Management

The application uses React Context API for state management, with two main contexts:

#### ParcelContext
Manages the state of all parcels, their visibility, and intersection detection.

```jsx
// ParcelContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { detectIntersections } from '../utils/parcelUtils';

const ParcelContext = createContext();

export const useParcelContext = () => useContext(ParcelContext);

export const ParcelProvider = ({ children }) => {
  const [parcels, setParcels] = useState([]);
  const [activeParcelId, setActiveParcelId] = useState(null);
  const [intersections, setIntersections] = useState([]);
  
  // Add, remove, update parcel functions
  
  // Intersection detection logic
  useEffect(() => {
    if (parcels.length >= 2) {
      const detected = detectIntersections(parcels);
      setIntersections(detected);
    } else {
      setIntersections([]);
    }
  }, [parcels]);
  
  const value = {
    parcels,
    addParcel,
    removeParcel,
    updateParcel,
    activeParcelId,
    setActiveParcelId,
    intersections,
    // Additional methods
  };
  
  return (
    <ParcelContext.Provider value={value}>
      {children}
    </ParcelContext.Provider>
  );
};
```

#### AppSettingsContext
Manages application-wide settings like map preferences and UI state.

```jsx
// AppSettingsContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AppSettingsContext = createContext();

export const useAppSettings = () => useContext(AppSettingsContext);

export const AppSettingsProvider = ({ children }) => {
  const [mapSettings, setMapSettings] = useState({
    baseLayer: 'openstreetmap',
    showLabels: true,
  });
  
  const [uiSettings, setUiSettings] = useState({
    sidebarWidth: 350,
    sidebarVisible: true,
    activeTab: 'input',
  });
  
  // Settings update methods
  
  const value = {
    mapSettings,
    updateMapSettings,
    uiSettings,
    updateUiSettings,
    // Additional methods
  };
  
  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};
```

## Core Utilities

### Metes and Bounds Parser

The parser converts legal descriptions into geographic coordinates.

```javascript
// metesAndBoundsParser.js
export function parseMetesAndBounds(description) {
  // Tokenize the description
  const tokens = tokenizeDescription(description);
  
  // Parse tokens into segments
  const segments = parseTokensToSegments(tokens);
  
  // Validate segments
  if (!validateSegments(segments)) {
    throw new Error('Invalid metes and bounds description');
  }
  
  return segments;
}

export function calculateCoordinates(segments, startPoint = { lat: 0, lng: 0 }) {
  // Convert segments to coordinates
  let coordinates = [startPoint];
  let currentPoint = { ...startPoint };
  
  segments.forEach(segment => {
    // Calculate next point based on bearing and distance
    const nextPoint = calculateNextPoint(
      currentPoint,
      segment.bearing,
      segment.distance
    );
    
    coordinates.push(nextPoint);
    currentPoint = nextPoint;
  });
  
  return coordinates;
}
```

### Parcel Utilities

Utilities for working with parcel data, including intersection detection.

```javascript
// parcelUtils.js
export function calculateParcelArea(coordinates) {
  // Calculate area using the Shoelace formula
  let area = 0;
  
  for (let i = 0; i < coordinates.length - 1; i++) {
    area += coordinates[i].lat * coordinates[i + 1].lng - 
            coordinates[i + 1].lat * coordinates[i].lng;
  }
  
  return Math.abs(area) / 2;
}

export function detectIntersections(parcels) {
  const intersections = [];
  
  // Check each pair of parcels for intersections
  for (let i = 0; i < parcels.length; i++) {
    for (let j = i + 1; j < parcels.length; j++) {
      if (doPolygonsIntersect(parcels[i].coordinates, parcels[j].coordinates)) {
        intersections.push({
          parcel1Id: parcels[i].id,
          parcel2Id: parcels[j].id,
          // Additional intersection data
        });
      }
    }
  }
  
  return intersections;
}
```

### Export Utilities

Utilities for exporting maps to PDF and PNG formats.

```javascript
// exportUtils.js
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDF({
  mapElement,
  parcels,
  title,
  client,
  date,
  includeMetadata,
  orientation
}) {
  // Create PDF document
  const pdf = new jsPDF({
    orientation: orientation,
    unit: 'mm',
  });
  
  // Capture map as canvas
  const canvas = await html2canvas(mapElement);
  const imgData = canvas.toDataURL('image/png');
  
  // Add map image to PDF
  pdf.addImage(imgData, 'PNG', 10, 10, 190, 130);
  
  // Add metadata if requested
  if (includeMetadata) {
    addMetadataToPDF(pdf, parcels, title, client, date);
  }
  
  return pdf.output('blob');
}

export async function generatePNG({
  mapElement,
  resolution,
  fileName
}) {
  // Set scale based on resolution
  const scale = resolution === 'high' ? 2 : 
                resolution === 'print' ? 3 : 1;
  
  // Capture map as canvas with appropriate scale
  const canvas = await html2canvas(mapElement, {
    scale: scale,
    useCORS: true,
    logging: false
  });
  
  // Convert to blob
  return new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve({
        blob,
        fileName: `${fileName}.png`
      });
    }, 'image/png');
  });
}
```

## Custom Hooks

### useLocalStorage

Custom hook for persistent storage of application data.

```javascript
// useLocalStorage.js
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  // Return a wrapped version of useState's setter function
  const setValue = value => {
    try {
      // Allow value to be a function
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
}
```

### useMapInteractions

Custom hook for map interactions and controls.

```javascript
// useMapInteractions.js
import { useCallback } from 'react';
import L from 'leaflet';
import { useParcelContext } from '../context/ParcelContext';

export default function useMapInteractions(mapRef) {
  const { parcels } = useParcelContext();
  
  const fitMapToParcels = useCallback(() => {
    if (!mapRef.current || parcels.length === 0) return;
    
    const map = mapRef.current;
    
    // Create bounds from all parcel coordinates
    const bounds = new L.LatLngBounds();
    
    parcels.forEach(parcel => {
      parcel.coordinates.forEach(coord => {
        bounds.extend([coord.lat, coord.lng]);
      });
    });
    
    // Fit map to bounds with padding
    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 18
    });
  }, [mapRef, parcels]);
  
  const changeBaseLayer = useCallback((layerType) => {
    if (!mapRef.current) return;
    
    const map = mapRef.current;
    
    // Remove current base layers
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });
    
    // Add new base layer
    let tileLayer;
    
    switch (layerType) {
      case 'satellite':
        tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
        break;
      case 'terrain':
        tileLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
        break;
      default: // openstreetmap
        tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    }
    
    tileLayer.addTo(map);
  }, [mapRef]);
  
  return {
    fitMapToParcels,
    changeBaseLayer,
    // Additional map interaction methods
  };
}
```

## Responsive Design

The application implements a responsive design approach to ensure usability across desktop and mobile devices:

### Responsive Strategies

1. **Fluid Layout**: The application uses a flexible layout that adapts to different screen sizes.

2. **Mobile-First Components**: UI components are designed with mobile considerations in mind:
   - Collapsible sidebar
   - Touch-friendly controls
   - Optimized spacing for smaller screens

3. **Media Queries**: Tailwind CSS breakpoints are used to apply different styles based on screen size:
   - `sm`: 640px and up
   - `md`: 768px and up
   - `lg`: 1024px and up
   - `xl`: 1280px and up

4. **Conditional Rendering**: Different UI elements are rendered based on device type:
   ```jsx
   {isMobile ? (
     <MobileControls />
   ) : (
     <DesktopControls />
   )}
   ```

5. **Touch Optimization**: Map controls are optimized for touch interactions on mobile devices.

## Performance Considerations

The application implements several performance optimizations:

1. **Memoization**: React's `useMemo` and `useCallback` hooks are used to prevent unnecessary re-renders.

2. **Lazy Loading**: Components are loaded only when needed.

3. **Efficient Rendering**: Map elements are only re-rendered when their data changes.

4. **Throttling**: Map interactions are throttled to prevent performance issues during rapid user interactions.

## Future Enhancements (Phase 2)

The architecture is designed to accommodate future enhancements, particularly the Scanner App component:

1. **OCR Integration**: Using Tesseract.js for document scanning and text extraction.

2. **Image Processing**: Using OpenCV.js for image enhancement and preprocessing.

3. **Shared Data Flow**: The Scanner App will integrate with the Mapper App through shared contexts and utilities.

## Conclusion

The Titlesearch Pro Mapper application follows modern React best practices with a clean, modular architecture. The separation of concerns between components, contexts, hooks, and utilities ensures maintainability and extensibility. The responsive design approach ensures usability across different devices, making it suitable for both office and field use.
