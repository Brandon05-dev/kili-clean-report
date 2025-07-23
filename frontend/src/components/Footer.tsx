
import React from 'react';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-green-800 to-green-900 text-white">
      <div className="max-w-7xl 2xl:max-w-8xl 3xl:max-w-[90rem] 4xl:max-w-[110rem] 5xl:max-w-[140rem] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 3xl:px-20 py-12 2xl:py-16 3xl:py-20 4xl:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 2xl:gap-12 3xl:gap-16 4xl:gap-20">
          {/* Brand Section */}
          <div className="space-y-4 2xl:space-y-6 3xl:space-y-8">
            <div className="flex items-center space-x-3 2xl:space-x-4 3xl:space-x-5">
              <div className="bg-white p-2 2xl:p-3 3xl:p-4 rounded-xl 2xl:rounded-2xl">
                <Leaf className="h-6 w-6 2xl:h-8 2xl:w-8 3xl:h-10 3xl:w-10 4xl:h-12 4xl:w-12 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl font-bold">CleanKili</h3>
                <p className="text-green-200 text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl">Clean Community Initiative</p>
              </div>
            </div>
            <p className="text-green-100 2xl:text-lg 3xl:text-xl 4xl:text-2xl leading-relaxed">
              Empowering Kilimani residents to report and address environmental issues together. 
              Building a cleaner, healthier community for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 2xl:space-y-6 3xl:space-y-8">
            <h4 className="text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl font-semibold">Quick Actions</h4>
            <ul className="space-y-2 2xl:space-y-3 3xl:space-y-4">
              <li>
                <a href="#report" className="text-green-200 hover:text-white transition-colors 2xl:text-lg 3xl:text-xl 4xl:text-2xl">
                  Report an Issue
                </a>
              </li>
              <li>
                <a href="#map" className="text-green-200 hover:text-white transition-colors 2xl:text-lg 3xl:text-xl 4xl:text-2xl">
                  View Community Map
                </a>
              </li>
              <li>
                <a href="#stats" className="text-green-200 hover:text-white transition-colors 2xl:text-lg 3xl:text-xl 4xl:text-2xl">
                  Community Impact
                </a>
              </li>
              <li>
                <a href="#help" className="text-green-200 hover:text-white transition-colors 2xl:text-lg 3xl:text-xl 4xl:text-2xl">
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
            © 2025.CleanKili community. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
