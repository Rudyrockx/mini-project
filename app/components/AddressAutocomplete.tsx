'use client';

import { useState } from 'react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, latitude: number, longitude: number) => void;
  disabled?: boolean;
}

export default function AddressAutocomplete({
  value,
  onChange,
  disabled,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    onChange(input, 0, 0);

    if (!input || input.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(input)}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API}`
      );
      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error('Autocomplete error:', error);
    }
  };

  const handleSelectPlace = (feature: any) => {
    const { lat, lon } = feature.properties;
    const formatted_address = feature.properties.formatted;
    onChange(formatted_address, lat, lon);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        placeholder="Start typing to search for address..."
        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
      />

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSelectPlace(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
            >
              <p className="text-sm text-black">
                {suggestion.properties.formatted}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}