import React, { createContext, useReducer, useContext } from 'react';

// Define initial state
const initialState = {
  parcels: [],
  activeParcelId: null,
  intersections: []
};

// Define action types
export const ACTIONS = {
  ADD_PARCEL: 'add_parcel',
  UPDATE_PARCEL: 'update_parcel',
  REMOVE_PARCEL: 'remove_parcel',
  SET_ACTIVE_PARCEL: 'set_active_parcel',
  CALCULATE_INTERSECTIONS: 'calculate_intersections',
  CLEAR_PARCELS: 'clear_parcels'
};

// Create reducer function
const parcelReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_PARCEL:
      return {
        ...state,
        parcels: [...state.parcels, action.payload],
        activeParcelId: action.payload.id
      };
    case ACTIONS.UPDATE_PARCEL:
      return {
        ...state,
        parcels: state.parcels.map(parcel => 
          parcel.id === action.payload.id ? action.payload : parcel
        )
      };
    case ACTIONS.REMOVE_PARCEL:
      return {
        ...state,
        parcels: state.parcels.filter(parcel => parcel.id !== action.payload),
        activeParcelId: state.activeParcelId === action.payload ? null : state.activeParcelId
      };
    case ACTIONS.SET_ACTIVE_PARCEL:
      return {
        ...state,
        activeParcelId: action.payload
      };
    case ACTIONS.CALCULATE_INTERSECTIONS:
      return {
        ...state,
        intersections: action.payload
      };
    case ACTIONS.CLEAR_PARCELS:
      return {
        ...state,
        parcels: [],
        activeParcelId: null,
        intersections: []
      };
    default:
      return state;
  }
};

// Create context
const ParcelContext = createContext();

// Create provider component
export const ParcelProvider = ({ children }) => {
  const [state, dispatch] = useReducer(parcelReducer, initialState);

  // Define action creators
  const addParcel = (parcel) => {
    dispatch({ type: ACTIONS.ADD_PARCEL, payload: parcel });
  };

  const updateParcel = (parcel) => {
    dispatch({ type: ACTIONS.UPDATE_PARCEL, payload: parcel });
  };

  const removeParcel = (id) => {
    dispatch({ type: ACTIONS.REMOVE_PARCEL, payload: id });
  };

  const setActiveParcel = (id) => {
    dispatch({ type: ACTIONS.SET_ACTIVE_PARCEL, payload: id });
  };

  const calculateIntersections = (intersections) => {
    dispatch({ type: ACTIONS.CALCULATE_INTERSECTIONS, payload: intersections });
  };

  const clearParcels = () => {
    dispatch({ type: ACTIONS.CLEAR_PARCELS });
  };

  const value = {
    parcels: state.parcels,
    activeParcelId: state.activeParcelId,
    intersections: state.intersections,
    addParcel,
    updateParcel,
    removeParcel,
    setActiveParcel,
    calculateIntersections,
    clearParcels
  };

  return (
    <ParcelContext.Provider value={value}>
      {children}
    </ParcelContext.Provider>
  );
};

// Create custom hook for using the context
export const useParcelContext = () => {
  const context = useContext(ParcelContext);
  if (context === undefined) {
    throw new Error('useParcelContext must be used within a ParcelProvider');
  }
  return context;
};

export default ParcelContext;
