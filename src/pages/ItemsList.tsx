import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useItemsStore } from '../store/itemsStore';
import ItemCard from '../components/Items/ItemCard';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function ItemsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get('type') || 'lost';
  const {
    lostItems,
    foundItems,
    categories,
    fetchLostItems,
    fetchFoundItems,
    fetchCategories,
    isLoading
  } = useItemsStore();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    status: searchParams.get('status') || '',
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const params: any = { page_size: 20 };

    if (searchQuery) params.search = searchQuery;
    if (localFilters.category) params.category = localFilters.category;
    if (localFilters.city) params.city = localFilters.city;
    if (localFilters.status) params.status = localFilters.status;

    if (type === 'lost') {
      fetchLostItems(params);
    } else {
      fetchFoundItems(params);
    }
  }, [type, searchQuery, localFilters, fetchLostItems, fetchFoundItems]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      newParams.set('q', searchQuery);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);

    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setLocalFilters({ category: '', city: '', status: '' });
    setSearchQuery('');
    setSearchParams({ type });
  };

  const items = type === 'lost' ? lostItems : foundItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4 animate-fade-in-up">
            {type === 'lost' ? 'Lost Something?' : 'Found Items'}
          </h1>
          <p className="text-xl text-slate-500 mb-8">
            {type === 'lost'
              ? 'Search our database of found items to see if yours has been recovered.'
              : 'Browse items reported found by our community.'}
          </p>

          {/* Tabs */}
          <div className="inline-flex p-1.5 bg-white rounded-2xl shadow-sm border border-slate-200">
            <Link
              to="/items?type=lost"
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${type === 'lost'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              Lost Items
            </Link>
            <Link
              to="/items?type=found"
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${type === 'found'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              Found Items
            </Link>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Items</p>
            <p className="text-3xl font-extrabold text-slate-900">{items.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active</p>
            <p className="text-3xl font-extrabold text-orange-500">{items.filter(i => i.status === 'active').length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recovered</p>
            <p className="text-3xl font-extrabold text-green-500">{items.filter(i => i.status === 'recovered').length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">New This Week</p>
            <p className="text-3xl font-extrabold text-indigo-500">
              {items.filter(i => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(i.created_at) > weekAgo;
              }).length}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <form onSubmit={handleSearch} className="flex space-x-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, description, location..."
                className="input-field pl-12 h-12 shadow-md border-gray-200 focus:border-primary-400"
              />
            </div>
            <button type="submit" className="btn-primary h-12 px-8 shadow-md">
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary h-12 px-6 shadow-md ${showFilters ? 'bg-primary-100 text-primary-700 border-primary-300' : ''
                }`}
            >
              <FunnelIcon className="h-5 w-5 inline mr-2" />
              Filters
              {(localFilters.category || localFilters.city || localFilters.status) && (
                <span className="ml-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                  {[localFilters.category, localFilters.city, localFilters.status].filter(Boolean).length}
                </span>
              )}
            </button>
          </form>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filter Options</h3>
                {(localFilters.category || localFilters.city || localFilters.status) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="filter-category" className="block text-sm font-semibold text-gray-700 mb-2">
                    📁 Category
                  </label>
                  <select
                    id="filter-category"
                    value={localFilters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📍 City
                  </label>
                  <input
                    type="text"
                    value={localFilters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    placeholder="e.g., New York"
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="filter-status" className="block text-sm font-semibold text-gray-700 mb-2">
                    🔄 Status
                  </label>
                  <select
                    id="filter-status"
                    value={localFilters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="input-field"
                  >
                    <option value="">All Status</option>
                    <option value="active">🟢 Active</option>
                    <option value="matched">🟡 Matched</option>
                    <option value="recovered">✅ Recovered</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Found {items.length} {items.length === 1 ? 'item' : 'items'}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} type={type as 'lost' | 'found'} />
              ))}
            </div>
          </>
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No items found</p>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
            <Link to={type === 'lost' ? '/items/report/lost' : '/items/report/found'} className="btn-primary">
              Report {type === 'lost' ? 'Lost' : 'Found'} Item
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

