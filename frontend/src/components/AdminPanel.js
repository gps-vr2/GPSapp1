import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';

const AdminPanel = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [properties, setProperties] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const ADMIN_PASSWORD = 'propertyAdmin'; // 🔐 Replace with your own password

  useEffect(() => {
    if (authenticated) {
      axios.get(`${BASE_URL}/api/properties`)
        .then(res => setProperties(res.data))
        .catch(err => console.error('Error loading admin data:', err));
    }
  }, [authenticated, refreshFlag]);

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert('Wrong password');
      setPasswordInput('');
    }
  };

  const handleStatusChange = (id, newStatus) => {
    axios.put(`${BASE_URL}/api/properties/${id}/status`, { status: newStatus })
      .then(() => setRefreshFlag(!refreshFlag))
      .catch(() => alert('Failed to update status'));
  };

  const handleDeletePhoto = (id, slot) => {
    axios.delete(`${BASE_URL}/api/properties/${id}/upload/${slot}`)
      .then(() => setRefreshFlag(!refreshFlag))
      .catch(() => alert('Failed to delete photo'));
  };

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h2 className="text-lg mb-4 font-medium">Admin Login</h2>
        <input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          placeholder="Enter admin password"
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={handleLogin}
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold mb-4">🛠️ Admin Panel</h2>
      {properties.map((prop) => (
        <div key={prop.id} className="border rounded p-4 shadow space-y-2">
          <h3 className="text-lg font-semibold">{prop.code || 'Unnamed'}</h3>
          <p className="text-sm text-gray-600">{prop.area}</p>

          <select
            value={prop.status}
            onChange={(e) => handleStatusChange(prop.id, e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="partial">Partial</option>
            <option value="finish">Finish</option>
          </select>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {['upload', 'upload1', 'upload2', 'upload3'].map((slot) => (
              <div key={slot} className="flex flex-col items-center">
                <img
                  src={`${BASE_URL}/api/properties/${prop.id}/photo/${slot}`}
                  alt={`${slot}`}
                  className="h-24 w-24 object-cover border"
                  onError={(e) => (e.target.style.display = 'none')}
                />
                <button
                  onClick={() => handleDeletePhoto(prop.id, slot)}
                  className="mt-2 text-red-600 text-xs hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;