/**
 * Custom hook for local storage operations
 */
import { useState, useEffect } from 'react';
import { serializeParcels, deserializeParcels } from '../utils/parcelUtils';

/**
 * Hook for managing project data in local storage
 * @returns {Object} - Local storage operations
 */
export const useLocalStorage = () => {
  const [recentProjects, setRecentProjects] = useState([]);
  
  // Load recent projects on mount
  useEffect(() => {
    const storedProjects = localStorage.getItem('recentProjects');
    if (storedProjects) {
      try {
        setRecentProjects(JSON.parse(storedProjects));
      } catch (error) {
        console.error('Error loading recent projects:', error);
      }
    }
  }, []);
  
  /**
   * Save a project to local storage
   * @param {Object} project - Project to save
   * @returns {Promise<boolean>} - Success status
   */
  const saveProject = async (project) => {
    try {
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
      
      // Store full project data in localStorage
      // In a real implementation, we would use IndexedDB for larger data
      localStorage.setItem(
        `project_data_${project.id}`,
        serializeParcels(project.parcels)
      );
      
      // Update recent projects list
      updateRecentProjects(project.id, project.name);
      
      return true;
    } catch (error) {
      console.error('Error saving project:', error);
      return false;
    }
  };
  
  /**
   * Load a project from local storage
   * @param {string} projectId - ID of project to load
   * @returns {Promise<Object|null>} - Loaded project or null if not found
   */
  const loadProject = async (projectId) => {
    try {
      // Get project metadata
      const metaJson = localStorage.getItem(`project_meta_${projectId}`);
      if (!metaJson) {
        return null;
      }
      
      const metadata = JSON.parse(metaJson);
      
      // Get project data
      const dataJson = localStorage.getItem(`project_data_${projectId}`);
      if (!dataJson) {
        return null;
      }
      
      const parcels = deserializeParcels(dataJson);
      
      // Update recent projects list
      updateRecentProjects(projectId, metadata.name);
      
      // Return complete project
      return {
        ...metadata,
        parcels
      };
    } catch (error) {
      console.error('Error loading project:', error);
      return null;
    }
  };
  
  /**
   * Delete a project from local storage
   * @param {string} projectId - ID of project to delete
   * @returns {Promise<boolean>} - Success status
   */
  const deleteProject = async (projectId) => {
    try {
      // Remove project data
      localStorage.removeItem(`project_meta_${projectId}`);
      localStorage.removeItem(`project_data_${projectId}`);
      
      // Update recent projects list
      setRecentProjects(prev => 
        prev.filter(project => project.id !== projectId)
      );
      
      localStorage.setItem(
        'recentProjects',
        JSON.stringify(recentProjects.filter(project => project.id !== projectId))
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  };
  
  /**
   * Update the list of recent projects
   * @param {string} projectId - ID of project to update
   * @param {string} projectName - Name of project
   */
  const updateRecentProjects = (projectId, projectName) => {
    // Remove project if it already exists in the list
    const filteredProjects = recentProjects.filter(
      project => project.id !== projectId
    );
    
    // Add project to the beginning of the list
    const updatedProjects = [
      { id: projectId, name: projectName, lastAccessed: Date.now() },
      ...filteredProjects
    ].slice(0, 10); // Keep only the 10 most recent projects
    
    // Update state
    setRecentProjects(updatedProjects);
    
    // Update localStorage
    localStorage.setItem('recentProjects', JSON.stringify(updatedProjects));
  };
  
  /**
   * Create a new project
   * @param {string} name - Project name
   * @returns {Object} - New project
   */
  const createNewProject = (name = 'Untitled Project') => {
    return {
      id: 'project_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name,
      createdAt: Date.now(),
      lastModified: Date.now(),
      parcels: []
    };
  };
  
  return {
    recentProjects,
    saveProject,
    loadProject,
    deleteProject,
    createNewProject
  };
};

export default useLocalStorage;
