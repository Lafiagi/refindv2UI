import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import api from '../lib/api';
import { 
  CheckCircleIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface UserProfileData {
  id: number;
  username: string;
  email: string;
  profile_picture?: string;
  bio?: string;
  city?: string;
  country?: string;
  phone_number?: string;
  items_found?: number;
  items_lost?: number;
  items_recovered?: number;
  reputation_score?: number;
  is_verified?: boolean;
}

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/auth/users/${username}/`);
        setProfile(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile');
        toast.error('User profile not found');
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const handleSendMessage = () => {
    if (profile) {
      navigate(`/messages?conversation=${profile.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 px-4 max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="h-32 w-32 bg-slate-100 rounded-full animate-pulse"></div>
          <div className="h-8 bg-slate-100 rounded w-1/3 animate-pulse"></div>
          <div className="h-40 bg-slate-100 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen pt-20 px-4 max-w-4xl mx-auto flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">User Not Found</h2>
          <p className="text-slate-500">{error || 'This user profile does not exist'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Background */}
      <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600 relative">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 -mt-16 relative z-10 p-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8 mb-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar
                src={profile.profile_picture}
                name={profile.username}
                size="xl"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                  {profile.username}
                </h1>
                {profile.is_verified && (
                  <CheckCircleIcon className="h-8 w-8 text-blue-500" />
                )}
              </div>
              
              {profile.bio && (
                <p className="text-slate-600 text-lg mb-4">{profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                {profile.city && (
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    {profile.city}
                    {profile.country && `, ${profile.country}`}
                  </div>
                )}
                {profile.phone_number && (
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4" />
                    {profile.phone_number}
                  </div>
                )}
                {profile.email && (
                  <div className="flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4" />
                    {profile.email}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-200">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-orange-600">
                {profile.items_found || 0}
              </p>
              <p className="text-sm text-slate-500 mt-1">Items Found</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-red-600">
                {profile.items_lost || 0}
              </p>
              <p className="text-sm text-slate-500 mt-1">Items Lost</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-green-600">
                {profile.items_recovered || 0}
              </p>
              <p className="text-sm text-slate-500 mt-1">Recovered</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <p className="text-2xl md:text-3xl font-bold text-yellow-600">
                  {profile.reputation_score || 0}
                </p>
                <StarIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="text-sm text-slate-500 mt-1">Reputation</p>
            </div>
          </div>
        </div>

        {/* Message Section */}
        <div className="mt-8 bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Contact User</h2>
          <button 
            onClick={handleSendMessage}
            className="btn-primary w-full md:w-auto"
          >
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
