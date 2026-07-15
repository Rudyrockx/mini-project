'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import {
  User,
  Mail,
  MapPin,
  Map,
  FileText,
  Edit2,
  X,
  Check,
  LogOut,
  Settings,
  AlertTriangle,
  Camera
} from 'lucide-react';

import AddressAutocomplete from '@/app/components/AddressAutocomplete';
import 'leaflet/dist/leaflet.css';

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

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Fix for default Leaflet icon marker issues in Next.js (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((module) => {
        const L = module.default;
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
      });
    }
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    latitude: 0,
    longitude: 0,
  });

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload/avatar', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        alert('Upload failed');
        return;
      }

      const data = await res.json();
      setAvatarUrl(data.avatarUrl);
      alert('Avatar updated!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4 bg-[#f8f9ff] dark:bg-zinc-950">
        <div className="h-10 w-10 border-4 border-[#6c2ce6] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#45464d] dark:text-zinc-400 font-medium">Loading profile details...</span>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="relative min-h-screen p-4 sm:p-8 lg:p-12 overflow-hidden bg-[#f8f9ff] dark:bg-zinc-950 selection:bg-[#6c2ce6]/20">
      {/* Decorative ambient backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#6c2ce6]/5 dark:bg-[#6c2ce6]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#854eff]/5 dark:bg-[#854eff]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        
        {/* Header card wrapper */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-zinc-900 border border-[#e5eeff] dark:border-zinc-800/30 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#0b1c30] dark:text-zinc-50">
              Account Profile
            </h1>
            <p className="text-sm text-[#45464d] dark:text-zinc-400 mt-1">
              Configure personal parameters, locate physical address & download verified reports.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-1.5 shadow-sm ${
                isEditing
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                  : 'bg-[#6c2ce6] hover:bg-[#6c2ce6]/90 text-white'
              }`}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel Edit
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="px-5 py-2.5 border border-rose-200 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-650 dark:text-rose-455 text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Avatar Section */}
          <div className="bg-white dark:bg-zinc-900 border border-[#e5eeff] dark:border-zinc-800/30 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center text-center space-y-6 h-fit">
            <h2 className="text-lg font-bold text-[#0b1c30] dark:text-zinc-50 w-full text-left border-b border-[#e5eeff] dark:border-zinc-800 pb-3">
              Profile Photo
            </h2>

            {/* Avatar Display */}
            <div className="relative group">
              {avatarUrl ? (
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-[#e5eeff] dark:border-zinc-850 shadow-md">
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-36 h-36 rounded-full bg-[#f8f9ff] dark:bg-zinc-800 border-2 border-dashed border-[#c6c6cd] flex flex-col items-center justify-center text-[#45464d] dark:text-zinc-400">
                  <User className="w-12 h-12 text-[#6c2ce6] opacity-60 mb-2" />
                  <span className="text-xs font-semibold">No Image</span>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <label className="inline-block w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                className="hidden"
              />
              <button
                onClick={(e) => e.currentTarget.parentElement?.querySelector('input')?.click()}
                disabled={uploading}
                className="w-full px-5 py-3 bg-[#6c2ce6] hover:bg-[#6c2ce6]/90 text-white rounded-xl transition-all shadow-sm font-bold text-xs uppercase tracking-wider disabled:bg-zinc-400 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Change Avatar'}
              </button>
            </label>
          </div>

          {/* Right Column - Fields, Maps & Downloads */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Basic Info panel */}
            <div className="bg-white dark:bg-zinc-900 border border-[#e5eeff] dark:border-zinc-800/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-heading text-lg font-bold text-[#0b1c30] dark:text-zinc-50 border-b border-[#e5eeff] dark:border-zinc-800 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-[#6c2ce6]" />
                Basic Credentials
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#45464d] dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Full Display Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-[#f8f9ff] dark:bg-zinc-900/50 border border-[#e5eeff] dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6c2ce6]/25 focus:border-[#6c2ce6] transition-all text-sm text-[#0b1c30] dark:text-zinc-50 placeholder:text-zinc-400 disabled:bg-zinc-100/50 dark:disabled:bg-zinc-900/30 disabled:text-zinc-500 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#45464d] dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Registered Email (Read-Only)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 bg-zinc-100/50 dark:bg-zinc-900/30 border border-[#e5eeff] dark:border-zinc-800 rounded-xl text-sm text-zinc-500 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-amber-600 dark:text-amber-500 mt-1.5 uppercase tracking-wider font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Email credentials cannot be changed once verified
                  </p>
                </div>

                {isEditing && (
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Check className="w-4 h-4" />
                    {loading ? 'Saving credentials...' : 'Save Changes'}
                  </button>
                )}
              </div>
            </div>

            {/* Address Autocomplete panel */}
            <div className="bg-white dark:bg-zinc-900 border border-[#e5eeff] dark:border-zinc-800/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-heading text-lg font-bold text-[#0b1c30] dark:text-zinc-50 border-b border-[#e5eeff] dark:border-zinc-800 pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#6c2ce6]" />
                Home Address Coordinate Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#45464d] dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
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
                  <p className="text-[10px] text-[#45464d] dark:text-zinc-500 mt-1.5 uppercase tracking-wider font-semibold">
                    🔍 Type to search coordinates powered by Geoapify
                  </p>
                </div>

                {isEditing && (
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Check className="w-4 h-4" />
                    {loading ? 'Saving address...' : 'Save Address Details'}
                  </button>
                )}
              </div>
            </div>

            {/* Location Map Section */}
            <div className="bg-white dark:bg-zinc-900 border border-[#e5eeff] dark:border-zinc-800/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-heading text-lg font-bold text-[#0b1c30] dark:text-zinc-50 border-b border-[#e5eeff] dark:border-zinc-800 pb-3 flex items-center gap-2">
                <Map className="w-5 h-5 text-[#6c2ce6]" />
                Interactive Coordinates Canvas
              </h3>

              <div className="relative border border-[#e5eeff] dark:border-zinc-800 rounded-2xl overflow-hidden shadow-inner bg-[#f8f9ff] dark:bg-zinc-950 z-0">
                {typeof window !== 'undefined' && (
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
                )}
              </div>

              {formData.address && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#eff4ff] dark:bg-[#854eff]/10 border border-[#e5eeff] dark:border-zinc-800/30 rounded-2xl">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#6c2ce6] dark:text-indigo-400 uppercase tracking-wider">
                      Coordinate Markers verified
                    </span>
                    <p className="font-mono text-xs text-[#0b1c30] dark:text-zinc-350">
                      Latitude: {formData.latitude.toFixed(6)} • Longitude: {formData.longitude.toFixed(6)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 bg-[#6c2ce6]/10 text-[#6c2ce6] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border border-[#6c2ce6]/25">
                      📍 Geocoded
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Download Profile widget */}
            <div className="bg-white dark:bg-zinc-900 border border-[#e5eeff] dark:border-zinc-800/30 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="font-heading text-base font-bold text-[#0b1c30] dark:text-zinc-50 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#6c2ce6]" />
                  Export Local Directory Profile
                </h4>
                <p className="text-xs text-[#45464d] dark:text-zinc-400">
                  Download all verified location coordinates and personal profile data as a structured PDF document.
                </p>
              </div>
              <button
                onClick={handleDownloadProfile}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#6c2ce6] hover:bg-[#6c2ce6]/90 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <FileText className="w-4 h-4" />
                Download PDF
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}