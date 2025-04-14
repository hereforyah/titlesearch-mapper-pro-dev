# Titlesearch Pro Mapper - API Reference

This document provides a comprehensive reference for the key APIs, functions, and utilities used in the Titlesearch Pro Mapper application.

## Table of Contents

1. [Metes and Bounds Parser API](#metes-and-bounds-parser-api)
2. [Parcel Utilities API](#parcel-utilities-api)
3. [Export Utilities API](#export-utilities-api)
4. [Storage Utilities API](#storage-utilities-api)
5. [Map Interaction API](#map-interaction-api)
6. [Context APIs](#context-apis)

## Metes and Bounds Parser API

The Metes and Bounds Parser API provides functions for parsing legal descriptions and converting them to geographic coordinates.

### `parseMetesAndBounds(description)`

Parses a metes and bounds description into a structured format.

**Parameters:**
- `description` (string): The metes and bounds description text

**Returns:**
- Array of segment objects, each containing:
  - `bearing` (object): Direction information with degrees, minutes, seconds
  - `distance` (number): Distance in feet
  - `direction` (string): Cardinal direction (N, S, E, W, etc.)

**Example:**
```javascript
const segments = parseMetesAndBounds("N 45° 30' 20\" E 150.5'");
// Returns:
// [
//   {
//     bearing: { degrees: 45, minutes: 30, seconds: 20 },
//     distance: 150.5,
//     direction: "NE"
//   }
// ]
```

### `calculateCoordinates(segments, startPoint)`

Converts parsed segments into geographic coordinates.

**Parameters:**
- `segments` (array): Array of segment objects from parseMetesAndBounds
- `startPoint` (object): Starting point with lat and lng properties

**Returns:**
- Array of coordinate objects, each containing:
  - `lat` (number): Latitude
  - `lng` (number): Longitude

**Example:**
```javascript
const coordinates = calculateCoordinates(segments, { lat: 40.7128, lng: -74.0060 });
```

### `validateDescription(description)`

Validates a metes and bounds description for correct format.

**Parameters:**
- `description` (string): The metes and bounds description text

**Returns:**
- `isValid` (boolean): Whether the description is valid
- `errors` (array): Array of error messages if invalid

**Example:**
```javascript
const { isValid, errors } = validateDescription("N 45° 30' 20\" E 150.5'");
```

## Parcel Utilities API

The Parcel Utilities API provides functions for working with parcel data.

### `calculateParcelArea(coordinates)`

Calculates the area of a parcel in square feet.

**Parameters:**
- `coordinates` (array): Array of coordinate objects

**Returns:**
- Area in square feet (number)

**Example:**
```javascript
const area = calculateParcelArea(parcel.coordinates);
```

### `calculateParcelPerimeter(coordinates)`

Calculates the perimeter of a parcel in feet.

**Parameters:**
- `coordinates` (array): Array of coordinate objects

**Returns:**
- Perimeter in feet (number)

**Example:**
```javascript
const perimeter = calculateParcelPerimeter(parcel.coordinates);
```

### `detectIntersections(parcels)`

Detects intersections between multiple parcels.

**Parameters:**
- `parcels` (array): Array of parcel objects

**Returns:**
- Array of intersection objects, each containing:
  - `parcel1Id` (string): ID of first parcel
  - `parcel2Id` (string): ID of second parcel
  - `intersectionPoints` (array): Array of intersection points

**Example:**
```javascript
const intersections = detectIntersections(parcels);
```

### `doPolygonsIntersect(polygon1, polygon2)`

Determines if two polygons intersect.

**Parameters:**
- `polygon1` (array): Array of coordinate objects for first polygon
- `polygon2` (array): Array of coordinate objects for second polygon

**Returns:**
- Boolean indicating whether the polygons intersect

**Example:**
```javascript
const intersects = doPolygonsIntersect(parcel1.coordinates, parcel2.coordinates);
```

## Export Utilities API

The Export Utilities API provides functions for exporting maps to different formats.

### `generatePDF(options)`

Generates a PDF document of the current map view.

**Parameters:**
- `options` (object): Configuration options
  - `mapElement` (HTMLElement): The map DOM element
  - `parcels` (array): Array of parcel objects
  - `title` (string): Document title
  - `client` (string): Client name
  - `date` (Date): Date object
  - `includeMetadata` (boolean): Whether to include parcel metadata
  - `orientation` (string): 'portrait' or 'landscape'

**Returns:**
- Promise resolving to a Blob containing the PDF

**Example:**
```javascript
const pdfBlob = await generatePDF({
  mapElement: mapRef.current,
  parcels,
  title: 'Property Survey',
  client: 'John Doe',
  date: new Date(),
  includeMetadata: true,
  orientation: 'landscape'
});
```

### `generatePNG(options)`

Generates a PNG image of the current map view.

**Parameters:**
- `options` (object): Configuration options
  - `mapElement` (HTMLElement): The map DOM element
  - `resolution` (string): 'standard', 'high', or 'print'
  - `fileName` (string): Base name for the file

**Returns:**
- Promise resolving to an object containing:
  - `blob` (Blob): The PNG image as a Blob
  - `fileName` (string): The file name with extension

**Example:**
```javascript
const { blob, fileName } = await generatePNG({
  mapElement: mapRef.current,
  resolution: 'high',
  fileName: 'property-map'
});
```

### `downloadBlob(blob, fileName)`

Initiates a download of a Blob as a file.

**Parameters:**
- `blob` (Blob): The Blob to download
- `fileName` (string): The file name

**Returns:**
- void

**Example:**
```javascript
downloadBlob(pdfBlob, 'property-survey.pdf');
```

## Storage Utilities API

The Storage Utilities API provides functions for saving and loading data.

### `saveProject(project)`

Saves a project to local storage.

**Parameters:**
- `project` (object): The project data
  - `name` (string): Project name
  - `parcels` (array): Array of parcel objects
  - `mapSettings` (object): Map settings
  - `timestamp` (number): Creation/update timestamp

**Returns:**
- Boolean indicating success

**Example:**
```javascript
const success = saveProject({
  name: 'Downtown Survey',
  parcels,
  mapSettings,
  timestamp: Date.now()
});
```

### `loadProject(projectName)`

Loads a project from local storage.

**Parameters:**
- `projectName` (string): Name of the project to load

**Returns:**
- Project object if found, null otherwise

**Example:**
```javascript
const project = loadProject('Downtown Survey');
```

### `listProjects()`

Lists all saved projects.

**Parameters:**
- None

**Returns:**
- Array of project summary objects, each containing:
  - `name` (string): Project name
  - `parcelCount` (number): Number of parcels
  - `timestamp` (number): Creation/update timestamp

**Example:**
```javascript
const projects = listProjects();
```

### `deleteProject(projectName)`

Deletes a project from local storage.

**Parameters:**
- `projectName` (string): Name of the project to delete

**Returns:**
- Boolean indicating success

**Example:**
```javascript
const success = deleteProject('Downtown Survey');
```

## Map Interaction API

The Map Interaction API provides functions for interacting with the map.

### `fitMapToParcels(map, parcels, options)`

Adjusts the map view to fit all parcels.

**Parameters:**
- `map` (L.Map): Leaflet map instance
- `parcels` (array): Array of parcel objects
- `options` (object): Optional configuration
  - `padding` (array): Padding in pixels [top, right, bottom, left]
  - `maxZoom` (number): Maximum zoom level

**Returns:**
- void

**Example:**
```javascript
fitMapToParcels(mapRef.current, parcels, { padding: [50, 50, 50, 50], maxZoom: 18 });
```

### `changeBaseLayer(map, layerType)`

Changes the base map layer.

**Parameters:**
- `map` (L.Map): Leaflet map instance
- `layerType` (string): Type of layer ('openstreetmap', 'satellite', 'terrain')

**Returns:**
- void

**Example:**
```javascript
changeBaseLayer(mapRef.current, 'satellite');
```

### `addParcelToMap(map, parcel, options)`

Adds a parcel to the map.

**Parameters:**
- `map` (L.Map): Leaflet map instance
- `parcel` (object): Parcel object
- `options` (object): Optional configuration
  - `color` (string): Polygon color
  - `weight` (number): Line weight
  - `opacity` (number): Line opacity
  - `fillOpacity` (number): Fill opacity

**Returns:**
- L.Polygon instance

**Example:**
```javascript
const polygon = addParcelToMap(mapRef.current, parcel, { color: '#ff0000' });
```

## Context APIs

The application provides several React Context APIs for state management.

### ParcelContext

Manages the state of all parcels and their interactions.

**Properties:**
- `parcels` (array): Array of parcel objects
- `activeParcelId` (string): ID of the currently active parcel
- `intersections` (array): Array of intersection objects

**Methods:**
- `addParcel(parcel)`: Adds a new parcel
- `removeParcel(id)`: Removes a parcel by ID
- `updateParcel(id, updates)`: Updates a parcel by ID
- `setActiveParcelId(id)`: Sets the active parcel
- `clearParcels()`: Removes all parcels
- `importParcels(parcels)`: Imports multiple parcels

**Example:**
```javascript
const { parcels, addParcel, activeParcelId, setActiveParcelId } = useParcelContext();
```

### AppSettingsContext

Manages application-wide settings.

**Properties:**
- `mapSettings` (object): Map configuration
  - `baseLayer` (string): Current base layer
  - `showLabels` (boolean): Whether to show labels
- `uiSettings` (object): UI configuration
  - `sidebarWidth` (number): Width of sidebar in pixels
  - `sidebarVisible` (boolean): Whether sidebar is visible
  - `activeTab` (string): Currently active tab

**Methods:**
- `updateMapSettings(updates)`: Updates map settings
- `updateUiSettings(updates)`: Updates UI settings
- `resetSettings()`: Resets settings to defaults

**Example:**
```javascript
const { mapSettings, updateMapSettings, uiSettings } = useAppSettings();
```

## Utility Types

### Parcel Object

Represents a property parcel.

**Properties:**
- `id` (string): Unique identifier
- `name` (string): Display name
- `description` (string): Original metes and bounds description
- `coordinates` (array): Array of coordinate objects
- `visible` (boolean): Whether the parcel is visible on the map
- `color` (string): Color for display
- `metadata` (object): Additional information
  - `area` (number): Area in square feet
  - `perimeter` (number): Perimeter in feet
  - `createdAt` (number): Creation timestamp

### Coordinate Object

Represents a geographic point.

**Properties:**
- `lat` (number): Latitude
- `lng` (number): Longitude

### Segment Object

Represents a segment in a metes and bounds description.

**Properties:**
- `bearing` (object): Direction information
  - `degrees` (number): Degrees
  - `minutes` (number): Minutes
  - `seconds` (number): Seconds
- `distance` (number): Distance in feet
- `direction` (string): Cardinal direction

### Intersection Object

Represents an intersection between two parcels.

**Properties:**
- `parcel1Id` (string): ID of first parcel
- `parcel2Id` (string): ID of second parcel
- `intersectionPoints` (array): Array of intersection points
- `severity` (string): 'minor', 'moderate', or 'severe'
