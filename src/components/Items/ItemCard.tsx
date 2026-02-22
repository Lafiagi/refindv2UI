import { Link } from 'react-router-dom';
import { HeartIcon, EyeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useItemsStore } from '../../store/itemsStore';
import type { Item } from '../../store/itemsStore';
import { useState } from 'react';
import ZoomableImage from '../Images/ZoomableImage';
import { buildCloudinaryUrl, imagePresets } from '../../utils/cloudinary';

interface ItemCardProps {
  item: Item;
  type: 'lost' | 'found';
}

export default function ItemCard({ item, type }: ItemCardProps) {
  const { likeItem } = useItemsStore();
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await likeItem(item.id, type);
    } catch (error) {
      console.error('Failed to like item:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // The ZoomableImage component will handle the zoom functionality
  };

  return (
    <Link to={`/items/${type}/${item.id}`} className="card hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        {item.primary_image ? (
          <div onClick={handleImageClick}>
            <ZoomableImage
              src={item.primary_image}
              alt={item.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
              transformations={imagePresets.itemCard}
              zoomTransformations={imagePresets.zoomable}
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
        {item.is_priority && (
          <span className="absolute top-2 right-2 bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Priority
          </span>
        )}
        <button
          onClick={handleLike}
          className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          disabled={isLiking}
        >
          {item.is_liked ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>
      
      <div>
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span className="truncate">{item.city || item.lost_found_location}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-gray-500">
            <span className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              {item.views_count}
            </span>
            <span className="flex items-center">
              <HeartIcon className="h-4 w-4 mr-1" />
              {item.likes_count}
            </span>
          </div>
          {item.reward_offered && parseFloat(item.reward_offered) > 0 && (
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Reward</span>
              <span className="text-primary-600 font-bold text-lg">
                ${parseFloat(item.reward_offered).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

