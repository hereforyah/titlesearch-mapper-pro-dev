import React, { useState } from 'react';
import { useParcelContext } from '../../context/ParcelContext';
import { extractMetesAndBoundsFromText } from '../../utils/metesAndBoundsParser';

const ImportForm = () => {
  const [text, setText] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState('');
  
  // Handle text change
  const handleTextChange = (e) => {
    setText(e.target.value);
    setError('');
  };
  
  // Handle extract button click
  const handleExtract = () => {
    if (!text.trim()) {
      setError('Please enter text to extract from');
      return;
    }
    
    try {
      const extracted = extractMetesAndBoundsFromText(text);
      setExtractedText(extracted);
      setError('');
    } catch (err) {
      setError('Failed to extract metes and bounds: ' + err.message);
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Import from Text</h2>
      
      <div className="mb-4">
        <label htmlFor="import-text" className="block text-sm font-medium text-gray-700 mb-1">
          Paste Document Text
        </label>
        <textarea
          id="import-text"
          className="form-input min-h-[150px]"
          value={text}
          onChange={handleTextChange}
          placeholder="Paste text from a document containing metes and bounds description"
        />
      </div>
      
      <div className="flex justify-end mb-4">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleExtract}
          disabled={!text.trim()}
        >
          Extract Metes & Bounds
        </button>
      </div>
      
      {error && (
        <div className="mb-4 text-red-500 text-sm">
          {error}
        </div>
      )}
      
      {extractedText && (
        <div className="mb-4">
          <label htmlFor="extracted-text" className="block text-sm font-medium text-gray-700 mb-1">
            Extracted Metes & Bounds
          </label>
          <textarea
            id="extracted-text"
            className="form-input min-h-[100px] bg-gray-50"
            value={extractedText}
            readOnly
          />
          <div className="mt-2 text-sm text-gray-600">
            Copy this text to the Metes & Bounds Input form to create a parcel.
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportForm;
