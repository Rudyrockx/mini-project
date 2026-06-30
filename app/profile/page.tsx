'use client';


import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import AddressAutocomplete from '@/app/components/AddressAutocomplete';

const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon marker issues in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    latitude: 0,
    longitude: 0,
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        address: '',
        latitude: 0,
        longitude: 0,
      });
    }
  }, [session, status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();

        if (data.success && data.user) {
          setFormData({
            name: data.user.name || '',
            email: data.user.email || '',
            address: data.user.address || '',
            latitude: data.user.latitude || 0,
            longitude: data.user.longitude || 0,
          });
          if (data.user.avatarUrl) {
            setAvatarUrl(data.user.avatarUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const handleDownloadProfile = async () => {
    try {
      const res = await fetch('/api/profile/download');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'profile.pdf';
      a.click();
    } catch (error) {
      alert('Error downloading profile');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-zinc-650 dark:text-zinc-400 font-medium">Loading profile details...</span>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-8 lg:p-12 overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl animate-float-delayed" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Header card wrapper */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl">
          <div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Account Profile
            </h1>
            <p className="text-sm text-zinc-650 dark:text-zinc-400 mt-1">
              Configure personal parameters, locate physical address & download verified reports.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                isEditing
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                  : 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-755 text-white shadow-md'
              }`}
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="px-5 py-2.5 border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-650 dark:text-red-400 text-sm font-semibold rounded-xl transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Avatar Upload */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md rounded-3xl p-6 shadow-lg flex flex-col items-center">
              <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-6 text-center w-full border-b border-zinc-100 dark:border-zinc-800 pb-3">
                Avatar Image
              </h3>

              <div className="relative group w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 shadow-inner flex items-center justify-center mb-6 transition-all duration-300">
                {avatarUrl || session.user?.image ? (
                  <Image
                    src={avatarUrl || session.user?.image || ''}
                    alt="Profile Avatar"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-4xl mb-2 block">👤</span>
                    <span className="text-xs font-semibold text-zinc-500">No profile picture</span>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="w-full space-y-3">
                  <label className="block text-xs font-semibold text-zinc-650 dark:text-zinc-400 uppercase tracking-wider text-center">
                    Upload New Photo
                  </label>
                  <div className="relative flex items-center justify-center w-full h-24 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-all group cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="text-center pointer-events-none">
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-indigo-500 transition-colors">
                        Click or drag image file
                      </span>
                      <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-1">
                        Supported formats: PNG, JPG, WEBP
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 justify-center bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/30 dark:border-indigo-900/30
                   text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-xl text-[10px] font-semibold uppercase tracking-wider">
                    <span>☁️ Verified Upload via Storj</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Fields, Maps & Downloads */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Basic Info panel */}
            <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
              <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                Basic Credentials
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-650 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Full Display Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2
                     focus:ring-indigo-500/25 focus:border-indigo-500 transition-all text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 disabled:bg-zinc-100/50 dark:disabled:bg-zinc-900/30 disabled:text-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-655 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Registered Email (Read-Only)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-500 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-1.5 uppercase tracking-wide font-medium">
                    ⚠️ Email credentials cannot be changed once verified
                  </p>
                </div>

                {isEditing && (
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 rounded-xl
                     shadow-lg shadow-emerald-550/15 hover:shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? 'Saving credentials...' : 'Save Changes'}
                  </button>
                )}
              </div>
            </div>

            {/* Address Autocomplete panel */}
            <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
              <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                Home Address Coordinate Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-650 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Physical Address Search
                  </label>
                  <AddressAutocomplete
                    value={formData.address}
                    onChange={(address, lat, lng) => {
                      setFormData((prev) => ({
                        ...prev,
                        address: address,
                        latitude: lat,
                        longitude: lng,
                      }));
                    }}
                    disabled={!isEditing}
                  />
                  <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-1.5 uppercase tracking-wide font-medium">
                    🔍 Type to search coordinates powered by Geoapify
                  </p>
                </div>

                {isEditing && (
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-550/15
                     hover:shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? 'Saving address...' : 'Save Address Details'}
                  </button>
                )}
              </div>
            </div>

            {/* Location Map Section */}
            <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
              <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                Interactive Coordinates Canvas
              </h3>

              <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-inner bg-zinc-100 dark:bg-zinc-950 z-0">
                <MapContainer
                  center={[formData.latitude || 20.5937, formData.longitude || 78.9629]}
                  zoom={formData.latitude && formData.longitude ? 15 : 4}
                  style={{ width: '100%', height: '400px' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  {formData.latitude && formData.longitude && (
                    <Marker position={[formData.latitude, formData.longitude]}>
                      <Popup>{formData.address || 'Your Location'}</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>

              {formData.address && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                      Coordinate Markers verified
                    </span>
                    <p className="font-mono text-xs text-zinc-700 dark:text-zinc-350">
                      Latitude: {formData.latitude.toFixed(6)} • Longitude: {formData.longitude.toFixed(6)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                      📍 Geocoded
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Download Profile widget */}
            <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="font-heading text-base font-bold text-zinc-900 dark:text-zinc-50">
                  Export Local Directory Profile
                </h4>
                <p className="text-xs text-zinc-650 dark:text-zinc-400">
                  Download all verified location coordinates and personal profile data as a structured PDF document.
                </p>
              </div>
              <button
                onClick={handleDownloadProfile}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-650 hover:to-fuchsia-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/10 hover:shadow-violet-500/25 
                hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Download PDF
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}