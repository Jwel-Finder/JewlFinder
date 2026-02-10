import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreStore } from '../../store/storeStore';
import { useDesignStore } from '../../store/designStore';
import { MapPin, Search, TrendingUp, Layers } from 'lucide-react';
import StoreCard from '../../components/common/StoreCard';
import CategoryCard from '../../components/common/CategoryCard';
import DesignCard from '../../components/common/DesignCard';
import EmptyState from '../../components/common/EmptyState';
import { searchStores, filterStoresByCity, filterStoresByPincode } from '../../utils/filters';

const CustomerHome = () => {
  const navigate = useNavigate();
  const { stores } = useStoreStore();
  const { designs } = useDesignStore();
  const [location, setLocation] = useState({ city: '', pincode: '' });
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Filter stores based on location and search
    let result = stores.filter((store) => store.status === 'approved' && store.isOpen);

    if (location.city) {
      result = filterStoresByCity(result, location.city);
    }

    if (location.pincode) {
      result = filterStoresByPincode(result, location.pincode);
    }

    if (searchQuery) {
      result = searchStores(result, searchQuery);
    }

    setFilteredStores(result);
  }, [stores, location, searchQuery]);

  const handleLocationSearch = (e) => {
    e.preventDefault();
    // Location is already being filtered in useEffect
  };

  const popularCities = ['Mumbai', 'Bangalore', 'Delhi'];

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="relative bg-black text-white py-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-gold opacity-20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-2 tracking-tight">
            Timeless <span className="text-gold italic">Elegance</span>
          </h1>
          <p className="text-base md:text-lg text-gray-300 font-sans font-light tracking-wide mb-3 max-w-2xl mx-auto leading-snug">
            Discover extraordinary collections from the world's most exclusive boutiques.
          </p>

          {/* Location Search */}
          <div className="max-w-3xl mx-auto glass-effect rounded-none p-0.5 shadow">
            <form
              onSubmit={handleLocationSearch}
              className="flex flex-col md:flex-row gap-0.5 bg-white p-0.5"
            >
              <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-100">
                <input
                  type="text"
                  value={location.city}
                  onChange={(e) => setLocation({ ...location, city: e.target.value })}
                  placeholder="City (e.g., Mumbai)"
                  className="w-full px-6 py-2 outline-none font-sans text-gray-800 placeholder-gray-400"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={location.pincode}
                  onChange={(e) => setLocation({ ...location, pincode: e.target.value })}
                  placeholder="Pincode"
                  className="w-full px-6 py-2 outline-none font-sans text-gray-800 placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 font-sans uppercase tracking-widest text-sm hover:bg-gold hover:text-black transition duration-300"
              >
                Discover
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Featured Cities - Quick Filter */}
      <div className="bg-ivory py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gold-dark text-xs font-sans uppercase tracking-widest mb-4">
            Popular Destinations
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Mumbai', 'Delhi', 'Bangalore', 'Jaipur', 'Chennai', 'Hyderabad'].map((city) => (
              <button
                key={city}
                onClick={() => setLocation({ ...location, city: city })}
                className={`px-4 py-2 rounded-full border transition-all duration-300 font-serif ${
                  location.city.toLowerCase() === city.toLowerCase()
                    ? 'bg-gold text-white border-gold shadow-md'
                    : 'bg-white text-gray-600 border-gold/20 hover:border-gold hover:text-gold-dark'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight">
            Curated Collections
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {useMemo(() => {
            const uniqueCategories = [...new Set(designs.map((d) => d.category))];
            return uniqueCategories.map((category) => {
              const firstDesign = designs.find((d) => d.category === category);
              return (
                <CategoryCard key={category} category={category} image={firstDesign?.images[0]} />
              );
            });
          }, [designs])}
        </div>
      </div>
      {/* Trending Designs Section */}
      <div className="bg-ivory py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2 leading-tight">
                Trending Masterpieces
              </h2>
              <p className="text-sm text-gray-500 font-sans tracking-wide leading-snug">
                The most coveted pieces of the season
              </p>
            </div>
            <button
              onClick={() => navigate('/customer/designs')}
              className="text-gold-dark hover:text-black uppercase tracking-widest text-xs font-bold transition-colors"
            >
              View All Designs
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {designs.slice(0, 4).map((design) => (
              <DesignCard key={design.id} design={design} compact={true} />
            ))}
          </div>
        </div>
      </div>

      {/* Stores Section */}
      <div className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2 leading-tight">
                {location.city || location.pincode ? 'Boutiques Near You' : 'Featured Boutiques'}
              </h2>
              <p className="text-sm text-gray-500 font-sans tracking-wide leading-snug">
                Explore the finest jewelers in your area
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search boutiques..."
                className="w-full pl-10 pr-4 py-2 border-b border-gray-200 focus:border-gold outline-none font-sans text-sm bg-transparent transition-colors"
              />
            </div>
          </div>

          {/* Stores Grid */}
          {filteredStores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          ) : (
            <EmptyState
              type="store"
              title="No Boutiques Found"
              message={
                location.city || location.pincode
                  ? "We couldn't find any partner boutiques in this location at the moment."
                  : 'Enter your location to discover boutiques near you.'
              }
              actionLabel="Browse All Collections"
              onAction={() => navigate('/customer/stores')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
