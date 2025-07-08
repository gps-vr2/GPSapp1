import React, { useState } from 'react';
import { BASE_URL } from '../config';

export const PropertyCardOverlay = ({ property, uploadSlot, onClose }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!file || !property?.id || !uploadSlot) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(
        `${BASE_URL}/api/properties/${property.id}/upload/${uploadSlot}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await res.json();
      if (res.ok) {
        alert(`✅ Upload successful: ${result.filename}`);
        onClose();
      } else {
        alert(`❌ Upload failed: ${result.error}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Server error during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Upload File for Slot: {uploadSlot}
        </h2>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-3"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1 rounded bg-gray-400 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {uploading ? 'Uploading...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};