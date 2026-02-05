import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-auto border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 border border-gold rounded-full flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <span className="text-xl font-serif font-bold text-white tracking-widest">
                LUXE <span className="text-gold">GEMS</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 font-sans leading-relaxed">
              Curating the world's finest jewelry collections. Experience elegance, craftsmanship,
              and timeless beauty.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold font-serif text-lg mb-6 tracking-wider">Explore</h3>
            <ul className="space-y-3 text-sm font-sans tracking-wide">
              <li>
                <Link
                  to="/customer/home"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/customer/stores"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h3 className="text-gold font-serif text-lg mb-6 tracking-wider">For Boutiques</h3>
            <ul className="space-y-3 text-sm font-sans tracking-wide">
              <li>
                <Link
                  to="/vendor/dashboard"
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Partner Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  Apply for Membership
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                  Privileges
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold font-serif text-lg mb-6 tracking-wider">Concierge</h3>
            <ul className="space-y-4 text-sm font-sans">
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4 text-gold" />
                concierge@luxegems.com
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4 text-gold" />
                +91 1800 123 4567
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-4 h-4 text-gold" />
                Mumbai, India
              </li>
            </ul>
            {/* Social Media */}
            <div className="flex gap-4 mt-4">
              <a
                href="#"
                className="text-gray-400 hover:text-gold transition duration-300 transform hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gold transition duration-300 transform hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gold transition duration-300 transform hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 mt-6 pt-4 text-center text-xs text-gray-600 font-sans tracking-widest uppercase">
          <p>&copy; {new Date().getFullYear()} Luxe Gems. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
