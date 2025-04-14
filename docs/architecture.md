# Titlesearch Pro Mapper - Architecture Design

## Application Overview

Titlesearch Pro Mapper is a specialized tool for title professionals to visualize and analyze property parcels based on metes and bounds descriptions. The application allows users to input legal descriptions, visualize parcels on an interactive map, detect overlaps, and export the results.

## Tech Stack

- **Frontend Framework**: React.js with Vite
- **Mapping Library**: Leaflet.js
- **Styling**: Tailwind CSS
- **Build Tools**: ESLint, Prettier
- **Export Capabilities**: PDF/PNG generation

## Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── map/
│   │   ├── MapViewer.jsx          # Main Leaflet map container
│   │   ├── ParcelLayer.jsx        # Handles rendering of parcels on map
│   │   ├── ControlPanel.jsx       # Map controls (zoom, layers, etc.)
│   │   └── OverlayManager.jsx     # Manages multiple parcel overlays
│   ├── forms/
│   │   ├── MetesAndBoundsForm.jsx # Input form for metes and bounds
│   │   ├── ParcelMetadata.jsx     # Form for parcel metadata (name, notes)
│   │   └── ImportForm.jsx         # For future text upload functionality
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   └── Notification.jsx
│   └── features/
│       ├── ExportPanel.jsx        # PDF/PNG export functionality
│       ├── SaveLoadPanel.jsx      # Local save/load functionality
│       └── ParcelList.jsx         # List of current parcels
├── hooks/
│   ├── useParcelCalculation.js    # Custom hook for parcel calculations
│   ├── useMapInteractions.js      # Custom hook for map interactions
│   ├── useLocalStorage.js         # Custom hook for local storage
│   └── useExport.js               # Custom hook for export functionality
├── utils/
│   ├── parcelUtils.js             # Utility functions for parcel operations
│   ├── metesAndBoundsParser.js    # Parser for metes and bounds input
│   ├── geoUtils.js                # Geospatial utility functions
│   └── exportUtils.js             # Utility functions for exports
├── context/
│   ├── ParcelContext.jsx          # Context for parcel data
│   └── AppSettingsContext.jsx     # Context for app settings
├── assets/
│   ├── icons/
│   └── styles/
│       └── tailwind.css           # Tailwind CSS configuration
├── App.jsx                        # Main application component
└── main.jsx                       # Entry point
```

## Data Flow

1. **User Input Flow**:
   - User enters metes and bounds data in `MetesAndBoundsForm`
   - Data is parsed by `metesAndBoundsParser` utility
   - Parsed data is processed by `useParcelCalculation` hook
   - Resulting parcel geometry is stored in `ParcelContext`
   - `ParcelLayer` renders the parcel on the map

2. **Multi-Parcel Overlay Flow**:
   - Multiple parcels are stored in `ParcelContext`
   - `OverlayManager` handles the display of multiple parcels
   - Intersection detection is performed by `parcelUtils`
   - Overlaps are highlighted on the map

3. **Export Flow**:
   - User selects export options in `ExportPanel`
   - `useExport` hook processes the current map view
   - `exportUtils` generates PDF or PNG output
   - File is provided to user for download

4. **Save/Load Flow**:
   - `useLocalStorage` hook manages saving/loading parcels
   - Parcel data is serialized/deserialized by `parcelUtils`
   - `SaveLoadPanel` provides UI for these operations

## State Management

The application will use React Context API for state management, with two main contexts:

1. **ParcelContext**: Manages parcel data, including:
   - Current parcels (array of parcel objects)
   - Active parcel (currently selected)
   - Parcel metadata
   - Intersection data

2. **AppSettingsContext**: Manages application settings, including:
   - Map settings (base layer, zoom level)
   - UI preferences
   - Export settings

Each context will be implemented with the reducer pattern to handle complex state updates in a predictable manner.

## Responsive Design Strategy

The application will follow a mobile-first approach using Tailwind CSS:

1. **Layout Adaptation**:
   - Sidebar collapses to bottom drawer on mobile
   - Controls adapt to touch interfaces
   - Form inputs resize appropriately

2. **Map Interactions**:
   - Touch-friendly controls for map navigation
   - Simplified UI for smaller screens
   - Gesture support for common operations

3. **Breakpoints**:
   - Small (mobile): < 640px
   - Medium (tablet): 640px - 1024px
   - Large (desktop): > 1024px

## Performance Considerations

1. **Map Rendering**:
   - Use of Leaflet's built-in optimization features
   - Lazy loading of map tiles
   - Throttling of expensive operations during map interactions

2. **State Updates**:
   - Memoization of expensive calculations
   - Batch updates for related state changes
   - Debouncing of rapid user inputs

3. **Local Storage**:
   - Efficient serialization of parcel data
   - Pagination for large datasets
   - Compression for larger saved states

## Future Extensibility

The architecture is designed to accommodate future features:

1. **Scanner Integration** (Phase 2):
   - Clear separation of concerns allows for future integration
   - Shared utilities can be moved to common location
   - API interfaces are defined for cross-module communication

2. **Cloud Storage**:
   - Local storage abstraction can be extended to cloud storage
   - Authentication hooks can be added

3. **Advanced Features**:
   - Component structure allows for adding new features without major refactoring
   - Context system can be extended for new data types
