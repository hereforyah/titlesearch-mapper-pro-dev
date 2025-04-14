import React from 'react';
import { useParcelContext } from '../../context/ParcelContext';
import useLocalStorage from '../../hooks/useLocalStorage';

const Header = () => {
  const { parcels, clearParcels } = useParcelContext();
  const { saveProject, createNewProject } = useLocalStorage();
  
  // Quick save functionality
  const handleQuickSave = async () => {
    if (parcels.length === 0) {
      alert('No parcels to save. Add parcels to the map first.');
      return;
    }
    
    try {
      const projectName = `Quick Save - ${new Date().toLocaleString()}`;
      const project = createNewProject(projectName);
      project.parcels = parcels;
      
      const success = await saveProject(project);
      
      if (success) {
        alert('Map saved successfully!');
      } else {
        alert('Failed to save map. Please try again or use the Save/Load panel.');
      }
    } catch (error) {
      console.error('Quick save failed:', error);
      alert('Save failed. Please try again.');
    }
  };
  
  // Clear all parcels
  const handleClear = () => {
    if (parcels.length === 0) return;
    
    if (confirm('Are you sure you want to clear all parcels from the map?')) {
      clearParcels();
    }
  };
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h1 className="text-xl font-bold">Titlesearch-Mapper-Pro</h1>
        </div>
        <div className="flex space-x-3">
          <button 
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 flex items-center"
            onClick={handleQuickSave}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span className="hidden md:inline">Quick Save</span>
            <span className="md:hidden">Save</span>
          </button>
          <button 
            className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleClear}
            disabled={parcels.length === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="hidden md:inline">Clear Map</span>
            <span className="md:hidden">Clear</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
