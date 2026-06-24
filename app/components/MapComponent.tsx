'use client';

interface MapContentProps {
  latitude: number;
  longitude: number;
  address?: string;
}

export default function MapContent({
  latitude,
  longitude,
  address,
}: MapContentProps) {
  const lat = latitude || 20.5937;
  const lng = longitude || 78.9629;
  const zoom = latitude && longitude ? 15 : 4;

  // Geoapify static map URL
  const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=800&height=400&center=lonlat:${lng},${lat}&zoom=${zoom}&marker=lonlat:${lng},${lat}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API}`;

  return (
    <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <img
        src={mapUrl}
        alt="Location Map"
        style={{ width: '100%', height: '400px', display: 'block' }}
      />
    </div>
  );
}