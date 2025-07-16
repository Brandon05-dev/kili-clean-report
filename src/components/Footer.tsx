
import React from 'react';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-green-800 to-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-xl">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">CleanKili</h3>
                <p className="text-green-200 text-sm">Clean Community Initiative</p>
              </div>
            </div>
            <p className="text-green-100 leading-relaxed">
              Empowering Kilimani residents to report and address environmental issues together. 
              Building a cleaner, healthier community for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Actions</h4>
            <ul className="space-y-2">
              <li>
                <a href="#report" className="text-green-200 hover:text-white transition-colors">
                  Report an Issue
                </a>
              </li>
              <li>
                <a href="#map" className="text-green-200 hover:text-white transition-colors">
                  View Community Map
                </a>
              </li>
              <li>
                <a href="#stats" className="text-green-200 hover:text-white transition-colors">
                  Community Impact
                </a>
              </li>
              <li>
                <a href="#help" className="text-green-200 hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-300" />
                <span className="text-green-200">hello@cleankili.co.ke</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-300" />
                <span className="text-green-200">+254 700 123 456</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-green-300" />
                <span className="text-green-200">Kilimani, Nairobi</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center">
          <p className="text-green-200">
            © 2024 CleanKili. Made with ❤️ for the Kilimani community.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
