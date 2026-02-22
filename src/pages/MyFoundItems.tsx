import { useEffect } from 'react';
import { useItemsStore } from '../store/itemsStore';
import ItemCard from '../components/Items/ItemCard';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function MyFoundItems() {
  const { myFoundItems, fetchMyFoundItems, isLoading } = useItemsStore();

  useEffect(() => {
    fetchMyFoundItems();
  }, [fetchMyFoundItems]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Found Items</h1>
          <p className="text-gray-600">Items you've found and reported</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : myFoundItems.length === 0 ? (
          <div className="text-center py-16">
            <MapPinIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No found items yet</h3>
            <p className="text-gray-500 mb-6">You haven't reported any found items yet. Help others by reporting items you've found.</p>
            <Link to="/report-found-item" className="btn-primary">
              Report Found Item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myFoundItems.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item} 
                type="found" 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}