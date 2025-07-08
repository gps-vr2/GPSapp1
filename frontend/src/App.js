import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { MapView } from './components/MapView';
import PropertyList from './components/PropertyList'; 
import { PropertyCardOverlay } from './components/PropertyCardOverlay';
import { BASE_URL } from './config'; // ✅ Import added

function App() {
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [layoutMode, setLayoutMode] = useState('both');

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/properties`)
      .then((response) => {
        setProperties(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching properties:', error);
        setLoading(false);
      });
  }, []);

  const filteredProperties = useMemo(() => {
    if (activeTab === 'all') return properties;
    if (activeTab === 'available') {
      return properties.filter((p) => {
        const status = p.status?.toLowerCase();
        return !['booked', 'partial', 'finish'].includes(status);
      });
    }
    return properties.filter((p) => p.status?.toLowerCase() === activeTab);
  }, [activeTab, properties]);

  const tabCounts = useMemo(() => {
    const getStatus = (s) => s?.toLowerCase();
    return {
      available: properties.filter((p) =>
        !['booked', 'partial', 'finish'].includes(getStatus(p.status))
      ).length,
      booked: properties.filter((p) => getStatus(p.status) === 'booked').length,
      partial: properties.filter((p) => getStatus(p.status) === 'partial').length,
      finish: properties.filter((p) => getStatus(p.status) === 'finish').length,
      all: properties.length,
    };
  }, [properties]);

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
  };

  const handleCloseOverlay = () => {
    setSelectedProperty(null);
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'available': return 'Available Properties';
      case 'partial': return 'Partial Bookings';
      case 'booked': return 'Booked Properties';
      case 'finish': return 'Finished Properties';
      case 'all': return 'All Properties';
      default: return 'PropertyScope';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-sans">
      <Header title={getTitle()} onRefresh={() => window.location.reload()} />

      <div className="flex justify-end p-3 bg-white border-b">
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

      <div className="flex-1 flex flex-row overflow-hidden">
        {(layoutMode === 'map' || layoutMode === 'both') && (
          <div className={`${layoutMode === 'both' ? 'w-2/3' : 'w-full'} h-full z-10`}>
            <MapView
              properties={filteredProperties}
              onPropertySelect={handlePropertySelect}
            />
          </div>
        )}

        {(layoutMode === 'list' || layoutMode === 'both') && (
          <div className={`${layoutMode === 'both' ? 'w-1/3' : 'w-full'} overflow-y-auto border-l border-gray-200 bg-white z-20`}>
            {loading ? (
              <p className="p-4 text-gray-500 text-sm italic">Loading properties...</p>
            ) : (
              <PropertyList
                properties={filteredProperties}
                onPropertySelect={handlePropertySelect}
                title={getTitle()}
              />
            )}
          </div>
        )}
      </div>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} counts={tabCounts} />

      {selectedProperty && (
        <PropertyCardOverlay
          property={selectedProperty}
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  );
}

export default App;