

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-green-900 to-emerald-800 text-white border-t border-green-800 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand Section */}
          <div className="space-y-3 flex flex-col items-start justify-center">
            <div className="flex items-center space-x-4">
              <img src="/green-city-icon.svg" alt="CleanKili Logo" className="h-12 w-12 rounded-xl shadow-lg bg-white p-1" />
              <div>
                <h3 className="text-2xl font-bold tracking-tight">CleanKili</h3>
                <p className="text-green-200 text-sm font-medium">Clean Community Initiative</p>
              </div>
            </div>
            <p className="text-green-100 text-base leading-relaxed max-w-xs">
              Empowering Kilimani residents to report and address environmental issues together. Building a cleaner, healthier community for everyone.
            </p>
          </div>

          {/* Quick Actions - Vertical, No Icons */}
          <div className="flex flex-col items-start justify-center w-full">
            <h4 className="text-lg font-semibold mb-4">Quick Actions</h4>
            <nav className="w-full">
              <ul className="flex flex-col gap-2 w-full">
                <li>
                  <Link to="/" className="text-green-200 hover:text-white font-medium transition-colors py-2 px-3 rounded hover:bg-green-800 block">Home</Link>
                </li>
                <li>
                  <Link to="/about" className="text-green-200 hover:text-white font-medium transition-colors py-2 px-3 rounded hover:bg-green-800 block">About</Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="text-green-200 hover:text-white font-medium transition-colors py-2 px-3 rounded hover:bg-green-800 block">How It Works</Link>
                </li>
                <li>
                  <a href="#report" className="text-green-200 hover:text-white font-medium transition-colors py-2 px-3 rounded hover:bg-green-800 block">Report an Issue</a>
                </li>
                <li>
                  <Link to="/reports" className="text-green-200 hover:text-white font-medium transition-colors py-2 px-3 rounded hover:bg-green-800 block">View Reports</Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 flex flex-col items-start justify-center">
            <h4 className="text-lg font-semibold mb-2">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-300" />
                <a href="mailto:hello@cleankili.co.ke" className="text-green-200 hover:text-white transition-colors">info@cleankili.com</a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-300" />
                <a href="tel:+254700123456" className="text-green-200 hover:text-white transition-colors">+254 790 889 066</a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-green-300" />
                <span className="text-green-200">Kilimani, Nairobi</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 mt-6 pt-4 text-center">
          <p className="text-green-200 text-sm">
            © 2025 CleanKili community. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
