import React from 'react';
import { ParcelProvider } from '../context/ParcelContext';
import { AppSettingsProvider } from '../context/AppSettingsContext';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import MapViewer from './map/MapViewer';
import '../assets/styles/tailwind.css';

const App = () => {
  return (
    <AppSettingsProvider>
      <ParcelProvider>
        <div className="flex flex-col h-screen">
          <Header />
          <div className="flex flex-1 overflow-hidden relative">
            <Sidebar />
            <main className="flex-1 relative">
              <MapViewer />
            </main>
          </div>
        </div>
      </ParcelProvider>
    </AppSettingsProvider>
  );
};

export default App;
