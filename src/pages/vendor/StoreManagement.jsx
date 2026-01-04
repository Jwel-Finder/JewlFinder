import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useStoreStore } from '../../store/storeStore';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Store } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

const StoreManagement = () => {
    const { user } = useAuthStore();
    const { getStoresByVendor, addStore, updateStore, deleteStore, toggleStoreStatus } = useStoreStore();
    const [stores, setStores] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingStore, setEditingStore] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        hours: 'Mon-Sat: 10:00 AM - 8:00 PM',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'
    });

    useEffect(() => {
        if (user) {
            const vendorStores = getStoresByVendor(user.id);
            setStores(vendorStores);
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingStore) {
            updateStore(editingStore.id, formData);
        } else {
            addStore({ ...formData, vendorId: user.id });
        }

        // Refresh stores
        const vendorStores = getStoresByVendor(user.id);
        setStores(vendorStores);

        // Reset form
        setShowForm(false);
        setEditingStore(null);
        setFormData({
            name: '',
            description: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            phone: '',
            hours: 'Mon-Sat: 10:00 AM - 8:00 PM',
            image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'
        });
    };

    const handleEdit = (store) => {
        setEditingStore(store);
        setFormData({
            name: store.name,
            description: store.description,
            address: store.address,
            city: store.city,
            state: store.state,
            pincode: store.pincode,
            phone: store.phone,
            hours: store.hours,
            image: store.image
        });
        setShowForm(true);
    };

    const handleDelete = (storeId) => {
        if (window.confirm('Are you sure you want to delete this store?')) {
            deleteStore(storeId);
            const vendorStores = getStoresByVendor(user.id);
            setStores(vendorStores);
        }
    };

    const handleToggleStatus = (storeId) => {
        toggleStoreStatus(storeId);
        const vendorStores = getStoresByVendor(user.id);
        setStores(vendorStores);
    };

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-gold/20 pb-6">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">My Boutique</h1>
                        <p className="text-gray-500 font-sans tracking-wide uppercase text-sm">Manage your store details & locations</p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-4 md:mt-0 flex items-center justify-center gap-2 bg-black text-white font-serif tracking-wider py-3 px-8 hover:bg-gold hover:text-black transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Launch New Store
                        </button>
                    )}
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="bg-white p-8 border border-gray-100 shadow-lg mb-12 animate-fadeIn relative">
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setEditingStore(null);
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                        >
                            <Trash2 className="w-5 h-5 rotate-45" />
                        </button>

                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8 border-b border-gray-100 pb-2">
                            {editingStore ? 'Edit Boutique Details' : 'New Boutique Registration'}
                        </h2>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Store Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white focus:ring-0 outline-none transition-all font-serif text-lg"
                                    placeholder="e.g. Royal Gems & Co."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Contact Phone *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white focus:ring-0 outline-none transition-all font-sans"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white focus:ring-0 outline-none transition-all resize-none font-sans"
                                    placeholder="Tell the story of your boutique..."
                                    required
                                ></textarea>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Street Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white focus:ring-0 outline-none transition-all font-sans"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white focus:ring-0 outline-none transition-all font-sans"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">State *</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white focus:ring-0 outline-none transition-all font-sans"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Pincode *</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white focus:ring-0 outline-none transition-all font-sans"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Operating Hours</label>
                                <input
                                    type="text"
                                    name="hours"
                                    value={formData.hours}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white focus:ring-0 outline-none transition-all font-sans"
                                />
                            </div>

                            <div className="md:col-span-2 flex gap-4 mt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-black text-white font-serif tracking-widest uppercase py-4 hover:bg-gold hover:text-black transition-all duration-300"
                                >
                                    {editingStore ? 'Update Details' : 'Register Store'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingStore(null);
                                    }}
                                    className="px-8 border border-gray-300 text-gray-500 font-serif tracking-widest uppercase py-4 hover:border-black hover:text-black transition-all duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Stores List */}
                {stores.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stores.map(store => (
                            <div key={store.id} className="bg-white group hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
                                <div className="relative h-48 overflow-hidden">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                                    <img src={store.image} alt={store.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                                        <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold bg-white/90 backdrop-blur-sm shadow-sm ${store.status === 'approved' ? 'text-green-700' : 'text-yellow-600'
                                            }`}>
                                            {store.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2 group-hover:text-gold transition-colors">{store.name}</h3>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="w-8 h-[1px] bg-gold"></span>
                                            {store.city}, {store.state}
                                        </p>
                                        <p className="text-gray-600 font-sans text-sm leading-relaxed line-clamp-3">{store.description}</p>
                                    </div>

                                    <div className="mt-auto space-y-4">
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</span>
                                            <button
                                                onClick={() => handleToggleStatus(store.id)}
                                                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${store.isOpen ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                                    }`}
                                            >
                                                {store.isOpen ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                                {store.isOpen ? 'Open' : 'Closed'}
                                            </button>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={() => handleEdit(store)}
                                                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-3 hover:border-black hover:text-black hover:bg-gray-50 transition-all uppercase text-xs font-bold tracking-wider"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(store.id)}
                                                className="flex-1 flex items-center justify-center gap-2 border border-red-100 text-red-400 py-3 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all uppercase text-xs font-bold tracking-wider"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !showForm && (
                        <EmptyState
                            type="store"
                            title="No Boutiques Listed"
                            message="Start your journey by adding your first jewelry boutique to the Luxe Gems marketplace."
                            actionLabel="Register First Boutique"
                            onAction={() => setShowForm(true)}
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default StoreManagement;
