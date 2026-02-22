import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';
import Avatar from '../Avatar';
import {
  MagnifyingGlassIcon,
  HeartIcon,
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { unreadCount, fetchNotifications } = useNotificationStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/items?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/items');
    }
  };

  const handleMobileMenuItemClick = () => {
    setMobileMenuOpen(false);
  };

  // Click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Fetch notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

  return (
    <nav className="glass-panel sticky top-4 mx-4 md:mx-8 rounded-2xl z-50 mb-8 border border-white/40 shadow-sm backdrop-blur-xl bg-white/90 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo → always home */}
          <Link to="/" className="flex items-center space-x-2 mr-8 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/30 transition-all duration-300">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Refind</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/items"
              className="text-gray-700 hover:text-primary-500 font-medium"
            >
              Browse Items
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-500 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/claims"
                  className="text-gray-700 hover:text-primary-500 font-medium"
                >
                  Claims
                </Link>
                <Link
                  to="/registered-items"
                  className="text-gray-700 hover:text-primary-500 font-medium"
                >
                  Vault
                </Link>
              </>
            )}
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100/50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all duration-300 placeholder:text-slate-400 font-medium"
              />
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
          </form>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/favorites" className="p-2 text-gray-600 hover:text-primary-500 transition-colors">
                  <HeartIcon className="h-6 w-6" />
                </Link>
                <Link to="/notifications" className="p-2 text-gray-600 hover:text-primary-500 transition-colors relative">
                  <BellIcon className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </Link>
                <Link to="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors">
                  <Avatar
                    src={user?.profile_picture}
                    name={user?.username || user?.email || 'User'}
                    size="sm"
                  />
                  <span className="font-medium">{user?.username}</span>
                </Link>
                <button
                  onClick={logout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-500 font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </form>
            <div className="flex flex-col space-y-2 mb-2">
              <Link to="/items" onClick={handleMobileMenuItemClick} className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded">
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span>Browse Items</span>
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/dashboard" onClick={handleMobileMenuItemClick} className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded">
                    <Bars3Icon className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/claims" onClick={handleMobileMenuItemClick} className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded">
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    <span>Claims</span>
                  </Link>
                </>
              )}
            </div>
            {isAuthenticated ? (
              <div className="flex flex-col space-y-2">
                <Link to="/favorites" onClick={handleMobileMenuItemClick} className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded">
                  <HeartIcon className="h-5 w-5" />
                  <span>Favorites</span>
                </Link>
                <Link to="/notifications" onClick={handleMobileMenuItemClick} className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded">
                  <BellIcon className="h-5 w-5" />
                  <span>Notifications</span>
                </Link>
                <Link to="/profile" onClick={handleMobileMenuItemClick} className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded">
                  <UserCircleIcon className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={logout}
                  className="btn-secondary text-sm text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/login" onClick={handleMobileMenuItemClick} className="btn-secondary text-center">
                  Login
                </Link>
                <Link to="/register" onClick={handleMobileMenuItemClick} className="btn-primary text-center">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

