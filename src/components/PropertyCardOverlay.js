import React from 'react';
import { X } from 'lucide-react';

export const PropertyCardOverlay = ({ property, onClose }) => {
  if (!property) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-xl bg-white rounded-lg shadow-xl border border-gray-200 p-4">
      <div className="flex justify-between items-start">
        <div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            property.status === 'booked' ? 'bg-red-100 text-red-700' :
            property.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {property.status === 'booked' ? 'Fully Booked' : property.status}
          </span>
          <h2 className="text-lg font-bold text-gray-800 mt-1">{property.code} {property.area && `– ${property.area}`}</h2>
          <p className="text-sm text-gray-500 mb-2">
            {property.coordinates?.lat?.toFixed(4)}, {property.coordinates?.lng?.toFixed(4)}
          </p>

          <div className="text-sm text-gray-700 space-y-1">
            {property.owner && (
              <>
                <p>Owner: <span className="font-medium">{property.owner.name}</span></p>
                <p>Phone: <a href={`tel:${property.owner.phone}`} className="text-blue-600 underline">{property.owner.phone}</a></p>
                <p>Email: <a href={`mailto:${property.owner.email}`} className="text-blue-600 underline">{property.owner.email}</a></p>
              </>
            )}
            {property.address && <p>Address: {property.address}</p>}
            {property.size && <p>Size: {property.size}</p>}
            {property.rent && <p>Monthly Rent: ₹{property.rent}</p>}
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};