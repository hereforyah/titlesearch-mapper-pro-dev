import { useState } from 'react';
import { parseMetesAndBounds } from '../utils/metesAndBoundsParser';
import { createParcel } from '../utils/parcelUtils';

/**
 * Custom hook for parcel calculations
 * @returns {Object} - Parcel calculation methods and state
 */
const useParcelCalculation = () => {
  const [parsingError, setParsingError] = useState(null);
  const [parsingResult, setParsingResult] = useState(null);

  /**
   * Parse metes and bounds description and create a parcel
   * @param {string} description - Metes and bounds description
   * @param {string} name - Parcel name
   * @param {Object} startPoint - Optional starting point {lat, lng}
   * @returns {Object|null} - Created parcel or null if parsing failed
   */
  const calculateParcelFromDescription = (description, name, startPoint) => {
    try {
      setParsingError(null);
      
      // Parse the description
      const result = parseMetesAndBounds(description, startPoint);
      setParsingResult(result);
      
      if (!result.isValid && result.errors.length > 0) {
        setParsingError(result.errors.join(', '));
        return null;
      }
      
      // Create a parcel object with enhanced properties
      const parcel = createParcel(
        name, 
        description, 
        result.coordinates,
        {
          segments: result.segments,
          isClosed: result.isClosed,
          closingSuggestion: result.closingSuggestion,
          plssData: result.plssData,
          area: result.area,
          perimeter: result.perimeter
        }
      );
      
      return parcel;
    } catch (error) {
      console.error("Error in calculateParcelFromDescription:", error);
      setParsingError(error.message);
      setParsingResult(null);
      return null;
    }
  };

  return {
    calculateParcelFromDescription,
    parsingError,
    parsingResult
  };
};

export default useParcelCalculation;
