import { useNavigate } from 'react-router-dom';
import { Wrench, Coins, Gem, Gavel } from 'lucide-react';

const services = [
  {
    id: 'gold-repair',
    title: 'Gold Repair',
    description: 'Expert restoration for your precious pieces',
    icon: Wrench,
    path: '/customer/gold-repair',
    gradient: 'from-gold-100 to-gold-50',
  },
  {
    id: 'pawn',
    title: 'Pawn',
    description: 'Secure loans against your gold assets',
    icon: Coins,
    path: '/customer/pawn',
    gradient: 'from-amber-100 to-amber-50',
  },
  {
    id: 'sell-jewellery',
    title: 'Sell Jewellery',
    description: 'Get the best value for your jewellery',
    icon: Gem,
    path: '/customer/sell-jewellery',
    gradient: 'from-yellow-100 to-yellow-50',
  },
  {
    id: 'gold-auction',
    title: 'Gold Auction',
    description: 'Bid on exclusive collections',
    icon: Gavel,
    path: '/customer/gold-auction',
    gradient: 'from-gold-200 to-gold-100',
  },
];

const PremiumServicesSection = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-ivory to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6">
          <p className="text-gold-dark text-xs font-sans uppercase tracking-[0.25em] mb-2">
            Our Services
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-2">
            Premium <span className="text-gold italic">Services</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-gold mx-auto"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => navigate(service.path)}
                className="group relative bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2"
                style={{
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-gold-dark/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Top Border Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                {/* Card Content */}
                <div className="relative px-6 py-5 text-center">
                  {/* Icon Container */}
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon className="w-6 h-6 text-gold-dark group-hover:text-gold transition-colors duration-300" strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-serif font-bold text-charcoal mb-2 group-hover:text-gold-dark transition-colors duration-300">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 font-sans leading-relaxed mb-3">
                    {service.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center justify-center gap-2 text-gold-dark group-hover:gap-3 transition-all duration-300">
                    <span className="text-xs font-sans uppercase tracking-widest font-semibold">
                      Explore
                    </span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>

                {/* Bottom Shadow Effect */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PremiumServicesSection;
