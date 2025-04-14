import React, { useState, useEffect } from 'react';
import { useParcelContext } from '../../context/ParcelContext';
import { generatePDF, generatePNG, downloadBlob } from '../../utils/exportUtils';

const ExportPanel = ({ mapRef }) => {
  const { parcels } = useParcelContext();
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportName, setExportName] = useState('parcel-map');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [resolution, setResolution] = useState('standard');
  const [orientation, setOrientation] = useState('landscape');
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
  
  // Handle export button click
  const handleExport = async () => {
    if (!mapRef.current || parcels.length === 0) return;
    
    setIsExporting(true);
    
    try {
      const mapElement = mapRef.current.getContainer();
      const date = new Date();
      
      let blob, fileName;
      
      if (exportFormat === 'pdf') {
        blob = await generatePDF({
          mapElement,
          parcels,
          title: exportName,
          client: 'Titlesearch Pro User',
          date,
          includeMetadata,
          orientation
        });
        fileName = `${exportName}.pdf`;
      } else {
        const result = await generatePNG({
          mapElement,
          resolution,
          fileName: exportName
        });
        blob = result.blob;
        fileName = result.fileName;
      }
      
      // Download the file
      downloadBlob(blob, fileName);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  // Toggle collapsed state for mobile
  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  // Only show if there are parcels
  if (parcels.length === 0) {
    return null;
  }
  
  return (
    <div className={`
      absolute top-4 left-4 bg-white rounded-md shadow-md z-[1000] max-w-xs
      ${isMobile ? 'left-2 top-16 max-w-[calc(100%-1rem)]' : ''}
      ${isCollapsed && isMobile ? 'p-2' : 'p-3'}
    `}>
      {isMobile && isCollapsed ? (
        <button 
          className="w-full text-xs font-medium text-gray-700"
          onClick={toggleCollapsed}
        >
          Export Map Options
        </button>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm">Export Map</h3>
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
              <label htmlFor="export-name" className="block text-xs font-medium text-gray-700 mb-1">
                Export Name
              </label>
              <input
                id="export-name"
                type="text"
                className="form-input text-sm py-1"
                value={exportName}
                onChange={(e) => setExportName(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="export-format" className="block text-xs font-medium text-gray-700 mb-1">
                Format
              </label>
              <select
                id="export-format"
                className="form-input text-sm py-1"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <option value="pdf">PDF Document</option>
                <option value="png">PNG Image</option>
              </select>
            </div>
            
            {exportFormat === 'pdf' && (
              <div>
                <label htmlFor="orientation" className="block text-xs font-medium text-gray-700 mb-1">
                  Orientation
                </label>
                <select
                  id="orientation"
                  className="form-input text-sm py-1"
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value)}
                >
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                </select>
              </div>
            )}
            
            {exportFormat === 'png' && (
              <div>
                <label htmlFor="resolution" className="block text-xs font-medium text-gray-700 mb-1">
                  Resolution
                </label>
                <select
                  id="resolution"
                  className="form-input text-sm py-1"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                >
                  <option value="standard">Standard</option>
                  <option value="high">High</option>
                  <option value="print">Print Quality</option>
                </select>
              </div>
            )}
            
            <div className="flex items-center">
              <input
                id="include-metadata"
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
                checked={includeMetadata}
                onChange={(e) => setIncludeMetadata(e.target.checked)}
              />
              <label htmlFor="include-metadata" className="ml-2 block text-xs text-gray-700">
                Include parcel metadata
              </label>
            </div>
            
            <button
              className="btn btn-primary text-sm w-full"
              onClick={handleExport}
              disabled={isExporting || parcels.length === 0}
            >
              {isExporting ? 'Exporting...' : 'Export Map'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportPanel;
