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
        className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all text-sm text-zinc-900 dark:text-zinc-150 placeholder:text-zinc-400 disabled:bg-zinc-100/50 dark:disabled:bg-zinc-900/30 disabled:text-zinc-500"
      />

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl mt-2 shadow-xl z-50 overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSelectPlace(suggestion)}
              className="px-4 py-2.5 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 cursor-pointer border-b border-zinc-100 dark:border-zinc-800 last:border-b-0"
            >
              <p className="text-sm text-zinc-850 dark:text-zinc-200">
                {suggestion.properties.formatted}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}