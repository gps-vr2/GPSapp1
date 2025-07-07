import React from 'react';

export const PropertyCard = ({ property, onUpload, onNavigate }) => {
  const handleUpload = (slot) => {
    if (onUpload) {
      onUpload(property, slot);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-md shadow-sm p-5 w-full max-w-xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        {property.code || 'Untitled Property'}
      </h2>
      <p className="text-sm text-gray-500 mb-2">ID: {property.id}</p>

      <div className="text-sm space-y-1 text-gray-700">
        <p><strong>Status:</strong> <span className="text-indigo-600 font-medium">{property.status}</span></p>
        <p><strong>Owner:</strong> {property.owner?.name || '—'}</p>
        <p><strong>Area:</strong> {property.area || '—'}</p>
        <p><strong>Phone:</strong> {property.owner?.phone || '—'}</p>
        <p><strong>Email:</strong> {property.owner?.email || '—'}</p>
        <p><strong>Description:</strong> {property.description || '—'}</p>
      </div>

      {/* ✅ Action Buttons only — No status or file names shown */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => handleUpload('upload1')}
          className="bg-red-600 text-white px-4 py-1 text-sm rounded hover:bg-red-700"
        >
          Unbook
        </button>
        <button
          onClick={() => handleUpload('upload2')}
          className="bg-yellow-500 text-white px-4 py-1 text-sm rounded hover:bg-yellow-600"
        >
          Partial
        </button>
        <button
          onClick={() => handleUpload('upload3')}
          className="bg-green-600 text-white px-4 py-1 text-sm rounded hover:bg-green-700"
        >
          Finish
        </button>
        <button
          onClick={() => onNavigate(property)}
          className="ml-auto bg-gray-800 text-white px-4 py-1 text-sm rounded hover:bg-gray-900"
        >
          Navigate
        </button>
      </div>
    </div>
  );
};