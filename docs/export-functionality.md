# Export Functionality Design

## Overview

The Export Functionality in Titlesearch Pro Mapper allows users to generate PDF and PNG exports of their parcel maps with associated metadata. This is a critical feature for title professionals who need to include these visualizations in their reports and documentation.

## Export Options

### Format Options
- **PDF Export**: Vector-based document with metadata and multiple pages
- **PNG Export**: Raster image at various resolutions

### Content Options
- **Map View**: Current map view with all visible parcels
- **Selected Parcels**: Only export specific selected parcels
- **Full Extent**: Automatically adjust view to include all parcels

### Metadata Options
- **Title Block**: Include customizable title, date, client info
- **Parcel Information**: Include details about each parcel
- **Legend**: Include color coding and symbol explanations
- **Scale Bar**: Include map scale information
- **North Arrow**: Include directional indicator

## Implementation Approach

### PDF Generation
- Use `jspdf` library for PDF document creation
- Combine with `html2canvas` for capturing map elements
- Structure:
  1. Title page with project information
  2. Map page(s) with parcels
  3. Optional data tables with parcel details

### PNG Generation
- Use Leaflet's built-in methods to capture map view
- Enhance with `html2canvas` for higher quality exports
- Support various resolutions (standard, high, print quality)

### Export Process Flow
1. User selects export options in the ExportPanel
2. Application prepares map view based on selection
3. For PDF: Generate document structure and add content
4. For PNG: Capture current map state at specified resolution
5. Generate file and trigger download

## UI Components

### ExportPanel Component
```jsx
<ExportPanel
  onExport={handleExport}
  parcels={parcels}
  selectedParcels={selectedParcels}
  mapRef={mapRef}
/>
```

### Export Settings Form
- Format selection (PDF/PNG)
- Content selection (current view, selected parcels, all parcels)
- Metadata options (checkboxes for different elements)
- Resolution settings (for PNG)
- Orientation settings (for PDF)

## Utility Functions

### PDF Export Utility
```javascript
export const generatePDF = ({
  mapElement,
  parcels,
  title,
  client,
  date,
  includeMetadata,
  orientation
}) => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: orientation,
    unit: 'mm',
    format: 'a4'
  });
  
  // Add title page
  if (includeMetadata) {
    addTitlePage(doc, { title, client, date });
  }
  
  // Capture map as image
  return html2canvas(mapElement).then(canvas => {
    // Add map to document
    addMapPage(doc, canvas);
    
    // Add parcel data if requested
    if (includeMetadata) {
      addParcelDataPages(doc, parcels);
    }
    
    // Return document for download
    return doc.output('blob');
  });
};
```

### PNG Export Utility
```javascript
export const generatePNG = ({
  mapElement,
  resolution,
  fileName
}) => {
  const scale = getResolutionScale(resolution);
  
  return html2canvas(mapElement, {
    scale: scale,
    useCORS: true,
    allowTaint: false
  }).then(canvas => {
    // Convert to blob for download
    return new Promise(resolve => {
      canvas.toBlob(blob => {
        resolve({
          blob,
          fileName: `${fileName}.png`
        });
      }, 'image/png');
    });
  });
};
```

## Integration with Map Components

The export functionality will integrate with the MapViewer component through refs:

```javascript
// In MapViewer.jsx
const mapRef = useRef(null);

// Pass to ExportPanel
<ExportPanel mapRef={mapRef} />

// In ExportPanel.jsx
const handleExport = async () => {
  const mapElement = mapRef.current.getContainer();
  // Process export based on selected options
};
```

## Performance Considerations

1. **Large Maps**: For maps with many parcels or high detail:
   - Implement progressive rendering for PDFs
   - Offer "simplified" export option for better performance

2. **Memory Management**:
   - Clean up canvas elements after export
   - Use streaming for large PDF files

3. **User Experience**:
   - Show progress indicator during export generation
   - Provide preview before final export

## Future Enhancements

1. **Batch Export**: Allow exporting multiple maps at once
2. **Templates**: Save and reuse export settings
3. **Cloud Integration**: Direct export to cloud storage
4. **GeoTIFF Export**: For GIS software compatibility
5. **Custom Layouts**: User-defined page layouts and designs

This design ensures the export functionality will meet the needs of title professionals while maintaining good performance and user experience.
