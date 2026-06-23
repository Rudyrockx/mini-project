'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  latitude: number;
  longitude: number;
  address?: string;
}

const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.setIcon(defaultIcon);

export default function MapComponent({
  latitude,
  longitude,
  address,
}: MapComponentProps) {
  const center = latitude && longitude ? [latitude, longitude] : [20.5937, 78.9629];

  return (
    <MapContainer
      center={center as any}
      zoom={latitude && longitude ? 15 : 4}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '400px', borderRadius: '8px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {latitude && longitude && (
        <Marker position={[latitude, longitude] as any} icon={defaultIcon}>
          <Popup>{address || 'Your Location'}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}