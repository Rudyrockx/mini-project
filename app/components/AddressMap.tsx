'use client';

import dynamic from 'next/dynamic';

const MapContent = dynamic(
  () => import('@/app/components/MapComponent'),
  { ssr: false, loading: () => <p>Loading map...</p> }
);

interface AddressMapProps {
  latitude: number;
  longitude: number;
  address?: string;
}

export default function AddressMap({
  latitude,
  longitude,
  address,
}: AddressMapProps) {
  return (
    <MapContent
      latitude={latitude}
      longitude={longitude}
      address={address}
    />
  );
}