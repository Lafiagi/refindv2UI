import { useEffect, useState } from 'react';
import { useItemsStore, type Item } from '../store/itemsStore';
import {
    PlusIcon,
    ExclamationTriangleIcon,
    ShieldCheckIcon,
    TagIcon,
    ShoppingBagIcon,
    CurrencyDollarIcon,
    CalendarIcon,
    PhotoIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function RegisteredItems() {
    const { registeredItems, fetchRegisteredItems, createRegisteredItem, reportRegisteredItemAsLost, fetchCategories, categories, isLoading } = useItemsStore();
    const [showAddModal, setShowAddModal] = useState(false);
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        serial_number: '',
        imei: '',
        purchase_date: '',
        purchase_location: '',
        value: '',
    });
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchRegisteredItems();
        fetchCategories();
    }, [fetchRegisteredItems, fetchCategories]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key as keyof typeof formData]) {
                data.append(key, formData[key as keyof typeof formData]);
            }
        });
        if (image) {
            data.append('primary_image', image);
        }

        try {
            await createRegisteredItem(data);
            toast.success('Item vaulted successfully!');
            setShowAddModal(false);
            fetchRegisteredItems();
            setFormData({
                title: '',
                description: '',
                category_id: '',
                serial_number: '',
                imei: '',
                purchase_date: '',
                purchase_location: '',
                value: '',
            });
            setImage(null);
            setPreviewUrl(null);
        } catch (error) {
            toast.error('Failed to register item.');
            console.error(error);
        }
    };

    const handleReportLost = async (item: Item) => {
        if (!confirm(`Are you sure you want to report "${item.title}" as lost? This will alert the community.`)) return;

        try {
            const today = new Date().toISOString().split('T')[0];
            const result = await reportRegisteredItemAsLost(item.id, { lost_date: today });
            toast.success('Item reported as lost!');
            navigate(`/items/lost/${result.lost_item_id}`);
        } catch (error) {
            toast.error('Failed to report item as lost.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                                <ShieldCheckIcon className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900">Vault</h1>
                        </div>
                        <p className="text-slate-500 max-w-xl">
                            Securely store details of your most valuable possessions. If anything goes missing, report it as lost in one click.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary flex items-center shadow-indigo-200 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add to Vault
                    </button>
                </div>

                {/* List */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 bg-white rounded-3xl shadow-sm border border-slate-100 animate-pulse">
                                <div className="h-48 bg-slate-100 rounded-t-3xl"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-6 bg-slate-100 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : registeredItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheckIcon className="h-10 w-10 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Your Vault is Empty</h3>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            Protect your laptop, phone, bike, and other valuables by adding them to your vault today.
                        </p>
                        <button onClick={() => setShowAddModal(true)} className="btn-secondary">
                            Register your first item
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {registeredItems.map(item => (
                            <div key={item.id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden group transition-all duration-300 flex flex-col">
                                <div className="h-56 bg-slate-100 relative overflow-hidden">
                                    {item.primary_image ? (
                                        <img src={item.primary_image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                                            <PhotoIcon className="h-12 w-12 mb-2 opacity-50" />
                                            <span className="text-sm font-medium">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm text-indigo-600">
                                        {item.category?.name}
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                                    <p className="text-slate-500 text-sm line-clamp-2 mb-6">{item.description}</p>

                                    <div className="space-y-3 mb-6 bg-slate-50 rounded-xl p-4 border border-slate-100/50">
                                        {(item.serial_number || item.imei) && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500 flex items-center gap-2">
                                                    <TagIcon className="h-4 w-4" /> ID/Serial
                                                </span>
                                                <span className="font-mono font-medium text-slate-700">{item.serial_number || item.imei}</span>
                                            </div>
                                        )}
                                        {item.value && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500 flex items-center gap-2">
                                                    <CurrencyDollarIcon className="h-4 w-4" /> Value
                                                </span>
                                                <span className="font-medium text-slate-700">${item.value}</span>
                                            </div>
                                        )}
                                        {item.purchase_date && (
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-500 flex items-center gap-2">
                                                    <CalendarIcon className="h-4 w-4" /> Purchased
                                                </span>
                                                <span className="font-medium text-slate-700">{item.purchase_date}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-auto">
                                        <button
                                            onClick={() => handleReportLost(item)}
                                            className="w-full btn-secondary bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:border-red-200 group-hover:shadow-red-100 transition-all flex justify-center items-center gap-2"
                                        >
                                            <ExclamationTriangleIcon className="h-5 w-5" />
                                            Report as Lost
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 scrollbar-hide">
                            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-slate-100 flex justify-between items-center z-10">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Add to Vault</h2>
                                    <p className="text-slate-500 text-sm">Secure details for your item</p>
                                </div>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                                >
                                    <XMarkIcon className="h-6 w-6 text-slate-500" />
                                </button>
                            </div>

                            <div className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Image Upload Area */}
                                    <div className="flex justify-center">
                                        <div className="relative group w-full max-w-md h-64 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition-all cursor-pointer overflow-hidden">
                                            <input
                                                type="file"
                                                onChange={handleImageChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                accept="image/*"
                                            />
                                            {previewUrl ? (
                                                <div className="relative w-full h-full">
                                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-4" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white font-medium flex items-center gap-2">
                                                            <PhotoIcon className="h-5 w-5" /> Change Photo
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center p-6">
                                                    <div className="w-16 h-16 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                        <PhotoIcon className="h-8 w-8" />
                                                    </div>
                                                    <p className="text-slate-700 font-medium">Upload Item Photo</p>
                                                    <p className="text-slate-400 text-sm mt-1">Click or drag and drop</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Item Name</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="input-field"
                                                placeholder="e.g. MacBook Pro M2"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                                            <select
                                                name="category_id"
                                                value={formData.category_id}
                                                onChange={handleInputChange}
                                                className="input-field appearance-none"
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Value ($)</label>
                                            <input
                                                type="number"
                                                name="value"
                                                value={formData.value}
                                                onChange={handleInputChange}
                                                className="input-field"
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                className="input-field min-h-[100px]"
                                                placeholder="Distinctive features, color, scratches..."
                                                rows={3}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Serial Number</label>
                                            <input
                                                type="text"
                                                name="serial_number"
                                                value={formData.serial_number}
                                                onChange={handleInputChange}
                                                className="input-field"
                                                placeholder="S/N"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">IMEI (Optional)</label>
                                            <input
                                                type="text"
                                                name="imei"
                                                value={formData.imei}
                                                onChange={handleInputChange}
                                                className="input-field"
                                                placeholder="IMEI"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Purchase Date</label>
                                            <input
                                                type="date"
                                                name="purchase_date"
                                                value={formData.purchase_date}
                                                onChange={handleInputChange}
                                                className="input-field"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Purchase Location</label>
                                            <input
                                                type="text"
                                                name="purchase_location"
                                                value={formData.purchase_location}
                                                onChange={handleInputChange}
                                                className="input-field"
                                                placeholder="Store or City"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                        <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn-primary px-8">
                                            Save to Vault
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
