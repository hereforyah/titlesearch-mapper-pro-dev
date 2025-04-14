import React, { useState } from 'react';
import { useParcelContext } from '../../context/ParcelContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import useLocalStorage from '../../hooks/useLocalStorage';

const SaveLoadPanel = () => {
  const { parcels, addParcel, clearParcels } = useParcelContext();
  const { mapSettings, updateMapSettings } = useAppSettings();
  const { saveProject, loadProject, deleteProject, createNewProject, recentProjects } = useLocalStorage();
  const [projectName, setProjectName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  
  // Handle save button click
  const handleSave = async () => {
    if (!projectName.trim()) return;
    
    setIsSaving(true);
    
    try {
      const project = createNewProject(projectName);
      project.parcels = parcels;
      project.mapSettings = mapSettings;
      
      const success = await saveProject(project);
      
      if (success) {
        alert('Project saved successfully!');
        setShowSaveForm(false);
        setProjectName('');
      } else {
        alert('Failed to save project. Please try again.');
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('Save failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle load button click
  const handleLoad = async () => {
    if (!selectedProjectId) return;
    
    setIsLoading(true);
    
    try {
      const project = await loadProject(selectedProjectId);
      
      if (project) {
        // Clear existing parcels and add loaded ones
        clearParcels();
        project.parcels.forEach(parcel => {
          addParcel(parcel);
        });
        
        // Restore map settings if available
        if (project.mapSettings) {
          updateMapSettings(project.mapSettings);
        }
        
        alert('Project loaded successfully!');
      } else {
        alert('Failed to load project. Please try again.');
      }
    } catch (error) {
      console.error('Load failed:', error);
      alert('Load failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle delete button click
  const handleDelete = async () => {
    if (!selectedProjectId) return;
    
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    try {
      const success = await deleteProject(selectedProjectId);
      
      if (success) {
        alert('Project deleted successfully!');
        setSelectedProjectId('');
      } else {
        alert('Failed to delete project. Please try again.');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Save & Load</h2>
      
      {showSaveForm ? (
        <div className="mb-4">
          <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">
            Project Name
          </label>
          <input
            id="project-name"
            type="text"
            className="form-input"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
          />
          
          <div className="flex justify-end mt-3 space-x-2">
            <button
              className="btn btn-secondary"
              onClick={() => setShowSaveForm(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isSaving || !projectName.trim()}
            >
              {isSaving ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </div>
      ) : (
        <button
          className="btn btn-primary w-full mb-4"
          onClick={() => setShowSaveForm(true)}
          disabled={parcels.length === 0}
        >
          Save Current Map
        </button>
      )}
      
      <div className="mb-4">
        <label htmlFor="project-select" className="block text-sm font-medium text-gray-700 mb-1">
          Recent Projects
        </label>
        <select
          id="project-select"
          className="form-input"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
        >
          <option value="">Select a project</option>
          {recentProjects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name} ({new Date(project.lastAccessed).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex space-x-2">
        <button
          className="btn btn-primary flex-1"
          onClick={handleLoad}
          disabled={isLoading || !selectedProjectId}
        >
          {isLoading ? 'Loading...' : 'Load'}
        </button>
        <button
          className="btn btn-secondary flex-1"
          onClick={handleDelete}
          disabled={!selectedProjectId}
        >
          Delete
        </button>
      </div>
      
      {recentProjects.length === 0 && (
        <div className="text-sm text-gray-500 mt-3 text-center">
          No saved projects found.
        </div>
      )}
    </div>
  );
};

export default SaveLoadPanel;
