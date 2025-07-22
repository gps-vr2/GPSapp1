import React from 'react';
import { MdEmojiTransportation } from "react-icons/md";
import { BsBookmarkDash } from "react-icons/bs";
import { BsBookmarkXFill } from "react-icons/bs";
import { BsBookmarkStar } from "react-icons/bs";


// ⬇️ Add your emoji-style icons here
// Example: import { MdEmojiTransportation, MdCancel, MdCheckCircle, MdTune } from "react-icons/md";

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

      {/* ✅ Action Buttons with emoji slots */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => handleUpload('upload1')}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-1 text-sm rounded hover:bg-red-700"
        >
          {<BsBookmarkDash />}
          
        </button>

        <button
          onClick={() => handleUpload('upload2')}
          className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-1 text-sm rounded hover:bg-yellow-600"
        >
          {<BsBookmarkStar />}
         
        </button>

        <button
          onClick={() => handleUpload('upload3')}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-1 text-sm rounded hover:bg-green-700"
        >
          {<BsBookmarkXFill />}
        
        </button>

        <button
          onClick={() => onNavigate(property)}
          className="flex items-center gap-2 ml-auto bg-gray-800 text-white px-4 py-1 text-sm rounded hover:bg-gray-900"
        >
          {<MdEmojiTransportation />}
         
        </button>
      </div>
    </div>
  );
};