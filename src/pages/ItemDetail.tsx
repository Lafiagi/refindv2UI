import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useItemsStore } from '../store/itemsStore';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import Avatar from '../components/Avatar';
import ZoomableImage from '../components/Images/ZoomableImage';
import { imagePresets } from '../utils/cloudinary';
import {
  MapPinIcon,
  CalendarIcon,
  TagIcon,
  ShareIcon,
  FlagIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    lostItems,
    foundItems,
    fetchLostItems,
    fetchFoundItems,
    createClaim,
    likeItem,
    isLoading
  } = useItemsStore();
  const { user, isAuthenticated } = useAuthStore();
  const { createConversation } = useChatStore();

  const [item, setItem] = useState<any>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');

  // Find item in state
  useEffect(() => {
    // Try to find in loaded items, otherwise fetch
    const foundLost = lostItems.find(i => i.id === Number(id));
    const foundFound = foundItems.find(i => i.id === Number(id));

    if (foundLost) {
      setItem({ ...foundLost, type: 'lost' });
    } else if (foundFound) {
      setItem({ ...foundFound, type: 'found' });
    } else {
      // In a real app we would fetch single item API here
      fetchLostItems();
      fetchFoundItems();
    }
  }, [id, lostItems, foundItems, fetchLostItems, fetchFoundItems]);

  const images = item?.images || (item?.primary_image ? [{ image: item.primary_image }] : []);

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    try {
      const formData = new FormData();
      if (item.type === 'lost') {
        formData.append('lost_item_id', item.id);
      } else {
        formData.append('found_item_id', item.id);
      }
      formData.append('message', claimMessage);

      await createClaim(formData);
      toast.success('Claim submitted successfully!');
      setShowClaimModal(false);
      setClaimMessage('');
    } catch (error) {
      toast.error('Failed to submit claim.');
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like items');
      return;
    }
    if (item) {
      try {
        await likeItem(item.id, item.type);
        // Optimistic update
        setItem(prev => ({
          ...prev,
          is_liked: !prev.is_liked,
          likes_count: prev.is_liked ? prev.likes_count - 1 : prev.likes_count + 1
        }));
      } catch (error) {
        toast.error('Failed to like item');
      }
    }
  };

  const handleMessagePoster = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to send messages');
      return;
    }
    
    if (!item.user?.id) {
      toast.error('Unable to find poster information');
      return;
    }
    
    try {
      const conversation = await createConversation(
        item.user.id,
        `Hi, I'm interested in your ${item.type} item: ${item.title}`,
        item.id,
        item.type
      );
      navigate(`/messages?conversation=${conversation.id}`);
    } catch (error) {
      toast.error('Failed to start conversation');
    }
  };

  if (isLoading || !item) {
    return (
      <div className="min-h-screen pt-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-[500px] bg-slate-100 rounded-3xl animate-pulse"></div>
          <div className="space-y-6">
            <div className="h-12 bg-slate-100 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-slate-100 rounded w-1/2 animate-pulse"></div>
            <div className="h-32 bg-slate-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Breadcrumb / Top Bar */}
      <div className="border-b border-slate-100 bg-white sticky top-0 z-30 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-sm breadcrumbs text-slate-500">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to={`/items?type=${item.type}`} className="hover:text-orange-600 capitalize">{item.type} Items</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900 font-medium truncate max-w-[200px]">{item.title}</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50">
              <ShareIcon className="h-5 w-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-slate-50">
              <FlagIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 space-y-4">
              {/* Main Image */}
              <div className="bg-slate-50 rounded-3xl overflow-hidden shadow-sm border border-slate-100 aspect-[4/3] relative group">
                {images.length > 0 ? (
                  <ZoomableImage
                    src={images[activeImageIndex].image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    transformations={imagePresets.itemDetail}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    No image available
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${item.type === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                    }`}>
                    {item.type === 'lost' ? 'Lost' : 'Found'}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-orange-500 ring-2 ring-orange-200' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                    >
                      <img src={img.image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Map Placeholder */}
              {(item.latitude && item.longitude) || item.city ? (
                <div className="bg-slate-50 rounded-3xl p-1 shadow-inner h-64 relative overflow-hidden group">
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
                    <MapPinIcon className="h-10 w-10 text-slate-400" />
                    <span className="ml-2 text-slate-500 font-medium">Map View</span>
                  </div>
                  {/* Real map implementation would go here */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-sm font-semibold shadow-sm">
                    {item.city || item.address || 'Location provided'}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{item.title}</h1>
                  <div className="flex items-center text-slate-500 text-sm">
                    <CalendarIcon className="h-4 w-4 mr-1.5" />
                    Posted {new Date(item.created_at).toLocaleDateString()}
                    <span className="mx-2">•</span>
                    <MapPinIcon className="h-4 w-4 mr-1.5" />
                    {item.city || item.lost_found_location || 'Location unknown'}
                  </div>
                </div>
                <button
                  onClick={handleLike}
                  className={`p-3 rounded-full transition-colors ${item.is_liked ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                >
                  <HeartIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-8 flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Avatar
                  src={item.user?.profile_picture}
                  name={item.user?.username}
                  size="md"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    Posted by <span className="font-bold">{item.user?.username}</span>
                  </p>
                  <div className="flex items-center text-xs text-slate-500 mt-0.5">
                    <CheckBadgeIcon className="h-3.5 w-3.5 text-blue-500 mr-1" /> Verified User
                  </div>
                </div>
                {user?.id !== item.user?.id && (
                  <Link 
                    to={`/profile/${item.user?.username}`}
                    className="btn-secondary px-4 py-2 text-sm h-auto"
                  >
                    View Profile
                  </Link>
                )}
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Description</h3>
              <p className="text-slate-600 leading-relaxed text-base">
                {item.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Category</p>
                <div className="flex items-center font-semibold text-slate-900">
                  <TagIcon className="h-4 w-4 mr-2 text-orange-500" />
                  {item.category?.name || 'Uncategorized'}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Date {item.type === 'lost' ? 'Lost' : 'Found'}</p>
                <div className="flex items-center font-semibold text-slate-900">
                  <CalendarIcon className="h-4 w-4 mr-2 text-orange-500" />
                  {new Date(item.lost_found_date).toLocaleDateString()}
                </div>
              </div>
              {item.reward_offered && (
                <div className="col-span-2 p-4 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-1">Reward Offered</p>
                    <p className="text-xl font-bold text-green-700">${item.reward_offered}</p>
                  </div>
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">💰</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Interested in this item?</h3>
              {user?.id === item.user?.id ? (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <p className="text-sm text-slate-600">This is your item</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setShowClaimModal(true)}
                    className="btn-primary w-full py-4 text-lg shadow-orange-200"
                  >
                    <ShieldCheckIcon className="h-6 w-6 mr-2" />
                    {item.type === 'lost' ? 'I Found This!' : 'This looks like mine!'}
                  </button>
                  <button 
                    onClick={handleMessagePoster}
                    className="btn-secondary w-full py-3"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                    Message Poster
                  </button>
                </div>
              )}
              <p className="text-xs text-center text-slate-400 mt-4">
                Always meet in a safe, public place. Refind verifies items but user safety is priority.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-bold mb-2">Submit a Claim</h3>
            <p className="text-slate-500 mb-6">
              Tell the user why you believe this item matches yours. Be specific about identifying marks.
            </p>
            <form onSubmit={handleClaimSubmit}>
              <textarea
                value={claimMessage}
                onChange={(e) => setClaimMessage(e.target.value)}
                className="input-field min-h-[120px] mb-6"
                placeholder="Describe verification details..."
                required
              ></textarea>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowClaimModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Send Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
