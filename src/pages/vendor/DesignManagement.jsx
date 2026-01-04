import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useStoreStore } from '../../store/storeStore';
import { useDesignStore } from '../../store/designStore';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

const DesignManagement = () => {
    const { user } = useAuthStore();
    const { getStoresByVendor } = useStoreStore();
    const { designs, addDesign, updateDesign, deleteDesign, toggleAvailability } = useDesignStore();
    const [vendorStores, setVendorStores] = useState([]);
    const [vendorDesigns, setVendorDesigns] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingDesign, setEditingDesign] = useState(null);
    const [filterStore, setFilterStore] = useState('all');
    const [formData, setFormData] = useState({
        storeId: '',
        name: '',
        description: '',
        category: 'necklace',
        material: '',
        weight: '',
        price: '',
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800']
    });

    useEffect(() => {
        if (user) {
            const stores = getStoresByVendor(user.id);
            setVendorStores(stores);

            const storeIds = stores.map(s => s.id);
            const filteredDesigns = designs.filter(d => storeIds.includes(d.storeId));
            setVendorDesigns(filteredDesigns);
        }
    }, [user, designs]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const designData = {
            ...formData,
            price: parseFloat(formData.price) || 0
        };

        if (editingDesign) {
            updateDesign(editingDesign.id, designData);
        } else {
            addDesign(designData);
        }

        // Reset form
        setShowForm(false);
        setEditingDesign(null);
        setFormData({
            storeId: '',
            name: '',
            description: '',
            category: 'necklace',
            material: '',
            weight: '',
            price: '',
            images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800']
        });
    };

    const handleEdit = (design) => {
        setEditingDesign(design);
        setFormData({
            storeId: design.storeId,
            name: design.name,
            description: design.description,
            category: design.category,
            material: design.material,
            weight: design.weight || '',
            price: design.price?.toString() || '',
            images: design.images
        });
        setShowForm(true);
    };

    const handleDelete = (designId) => {
        if (window.confirm('Are you sure you want to delete this design?')) {
            deleteDesign(designId);
        }
    };

    const handleToggle = (designId) => {
        toggleAvailability(designId);
    };

    const filteredDesigns = filterStore === 'all'
        ? vendorDesigns
        : vendorDesigns.filter(d => d.storeId === filterStore);

    return (
        <div className="min-h-screen bg-cream py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-gold/20 pb-6">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">My Collections</h1>
                        <p className="text-gray-500 font-sans tracking-wide uppercase text-sm">Curate your exquisite masterpieces</p>
                    </div>
                    {!showForm && vendorStores.length > 0 && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-4 md:mt-0 flex items-center justify-center gap-2 bg-black text-white font-serif tracking-wider py-3 px-8 hover:bg-gold hover:text-black transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Add New Masterpiece
                        </button>
                    )}
                </div>

                {/* Filter by Store */}
                {vendorStores.length > 0 && !showForm && (
                    <div className="mb-8 flex justify-end">
                        <select
                            value={filterStore}
                            onChange={(e) => setFilterStore(e.target.value)}
                            className="px-6 py-3 border border-gray-200 bg-white font-serif text-gray-700 outline-none focus:border-gold hover:border-gold/50 cursor-pointer shadow-sm min-w-[200px]"
                        >
                            <option value="all">View All Collections</option>
                            {vendorStores.map(store => (
                                <option key={store.id} value={store.id}>{store.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="bg-white p-8 border border-gray-100 shadow-lg mb-12 animate-fadeIn relative">
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setEditingDesign(null);
                            }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                        >
                            <Trash2 className="w-5 h-5 rotate-45" />
                        </button>

                        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8 border-b border-gray-100 pb-2">
                            {editingDesign ? 'Refine Masterpiece' : 'New Masterpiece'}
                        </h2>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Select Boutique *</label>
                                <select
                                    name="storeId"
                                    value={formData.storeId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white focus:ring-0 outline-none transition-all font-sans"
                                    required
                                >
                                    <option value="">Select a boutique...</option>
                                    {vendorStores.map(store => (
                                        <option key={store.id} value={store.id}>{store.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Design Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white focus:ring-0 outline-none transition-all font-serif text-lg"
                                    placeholder="e.g. The Royal Kundan Set"
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
                                    placeholder="Describe the craftsmanship..."
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white focus:ring-0 outline-none transition-all font-sans capitalize"
                                    required
                                >
                                    {['necklace', 'rings', 'earrings', 'bangles', 'bracelets', 'bridal'].map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Material *</label>
                                <input
                                    type="text"
                                    name="material"
                                    value={formData.material}
                                    onChange={handleChange}
                                    placeholder="e.g., 22K Gold, Polki"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white focus:ring-0 outline-none transition-all font-sans"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Weight</label>
                                <input
                                    type="text"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    placeholder="e.g., 25g"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white focus:ring-0 outline-none transition-all font-sans"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Price Estimate (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white focus:ring-0 outline-none transition-all font-sans"
                                />
                            </div>

                            <div className="md:col-span-2 flex gap-4 mt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-black text-white font-serif tracking-widest uppercase py-4 hover:bg-gold hover:text-black transition-all duration-300"
                                >
                                    {editingDesign ? 'Update Masterpiece' : 'Add to Collection'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingDesign(null);
                                    }}
                                    className="px-8 border border-gray-300 text-gray-500 font-serif tracking-widest uppercase py-4 hover:border-black hover:text-black transition-all duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Designs Grid */}
                {vendorStores.length === 0 ? (
                    <EmptyState
                        type="store"
                        title="No Boutiques Found"
                        message="Please register a boutique before showcasing your collection."
                        actionLabel="Go to Boutique Management"
                        onAction={() => window.location.href = '/vendor/stores'}
                    />
                ) : filteredDesigns.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredDesigns.map(design => {
                            const store = vendorStores.find(s => s.id === design.storeId);
                            const isAvailable = design.availability === 'available';

                            return (
                                <div key={design.id} className="group bg-white border border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col">
                                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 z-10" />
                                        <img src={design.images[0]} alt={design.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />

                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="px-2 py-1 bg-white/90 text-[10px] font-bold uppercase tracking-widest text-black/80">
                                                {design.category}
                                            </span>
                                        </div>

                                        {/* Status Tag */}
                                        <div className="absolute top-4 right-4 z-20">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggle(design.id);
                                                }}
                                                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm transition-all ${isAvailable
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-red-500 text-white'
                                                    }`}
                                            >
                                                {isAvailable ? 'Available' : 'Sold Out'}
                                            </button>
                                        </div>

                                        {/* Quick Actions Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(design)}
                                                className="flex-1 bg-white/90 hover:bg-white text-black py-2 text-xs font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
                                            >
                                                <Edit2 className="w-3 h-3" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(design.id)}
                                                className="flex-1 bg-white/90 hover:bg-red-50 text-red-600 py-2 text-xs font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
                                            >
                                                <Trash2 className="w-3 h-3" /> Del
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="mb-4">
                                            <h3 className="font-serif font-bold text-lg text-gray-900 mb-1 group-hover:text-gold transition-colors line-clamp-1">{design.name}</h3>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">{store?.name}</p>
                                            <div className="w-10 h-[1px] bg-gold/50 mb-3"></div>

                                            {design.price && (
                                                <p className="font-serif text-lg text-black">₹{design.price.toLocaleString('en-IN')}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    !showForm && (
                        <EmptyState
                            type="design"
                            title="Collection Empty"
                            message="Your collection awaits its first masterpiece."
                            actionLabel="Add First Design"
                            onAction={() => setShowForm(true)}
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default DesignManagement;
