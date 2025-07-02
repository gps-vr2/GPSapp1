// components/PropertyList.js

import React from 'react';
import { Car } from 'lucide-react'; // Make sure you have lucide-react installed

export const PropertyList = ({ properties = [], onPropertySelect, title = 'Properties' }) => {
  const handleNavigate = (lat, lng) => {
    if (!lat || !lng) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>

      {properties.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No properties found.</p>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow transition cursor-pointer bg-white"
              onClick={() => onPropertySelect(property)}
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-bold text-gray-800">
                  {property.code} {property.area && `– ${property.area}`}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    property.status === 'booked'
                      ? 'bg-red-100 text-red-700'
                      : property.status === 'partial'
                      ? 'bg-yellow-100 text-yellow-700'
                      : property.status === 'finish'
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {property.status?.toUpperCase()}
                </span>
              </div>

              {/* Navigate button aligned to right below status */}
              <div className="flex justify-end mb-2">
                <button
                  className="flex items-center gap-1 text-blue-600 text-xs px-2 py-1 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent parent click
                    handleNavigate(property.coordinates?.lat, property.coordinates?.lng);
                  }}
                  title="Navigate to property"
                >
                  <Car size={14} />
                  Navigate
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-2">
                {property.coordinates?.lat?.toFixed(4)}, {property.coordinates?.lng?.toFixed(4)}
              </p>

              {property.owner && (
                <div className="text-sm text-gray-700 space-y-1 mb-2">
                  <p>
                    <span className="font-medium">Contact:</span> {property.owner.name}
                  </p>
                  <p>
                    Phone:{' '}
                    <a href={`tel:${property.owner.phone}`} className="text-blue-600 underline">
                      {property.owner.phone}
                    </a>
                  </p>
                  <p>
                    Email:{' '}
                    <a href={`mailto:${property.owner.email}`} className="text-blue-600 underline">
                      {property.owner.email}
                    </a>
                  </p>
                </div>
              )}

              <div className="text-sm text-gray-700 space-y-1">
                {property.description && <p>{property.description}</p>}
                {property.size && <p>Size: {property.size}</p>}
                {property.rent && <p>Monthly Rent: ₹{property.rent}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};