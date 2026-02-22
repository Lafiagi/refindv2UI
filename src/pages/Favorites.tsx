import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import type { Item } from '../store/itemsStore';
import ItemCard from '../components/Items/ItemCard';
import { HeartIcon } from '@heroicons/react/24/solid';

export default function Favorites() {
  // const { user, isAuthenticated } = useAuthStore();
  const { isAuthenticated } = useAuthStore();
  const [likedItems, setLikedItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLikedItems();
    }
  }, [isAuthenticated]);

  const fetchLikedItems = async () => {
    try {
      setIsLoading(true);
      // Fetch lost items - the serializer includes is_liked field
      const lostResponse = await api.get('/items/lost-items/', {
        params: { page_size: 100 }
      });
      const lostItems = (lostResponse.data.results || lostResponse.data)
        .filter((item: Item) => item.is_liked)
        .map((item: Item) => ({ ...item, _type: 'lost' }));

      // Fetch found items - the serializer includes is_liked field
      const foundResponse = await api.get('/items/found-items/', {
        params: { page_size: 100 }
      });
      const foundItems = (foundResponse.data.results || foundResponse.data)
        .filter((item: Item) => item.is_liked)
        .map((item: Item) => ({ ...item, _type: 'found' }));

      // Combine all liked items
      setLikedItems([...lostItems, ...foundItems]);
    } catch (error) {
      console.error('Failed to fetch liked items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your favorites.</p>
          <Link to="/login" className="btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <HeartIcon className="h-8 w-8 text-primary-600" />
            <h1 className="text-4xl font-bold text-gray-900">My Favorites</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Items you've liked and want to keep track of
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : likedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {likedItems.map((item) => {
              const type = (item as any)._type || 'lost';
              return (
                <ItemCard key={item.id} item={item} type={type as 'lost' | 'found'} />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <HeartIcon className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              Start exploring items and like the ones you're interested in!
            </p>
            <Link to="/items" className="btn-primary">
              Browse Items
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

