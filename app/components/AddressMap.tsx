'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

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
  const MapComponent = useMemo(
    () =>
      dynamic(() => import('@/app/components/MapComponent'), {
        loading: () => <p>Loading map...</p>,
        ssr: false,
      }),
    []
  );

  return (
    <MapComponent
      latitude={latitude}
      longitude={longitude}
      address={address}
    />
  );
}