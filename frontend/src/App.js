import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Header } from './components/Header';
import TabNavigation from './components/TabNavigation';
import { MapView } from './components/MapView';
import PropertyList from './components/PropertyList';
import { PropertyCardOverlay } from './components/PropertyCardOverlay';
import { BASE_URL } from './config';
import { useIsMobile } from './hooks/useIsMobile';

function App() {
  const isMobile = useIsMobile();
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [layoutMode, setLayoutMode] = useState('both');

  useEffect(() => {
    axios.get(`${BASE_URL}/api/properties`)
      .then(res => {
        const data = res.data;
        setProperties(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching properties:', err);
        setProperties([]);
        setLoading(false);
      });
  }, []);

  const filteredProperties = useMemo(() => {
    if (activeTab === 'all') return properties;
    if (activeTab === 'available') {
      return properties.filter(p =>
        !['booked', 'partial', 'finish'].includes(p.status?.toLowerCase())
      );
    }
    return properties.filter(p => p.status?.toLowerCase() === activeTab);
  }, [activeTab, properties]);

  const tabCounts = useMemo(() => {
    const getStatus = s => s?.toLowerCase();
    return {
      available: properties.filter(p => !['booked', 'partial', 'finish'].includes(getStatus(p.status))).length,
      booked: properties.filter(p => getStatus(p.status) === 'booked').length,
      partial: properties.filter(p => getStatus(p.status) === 'partial').length,
      finish: properties.filter(p => getStatus(p.status) === 'finish').length,
      all: properties.length,
    };
  }, [properties]);

  const getTitle = () => {
    switch (activeTab) {
      case 'available': return 'Available Properties';
      case 'booked': return 'Booked Properties';
      case 'partial': return 'Partial Bookings';
      case 'finish': return 'Finished Properties';
      case 'all': return 'All Properties';
      default: return 'PropertyScope';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans">
      <Header title={getTitle()} onRefresh={() => window.location.reload()} />

      {/* 🔘 Top bar with tabs and layout selector */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between px-3 py-2 bg-white border-b gap-3">
        <div className="flex flex-wrap gap-2 text-xs md:text-base">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={tabCounts}
          />
        </div>

        <select
          className="border rounded px-3 py-1 text-sm"
          value={layoutMode}
          onChange={(e) => setLayoutMode(e.target.value)}
        >
          <option value="both">Map + List</option>
          <option value="map">Map Only</option>
          <option value="list">List Only</option>
        </select>
      </div>

      {/* ✅ Responsive layout */}
      {isMobile ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          {layoutMode === 'map' && (
            <div className="flex flex-col w-full flex-1">
              <MapView
                properties={filteredProperties}
                onPropertySelect={setSelectedProperty}
              />
            </div>
          )}
          {layoutMode === 'list' && (
            <div className="w-full overflow-y-auto flex-1 border-t border-gray-200 bg-white">
              {loading ? (
                <p className="p-4 text-gray-500 text-sm italic">Loading properties...</p>
              ) : (
                <PropertyList
                  properties={filteredProperties}
                  onPropertySelect={setSelectedProperty}
                  title={getTitle()}
                />
              )}
            </div>
          )}
          {layoutMode === 'both' && (
            <>
              <div className="w-full h-[50vh]">
                <MapView
                  properties={filteredProperties}
                  onPropertySelect={setSelectedProperty}
                />
              </div>
              <div className="w-full overflow-y-auto flex-1 border-t border-gray-200 bg-white">
                {loading ? (
                  <p className="p-4 text-gray-500 text-sm italic">Loading properties...</p>
                ) : (
                  <PropertyList
                    properties={filteredProperties}
                    onPropertySelect={setSelectedProperty}
                    title={getTitle()}
                  />
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-row flex-1 overflow-hidden">
          {(layoutMode === 'map' || layoutMode === 'both') && (
            <div className={`${layoutMode === 'both' ? 'w-2/3' : 'w-full'} h-full`}>
              <MapView
                properties={filteredProperties}
                onPropertySelect={setSelectedProperty}
              />
            </div>
          )}
          {(layoutMode === 'list' || layoutMode === 'both') && (
            <div className={`${layoutMode === 'both' ? 'w-1/3' : 'w-full'} overflow-y-auto border-l border-gray-200 bg-white`}>
              {loading ? (
                <p className="p-4 text-gray-500 text-sm italic">Loading properties...</p>
              ) : (
                <PropertyList
                  properties={filteredProperties}
                  onPropertySelect={setSelectedProperty}
                  title={getTitle()}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* 📋 Property overlay if selected */}
      {selectedProperty && (
        <PropertyCardOverlay
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}

export default App;