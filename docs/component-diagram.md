# Titlesearch Pro Mapper - Component Diagram

## Component Relationships

```
+------------------+     +------------------+     +------------------+
|      App.jsx     |     |  ParcelContext   |     | AppSettingsContext|
+------------------+     +------------------+     +------------------+
        |                       |                        |
        v                       v                        v
+------------------+     +------------------+     +------------------+
|     Layout       |     |   Map Components |     |  Form Components |
| (Header/Sidebar) |---->| (MapViewer etc.) |<--->| (MetesAndBounds)|
+------------------+     +------------------+     +------------------+
        |                       |                        |
        v                       v                        v
+------------------+     +------------------+     +------------------+
|   UI Components  |     | Feature Components     |  Utility Hooks   |
| (Button/Modal)   |     | (Export/SaveLoad)      | (useParcelCalc)  |
+------------------+     +------------------+     +------------------+
                                |
                                v
                         +------------------+
                         |  Utility Functions|
                         | (parcelUtils etc.)|
                         +------------------+
```

## Data Flow Diagram

```
User Input (Metes & Bounds)
        |
        v
+------------------+
| MetesAndBoundsForm|
+------------------+
        |
        v
+------------------+
|metesAndBoundsParser|
+------------------+
        |
        v
+------------------+
|useParcelCalculation|
+------------------+
        |
        v
+------------------+
|   ParcelContext   |
+------------------+
        |
        v
+------------------+
|    ParcelLayer    |
+------------------+
        |
        v
+------------------+
|     MapViewer     |
+------------------+
        |
        v
    Map Display
```

## State Management Structure

```
ParcelContext
├── parcels: [
│   {
│     id: string,
│     name: string,
│     description: string,
│     coordinates: [
│       {lat: number, lng: number},
│       ...
│     ],
│     style: {
│       color: string,
│       weight: number,
│       ...
│     },
│     metadata: {
│       createdAt: Date,
│       ...
│     }
│   },
│   ...
│ ]
├── activeParcelId: string
├── intersections: [
│   {
│     parcelId1: string,
│     parcelId2: string,
│     intersectionPoints: [
│       {lat: number, lng: number},
│       ...
│     ]
│   },
│   ...
│ ]
└── actions: {
    addParcel,
    updateParcel,
    removeParcel,
    setActiveParcel,
    calculateIntersections,
    ...
  }

AppSettingsContext
├── mapSettings: {
│   baseLayer: string,
│   zoom: number,
│   center: {lat: number, lng: number},
│   ...
│ }
├── uiPreferences: {
│   sidebarOpen: boolean,
│   darkMode: boolean,
│   ...
│ }
├── exportSettings: {
│   format: 'pdf' | 'png',
│   includeMetadata: boolean,
│   ...
│ }
└── actions: {
    updateMapSettings,
    updateUiPreferences,
    updateExportSettings,
    ...
  }
```

This diagram illustrates the relationships between components and the flow of data through the application, providing a visual representation of the architecture described in the main architecture document.
