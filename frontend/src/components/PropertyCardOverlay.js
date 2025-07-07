import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const PropertyCardOverlay = ({ property, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadSlot, setUploadSlot] = useState('upload1'); // Default slot

  // 🔍 Confirm the actual primary key ID
  useEffect(() => {
    if (property?.id) {
      console.log('property.id (primary key):', property.id);
    }
    if (property?.id_cong) {
      console.log('property.id_cong (legacy code):', property.id_cong);
    }
  }, [property]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!property?.id || !uploadSlot || !selectedFile) {
      setMessage('Missing file or property ID');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploading(true);
      const res = await axios.post(
        `http://localhost:8000/api/properties/${property.id}/upload/${uploadSlot}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setMessage(`✅ Uploaded: ${res.data.filename}`);
      setSelectedFile(null);
    } catch (err) {
      console.error('Upload failed:', err);
      setMessage('❌ Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">
          Upload for {property?.code || 'Property'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            value={uploadSlot}
            onChange={(e) => setUploadSlot(e.target.value)}
            className="border p-1 w-full text-sm"
          >
            <option value="upload">Upload 0</option>
            <option value="upload1">Upload 1</option>
            <option value="upload2">Upload 2</option>
            <option value="upload3">Upload 3</option>
          </select>

          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full border border-gray-300 text-sm p-1"
          />

          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 text-white text-sm px-4 py-1 rounded hover:bg-blue-700"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>

        {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}

        <button
          onClick={onClose}
          className="mt-4 text-xs text-gray-500 underline hover:text-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};