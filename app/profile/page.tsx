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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Profile</h1>
          <div className="space-x-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                {avatarUrl || session.user?.image ? (
                  <Image
                    src={avatarUrl || session.user?.image || ''}
                    alt="Profile"
                    width={200}
                    height={200}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-black">No profile picture</span>
                  </div>
                )}
              </div>

              {isEditing && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-black mt-2">
                    (Will be uploaded to Storj)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-black text-2xl font-bold mb-4">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-black block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="text-black block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                  <p className="text-xs text-black mt-2">Email cannot be changed</p>
                </div>

                {isEditing && (
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                )}
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-black">Address</h2>

              <div className="space-y-4">
                <div>
                  <div>
                    <label className="text-black block text-sm font-medium mb-2">
                      Address
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
                    <p className="text-xs text-black mt-2">
                      Start typing and select from suggestions
                    </p>
                  </div>
                  <p className="text-xs text-black mt-2">
                    (Will have Google Maps autocomplete)
                  </p>
                </div>

                {isEditing && (
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="text-black w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Address'}
                  </button>
                )}
              </div>
            </div>

            {/* Map Section */}
            {/* Map Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-black text-2xl font-bold mb-4">Location Map</h2>

                  <MapContainer
                    center={[formData.latitude || 20.5937, formData.longitude || 78.9629]}
                    zoom={formData.latitude && formData.longitude ? 15 : 4}
                    style={{ width: '100%', height: '400px', borderRadius: '8px' }}
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

                  {formData.address && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-black">
                        <strong>Coordinates:</strong> Lat: {formData.latitude.toFixed(6)}, Lng:{' '}
                        {formData.longitude.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>

            {/* Download Profile */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-black text-2xl font-bold mb-4">Export Profile</h2>
              <button
                onClick={handleDownloadProfile}
                className="text-black w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
              >
                Download Profile as PDF
              </button>
              <p className="text-xs text-black mt-2">
                Export all your profile information in PDF format
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}