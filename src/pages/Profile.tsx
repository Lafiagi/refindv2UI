import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useItemsStore } from '../store/itemsStore';
import Avatar from '../components/Avatar';
import api from '../lib/api';
import { 
  UserCircleIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  CameraIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

export default function Profile() {
  const { user, fetchUser, isAuthenticated } = useAuthStore();
  const { myLostItems, myFoundItems, fetchMyLostItems, fetchMyFoundItems } = useItemsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    phone_number: '',
    bio: '',
    city: '',
    country: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // Load user stats
  useEffect(() => {
    if (isAuthenticated) {
      fetchMyLostItems();
      fetchMyFoundItems();
    }
  }, [isAuthenticated, fetchMyLostItems, fetchMyFoundItems]);

  // Initialize form data properly
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        phone_number: user.phone_number || '',
        bio: user.profile?.bio || '',
        city: user.profile?.city || '',
        country: user.profile?.country || '',
      });
    }
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);
    
    setIsUploadingImage(true);
    setError('');
    
    try {
      await api.patch('/auth/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchUser();
      setSuccess('Profile picture updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.new_password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await api.post('/auth/change-password/', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setIsChangingPassword(false);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Separate user fields from profile fields
      const userUpdate = {
        username: formData.username,
        phone_number: formData.phone_number,
      };

      const profileUpdate = {
        bio: formData.bio,
        city: formData.city,
        country: formData.country,
      };

      // Update user fields first
      await api.patch('/auth/profile/', userUpdate);
      
      // Update profile fields separately
      await api.patch('/auth/profile/update-profile/', profileUpdate);
      
      await fetchUser();
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar 
                  src={user?.profile_picture} 
                  name={user?.username || 'User'} 
                  size="xl"
                  className="w-20 h-20"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50"
                >
                  <CameraIcon className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user?.username}</h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <PencilIcon className="h-5 w-5" />
                  <span>Edit Profile</span>
                </button>
              )}
              <button
                onClick={() => setIsChangingPassword(true)}
                className="btn-secondary flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <KeyIcon className="h-5 w-5" />
                <span>Change Password</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">
                {myLostItems.length}
              </p>
              <p className="text-sm text-gray-600">Lost Items</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {myFoundItems.length}
              </p>
              <p className="text-sm text-gray-600">Found Items</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {user?.profile?.items_recovered || 0}
              </p>
              <p className="text-sm text-gray-600">Recovered</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">
                {user?.profile?.reputation_score || 0}
              </p>
              <p className="text-sm text-gray-600">Reputation</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <XCircleIcon className="h-5 w-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <p className="text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!isEditing}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={user?.email || ''}
                  disabled={true}
                  className="input-field bg-gray-100 text-gray-500 cursor-not-allowed"
                  title="Email cannot be changed"
                />
              </div>

              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  disabled={!isEditing}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={!isEditing}
                  className="input-field"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  disabled={!isEditing}
                  className="input-field"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  className="input-field"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center space-x-4 mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setError('');
                    setSuccess('');
                    // Reset form data to current user data
                    if (user) {
                      setFormData({
                        username: user.username || '',
                        phone_number: user.phone_number || '',
                        bio: user.profile?.bio || '',
                        city: user.profile?.city || '',
                        country: user.profile?.country || '',
                      });
                    }
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Password Change Modal */}
        {isChangingPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
              
              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <XCircleIcon className="h-5 w-5 text-red-600" />
                  <p className="text-red-700 text-sm">{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  <p className="text-green-700 text-sm">{passwordSuccess}</p>
                </div>
              )}
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    className="input-field"
                    required
                    minLength={8}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    className="input-field"
                    required
                    minLength={8}
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary flex-1"
                  >
                    {isLoading ? 'Changing...' : 'Change Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordError('');
                      setPasswordSuccess('');
                      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


