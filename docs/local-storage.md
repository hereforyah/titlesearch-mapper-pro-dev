# Local Storage Design

## Overview

The Local Storage functionality in Titlesearch Pro Mapper allows users to save their work locally and reload it in future sessions. This feature is essential for title professionals who need to work on parcels over multiple sessions without requiring server-side storage.

## Storage Requirements

1. **Parcel Data Storage**:
   - Geometric coordinates of parcels
   - Metadata (name, description, creation date)
   - Visual styling information
   - Relationship data (overlaps, connections)

2. **Application State Storage**:
   - Map view settings (zoom level, center coordinates)
   - UI preferences
   - Recent activity

3. **Storage Limits**:
   - Browser localStorage typically limited to 5-10MB
   - IndexedDB for larger storage needs (100MB+)

## Implementation Approach

### Storage Strategy

The application will use a tiered storage approach:

1. **localStorage**: For small data and preferences
   - UI settings
   - Recent projects list
   - Application state

2. **IndexedDB**: For larger parcel data
   - Complete project data including all parcels
   - Historical versions (optional)
   - Exported maps and documents

### Data Structure

```javascript
// Project structure for storage
interface StoredProject {
  id: string;                 // Unique identifier
  name: string;               // Project name
  createdAt: number;          // Timestamp
  lastModified: number;       // Timestamp
  mapSettings: {              // Map state
    center: [number, number]; // Lat, Lng
    zoom: number;             // Zoom level
    baseLayer: string;        // Selected base map
  };
  parcels: StoredParcel[];    // Array of parcels
}

// Parcel structure for storage
interface StoredParcel {
  id: string;                 // Unique identifier
  name: string;               // Parcel name
  description: string;        // Metes and bounds or description
  coordinates: {              // Processed coordinates
    lat: number;
    lng: number;
  }[];
  style: {                    // Visual styling
    color: string;
    weight: number;
    opacity: number;
    fillColor: string;
    fillOpacity: number;
  };
  metadata: {                 // Additional data
    createdAt: number;        // Timestamp
    source: string;           // Source of data
    notes: string;            // User notes
    tags: string[];           // Categorization
  };
}
```

## Storage Operations

### Save Operations

1. **Auto-save**:
   - Periodic saving during active use
   - Configurable frequency (default: 2 minutes)
   - Version tracking for recovery

2. **Manual Save**:
   - Explicit user-triggered save
   - Option to save as new project
   - Export to file option for backup

3. **Save Process**:
   ```javascript
   const saveProject = async (project) => {
     // Update timestamps
     project.lastModified = Date.now();
     
     // Store project metadata in localStorage
     localStorage.setItem(
       `project_meta_${project.id}`, 
       JSON.stringify({
         id: project.id,
         name: project.name,
         createdAt: project.createdAt,
         lastModified: project.lastModified
       })
     );
     
     // Store full project data in IndexedDB
     const db = await openDatabase();
     const tx = db.transaction('projects', 'readwrite');
     await tx.objectStore('projects').put(project);
     await tx.complete;
     
     // Update recent projects list
     updateRecentProjects(project.id);
   };
   ```

### Load Operations

1. **Project Listing**:
   - Display recent projects
   - Search/filter by name, date, tags

2. **Project Loading**:
   - Load complete project data
   - Progressive loading for large projects
   - Validation during load

3. **Load Process**:
   ```javascript
   const loadProject = async (projectId) => {
     // Get project from IndexedDB
     const db = await openDatabase();
     const project = await db
       .transaction('projects')
       .objectStore('projects')
       .get(projectId);
     
     // Validate project data
     if (!validateProject(project)) {
       throw new Error('Project data is corrupted');
     }
     
     // Update recent projects list
     updateRecentProjects(projectId);
     
     // Return project data
     return project;
   };
   ```

### Delete Operations

1. **Project Deletion**:
   - Remove from IndexedDB
   - Update recent projects list
   - Optional: Keep in trash for recovery

## User Interface Components

### SaveLoadPanel Component

```jsx
<SaveLoadPanel
  onSave={handleSave}
  onLoad={handleLoad}
  onDelete={handleDelete}
  recentProjects={recentProjects}
  currentProject={currentProject}
/>
```

### Project Management UI

1. **Project List View**:
   - Display project name, date, thumbnail
   - Sort/filter options
   - Action buttons (load, delete, duplicate)

2. **Save Dialog**:
   - Project name input
   - Optional description
   - Tags/categorization

## Error Handling and Recovery

1. **Storage Limits**:
   - Detect approaching storage limits
   - Offer cleanup suggestions
   - Provide export options before limit is reached

2. **Data Corruption**:
   - Validate data on load
   - Maintain backup versions
   - Provide recovery options

3. **Browser Compatibility**:
   - Feature detection for storage APIs
   - Fallback mechanisms for older browsers

## Performance Considerations

1. **Large Projects**:
   - Implement chunked storage for very large projects
   - Use web workers for background saving
   - Compress data when appropriate

2. **Optimization**:
   - Store only essential data
   - Lazy load parcel details
   - Batch storage operations

## Future Enhancements

1. **Cloud Sync**: Optional synchronization with cloud storage
2. **Versioning**: Full version history of projects
3. **Sharing**: Export/import functionality for collaboration
4. **Encryption**: Optional encryption for sensitive data

This design ensures the local storage functionality will be robust, performant, and user-friendly while meeting the needs of title professionals working with parcel data.
