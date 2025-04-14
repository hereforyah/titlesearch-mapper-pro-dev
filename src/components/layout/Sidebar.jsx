import React, { useState } from 'react';
import { useParcelContext } from '../../context/ParcelContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import SaveLoadPanel from '../features/SaveLoadPanel';
import ImportForm from '../forms/ImportForm';
import ParcelList from '../features/ParcelList';
import SimplifiedParcelForm from '../forms/SimplifiedParcelForm';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('input');
  const { parcels } = useParcelContext();
  
  return (
    <aside className="w-96 bg-gray-50 border-r border-gray-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex space-x-1">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-t-md ${
              activeTab === 'input'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('input')}
          >
            Input
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-t-md ${
              activeTab === 'import'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('import')}
          >
            Import
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-t-md ${
              activeTab === 'parcels'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('parcels')}
          >
            Parcels ({parcels.length})
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-t-md ${
              activeTab === 'save'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('save')}
          >
            Save/Load
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'input' && <SimplifiedParcelForm />}
        {activeTab === 'import' && <ImportForm />}
        {activeTab === 'parcels' && <ParcelList />}
        {activeTab === 'save' && <SaveLoadPanel />}
      </div>
    </aside>
  );
};

export default Sidebar;
