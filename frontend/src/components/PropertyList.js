import React, { useState, useEffect } from 'react';
import { PropertyCard } from './PropertyCard';
import { PropertyCardOverlay } from './PropertyCardOverlay';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/properties')
      .then((res) => res.json())
      .then((data) => {
        console.log('✅ Raw property list:', data);
        setProperties(data);
      })
      .catch((err) => {
        console.error('❌ Failed to fetch properties:', err);
      });
  }, []);

  const handleUploadClick = (property, slot) => {
    setSelectedProperty(property);
    setSelectedSlot(slot);
    setShowOverlay(true);
  };

  const handleOverlayClose = () => {
    setSelectedProperty(null);
    setSelectedSlot('');
    setShowOverlay(false);
  };

  const handleNavigate = (property) => {
    const { lat, lng } = property.coordinates || {};
    if (lat && lng) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    } else {
      alert('No coordinates available');
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-6 p-6">
      {properties.map((prop) => (
        <PropertyCard
          key={prop.id}
          property={prop}
          onUpload={handleUploadClick}
          onNavigate={handleNavigate}
        />
      ))}

      {showOverlay && (
        <PropertyCardOverlay
          property={selectedProperty}
          uploadSlot={selectedSlot}
          onClose={handleOverlayClose}
        />
      )}
    </div>
  );
};

export default PropertyList;