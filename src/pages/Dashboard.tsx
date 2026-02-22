import { useEffect } from 'react';
import { useItemsStore } from '../store/itemsStore';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { Link } from 'react-router-dom';
import {
  PlusCircleIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
  BellIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="card border-none shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-100 rounded-bl-full opacity-50 transition-transform group-hover:scale-110`}></div>
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center mb-4 text-${color}-600`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
      {trend && (
        <p className="text-xs font-medium text-green-600 mt-2 flex items-center">
          <span className="bg-green-100 px-1.5 py-0.5 rounded text-green-700 mr-2">+{trend}%</span>
          vs last month
        </p>
      )}
    </div>
  </div>
);

const ActivityItem = ({ icon: Icon, title, time, type }: any) => (
  <div className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-50 last:border-0">
    <div className={`p-2 rounded-lg ${type === 'alert' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 mt-1">{time}</p>
    </div>
    <Link to="/notifications" className="text-xs font-semibold text-orange-600 hover:text-orange-700">View</Link>
  </div>
);

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const { myLostItems, myFoundItems, fetchMyLostItems, fetchMyFoundItems, isLoading } = useItemsStore();
  const { notifications, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    fetchMyLostItems();
    fetchMyFoundItems();
    fetchNotifications();
  }, [fetchMyLostItems, fetchMyFoundItems, fetchNotifications]);

  const activeReports = myLostItems.filter(i => i.status === 'active').length;
  const foundReports = myFoundItems.length;
  const recoveredItems = myLostItems.filter(i => i.status === 'recovered').length;

  return (
    <div className="min-h-screen py-8 lg:py-12 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back, <span className="text-orange-500">{user?.username}</span> 👋
            </h1>
            <p className="text-slate-500 mt-2">Here's what's happening with your items today.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/items/report/lost" className="btn-primary shadow-orange-200">
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Report Lost
            </Link>
            <Link to="/registered-items" className="btn-secondary">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Vault
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Active Lost Reports"
            value={activeReports}
            icon={MagnifyingGlassIcon}
            color="orange"
            trend={12}
          />
          <StatCard
            title="Items Found by You"
            value={foundReports}
            icon={CheckCircleIcon}
            color="blue"
            trend={5}
          />
          <StatCard
            title="Recovered Items"
            value={recoveredItems}
            icon={ArchiveBoxIcon}
            color="green"
            trend={8}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Lost Items */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Your Lost Reports</h2>
                <Link to="/my-lost-items" className="text-sm font-semibold text-orange-600 hover:text-orange-700">View All</Link>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : myLostItems.length > 0 ? (
                <div className="space-y-4">
                  {myLostItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all duration-200 bg-white group">
                      <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                        {item.primary_image ? (
                          <img src={item.primary_image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ArchiveBoxIcon className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 py-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{item.title}</h3>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${item.status === 'active' ? 'bg-orange-100 text-orange-700' :
                              item.status === 'recovered' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">{item.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs font-medium text-slate-400">
                          <span className="flex items-center gap-1"><ClockIcon className="h-3.5 w-3.5" /> {new Date(item.created_at).toLocaleDateString()}</span>
                          {item.city && <span>• {item.city}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <MagnifyingGlassIcon className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">No items reported lost yet.</p>
                  <Link to="/items/report/lost" className="text-orange-600 font-bold text-sm mt-2 block hover:underline">Report an item</Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/items/report/found" className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-2xl transition-colors border border-white/10 text-center group">
                    <CheckCircleIcon className="h-8 w-8 mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold">Found Item</span>
                  </Link>
                  <Link to="/registered-items" className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 rounded-2xl transition-colors border border-white/10 text-center group">
                    <ShieldCheckIcon className="h-8 w-8 mx-auto mb-2 text-green-400 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold">Vault</span>
                  </Link>
                </div>
              </div>
              {/* Decor */}
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl"></div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                <BellIcon className="h-5 w-5 text-slate-400" />
              </div>
              <div className="space-y-1">
                {notifications.slice(0, 3).length > 0 ? (
                  notifications.slice(0, 3).map((notification) => (
                    <ActivityItem 
                      key={notification.id}
                      icon={notification.type === 'item_match' ? MagnifyingGlassIcon : notification.type === 'claim_update' ? CheckCircleIcon : ShieldCheckIcon}
                      title={notification.title}
                      time={formatTimeAgo(notification.created_at)}
                      type={notification.type === 'item_match' ? 'alert' : 'update'}
                    />
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-slate-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
