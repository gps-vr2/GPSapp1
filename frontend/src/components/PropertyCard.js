import React, { useState } from 'react';
import { MdEmojiTransportation } from "react-icons/md";
import { BsBookmarkDash, BsBookmarkXFill, BsBookmarkStar } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

export const PropertyCard = ({ property, onUpload, onNavigate, onClose }) => {
  const [activeSlot, setActiveSlot] = useState(null);
  const [fileBlob, setFileBlob] = useState(null);

  const handleUpload = (slot) => {
    setActiveSlot(slot);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onUpload) {
      setFileBlob(file);
      onUpload(property, activeSlot, file); // 🧠 Updated to include blob
      setActiveSlot(null); // Close modal after upload
    }
  };

  return (
    <div className="relative bg-white border border-gray-300 rounded-md shadow-lg p-5 w-full max-w-xl z-[9999]">
      {/* ❌ Close button */}
      {onClose && (
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
        >
          <IoClose />
        </button>
      )}

      {/* 🏠 Property Info */}
      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        {property.code || 'Untitled Property'}
      </h2>
      <p className="text-sm text-gray-500 mb-2">ID: {property.id}</p>

      <div className="text-sm space-y-1 text-gray-700">
        <p><strong>Status:</strong> <span className="text-indigo-600 font-medium">{property.status}</span></p>
        <p><strong>Owner:</strong> {property.owner_name || '—'}</p>
        <p><strong>Area:</strong> {property.area || '—'}</p>
        <p><strong>Phone:</strong> {property.owner_phone || '—'}</p>
        <p><strong>Email:</strong> {property.owner_email || '—'}</p>
        <p><strong>Description:</strong> {property.description || '—'}</p>
      </div>

      {/* 🔘 Action Buttons */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => handleUpload('upload1')}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-1 text-sm rounded hover:bg-red-700"
        >
          <BsBookmarkDash />
          Unbook
        </button>

        <button
          onClick={() => handleUpload('upload2')}
          className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-1 text-sm rounded hover:bg-yellow-600"
        >
          <BsBookmarkStar />
          Partial
        </button>

        <button
          onClick={() => handleUpload('upload3')}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-1 text-sm rounded hover:bg-green-700"
        >
          <BsBookmarkXFill />
          Finish
        </button>

        <button
          onClick={() => onNavigate(property)}
          className="flex items-center gap-2 ml-auto bg-gray-800 text-white px-4 py-1 text-sm rounded hover:bg-gray-900"
        >
          <MdEmojiTransportation />
          Navigate
        </button>
      </div>

      {/* 🖼️ Upload Dialog (Rendered Above Map) */}
      {activeSlot && (
        <div className="fixed inset-0 z-[99999] bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-5 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setActiveSlot(null)}
            >
              <IoClose size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Upload for {activeSlot}
            </h3>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 border border-gray-300 rounded-md p-2"
              accept="image/*"
            />
            {fileBlob && (
              <p className="mt-2 text-sm text-green-600">✔️ File ready: {fileBlob.name}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};