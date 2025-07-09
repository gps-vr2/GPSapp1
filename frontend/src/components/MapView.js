import React, { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Layers, Maximize } from 'lucide-react';

export const MapView = ({ properties, onPropertySelect }) => {
  const [mapState, setMapState] = useState({
    center: { lat: 13.0827, lng: 80.2707 },
    zoom: 11,
    mapType: 'map'
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'partial':
        return 'bg-yellow-500';
      case 'booked':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const toggleMapType = () => {
    setMapState((prev) => ({
      ...prev,
      mapType: prev.mapType === 'map' ? 'satellite' : 'map'
    }));
  };

  const MapTracker = () => {
    useMapEvents({
      move: (e) => {
        const center = e.target.getCenter();
        setMapState((prev) => ({
          ...prev,
          center: { lat: center.lat, lng: center.lng }
        }));
      },
      zoomend: (e) => {
        setMapState((prev) => ({
          ...prev,
          zoom: e.target.getZoom()
        }));
      }
    });
    return null;
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapContainer
        center={[mapState.center.lat, mapState.center.lng]}
        zoom={mapState.zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url={
            mapState.mapType === 'satellite'
              ? 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        />
        <MapTracker />

        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[
              property.coordinates.lat,
              property.coordinates.lng
            ]}
            eventHandlers={{
              click: () => onPropertySelect(property)
            }}
            icon={L.divIcon({
              className: '',
              html: `
                <div class="w-10 h-10 ${getStatusColor(property.status)} rounded-full shadow-md
                            flex items-center justify-center text-white font-bold text-[10px] text-center leading-tight px-1">
                  ${property.code || 'N/A'}
                </div>
                <div class="w-3 h-3 ${getStatusColor(property.status)} rotate-45 mt-[-6px] shadow-md mx-auto"></div>
              `,
              iconSize: [40, 48],
              iconAnchor: [20, 40]
            })}
          >
            <Popup>
              <strong>{property.code}</strong><br />
              {property.area}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-20">
        <div className="bg-white rounded-lg shadow-md p-1">
          <button
            onClick={toggleMapType}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Layers size={18} className="text-gray-700" />
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-1">
          <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
            <Maximize size={18} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Map Type Toggle */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setMapState((prev) => ({ ...prev, mapType: 'map' }))}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                mapState.mapType === 'map'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setMapState((prev) => ({ ...prev, mapType: 'satellite' }))}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                mapState.mapType === 'satellite'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Satellite
            </button>
          </div>
        </div>
      </div>

      {/* Location Info */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chennai Metro Area</p>
              <p className="text-lg font-semibold text-gray-900">
                {mapState.center.lat.toFixed(6)}, {mapState.center.lng.toFixed(6)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={20} className="text-blue-500" />
              <span className="text-sm text-gray-600">Zoom: {mapState.zoom}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};