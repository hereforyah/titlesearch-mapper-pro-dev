import React, { createContext, useReducer, useContext } from 'react';

// Define initial state
const initialState = {
  mapSettings: {
    baseLayer: 'OpenStreetMap',
    zoom: 13,
    center: [40.7128, -74.0060], // Default to NYC
  },
  uiPreferences: {
    sidebarOpen: true,
    darkMode: false,
  },
  exportSettings: {
    format: 'pdf',
    includeMetadata: true,
    orientation: 'landscape',
  }
};

// Define action types
export const ACTIONS = {
  UPDATE_MAP_SETTINGS: 'update_map_settings',
  UPDATE_UI_PREFERENCES: 'update_ui_preferences',
  UPDATE_EXPORT_SETTINGS: 'update_export_settings',
};

// Create reducer function
const appSettingsReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_MAP_SETTINGS:
      return {
        ...state,
        mapSettings: {
          ...state.mapSettings,
          ...action.payload
        }
      };
    case ACTIONS.UPDATE_UI_PREFERENCES:
      return {
        ...state,
        uiPreferences: {
          ...state.uiPreferences,
          ...action.payload
        }
      };
    case ACTIONS.UPDATE_EXPORT_SETTINGS:
      return {
        ...state,
        exportSettings: {
          ...state.exportSettings,
          ...action.payload
        }
      };
    default:
      return state;
  }
};

// Create context
const AppSettingsContext = createContext();

// Create provider component
export const AppSettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appSettingsReducer, initialState);

  // Define action creators
  const updateMapSettings = (settings) => {
    dispatch({ type: ACTIONS.UPDATE_MAP_SETTINGS, payload: settings });
  };

  const updateUiPreferences = (preferences) => {
    dispatch({ type: ACTIONS.UPDATE_UI_PREFERENCES, payload: preferences });
  };

  const updateExportSettings = (settings) => {
    dispatch({ type: ACTIONS.UPDATE_EXPORT_SETTINGS, payload: settings });
  };

  const value = {
    mapSettings: state.mapSettings,
    uiPreferences: state.uiPreferences,
    exportSettings: state.exportSettings,
    updateMapSettings,
    updateUiPreferences,
    updateExportSettings
  };

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};

// Create custom hook for using the context
export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};

export default AppSettingsContext;
