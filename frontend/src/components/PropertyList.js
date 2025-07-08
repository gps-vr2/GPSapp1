import React, { useState, useEffect } from 'react';
import { PropertyCard } from './PropertyCard';
import { PropertyCardOverlay } from './PropertyCardOverlay';
import { BASE_URL } from '../config';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/api/properties`)
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
      })
      .catch((err) => {
        console.error('Error loading properties:', err);
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