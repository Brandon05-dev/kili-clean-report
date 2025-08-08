
import React from 'react';
import { Users, Target, Heart, Mail, CheckCircle, MapPin, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutUs = () => {
  return (
  <section className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pb-24">
      {/* Hero Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-12 text-center">
  <div className="inline-block animate-float bg-gradient-to-r from-green-500 to-emerald-400 rounded-full p-2 shadow-lg mb-6">
          <Target className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow-lg">CleanKili</h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto mb-6 font-medium">
          Community-powered platform for a cleaner, safer Kilimani. Report waste, blocked drains, and litter — together, we make a difference.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          <Button size="lg" className="bg-primary text-white hover:bg-primary/90 shadow-md">Start Reporting</Button>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-emerald-50">Learn How It Works</Button>
        </div>
      </div>

      {/* Impact Cards */}
      <div className="relative z-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-t-4 border-green-500 animate-float">
          <CheckCircle className="h-10 w-10 text-green-600 mx-auto mb-2 animate-pulse-green" />
          <div className="text-3xl font-bold text-gray-900 mb-1">247+</div>
          <div className="text-gray-600">Issues Reported</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-t-4 border-emerald-400 animate-float animation-delay-2000">
          <Users className="h-10 w-10 text-emerald-500 mx-auto mb-2 animate-float" />
          <div className="text-3xl font-bold text-gray-900 mb-1">89%</div>
          <div className="text-gray-600">Resolution Rate</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-t-4 border-emerald-400 animate-float animation-delay-4000">
          <Heart className="h-10 w-10 text-emerald-500 mx-auto mb-2 animate-float" />
          <div className="text-3xl font-bold text-gray-900 mb-1">1,200+</div>
          <div className="text-gray-600">Community Members</div>
        </div>
      </div>

      {/* Mission & Why Section */}
      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mb-20 px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center border-l-4 border-green-500">
          <Shield className="h-8 w-8 text-green-600 mb-4 animate-float" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Why It Matters</h2>
          <p className="text-gray-700">
            Overflowing garbage, blocked drains, and careless littering make Kilimani unsafe and unattractive. CleanKili empowers everyone to report issues instantly and gives the County the data to act fast.
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl shadow-md p-8 flex flex-col items-center text-center border-l-4 border-emerald-400">
          <MapPin className="h-10 w-10 text-green-600 mb-4 animate-pulse-green" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Mission</h2>
          <p className="text-gray-700">
            Make it easy for residents, businesses, and visitors to report waste problems — and help waste teams and the County respond quickly and efficiently.
          </p>
        </div>
      </div>

      {/* Partners Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 mb-20">
        <div className="text-center mb-10">
          <Users className="h-8 w-8 text-emerald-500 mx-auto mb-2 animate-float" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Who We Work With</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            We partner with local waste collection companies, the County government, community groups, landlords, and residents to keep Kilimani clean, healthy, and safe for all.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border-t-4 border-green-500">
            <Shield className="w-7 h-7 text-green-600 mb-2" />
            <div className="font-semibold text-gray-900">County Government</div>
            <div className="text-xs text-gray-500">Official waste management</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border-t-4 border-emerald-400">
            <svg className="w-7 h-7 text-emerald-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm-4 4h8a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            <div className="font-semibold text-gray-900">Waste Collection</div>
            <div className="text-xs text-gray-500">Cleanup companies</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border-t-4 border-emerald-400">
            <Users className="w-7 h-7 text-emerald-500 mb-2" />
            <div className="font-semibold text-gray-900">Community Groups</div>
            <div className="text-xs text-gray-500">Organizations & residents</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border-t-4 border-yellow-400">
            <svg className="w-7 h-7 text-yellow-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            <div className="font-semibold text-gray-900">Property Owners</div>
            <div className="text-xs text-gray-500">Landlords & businesses</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 mb-20">
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-10 text-white text-center shadow-lg">
          <Heart className="h-10 w-10 text-white mx-auto mb-4 animate-pulse-green" />
          <h2 className="text-3xl font-bold mb-2">Join the Movement</h2>
          <p className="text-lg mb-6 opacity-90">
            Small actions add up. Join us — report it, fix it, enjoy a cleaner Kilimani.
          </p>
          <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-bold shadow-md">Start Reporting</Button>
        </div>
      </div>

      {/* Contact Section */}
      <div className="relative z-10 max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 text-center border-t-4 border-green-500">
          <Mail className="h-8 w-8 text-green-600 mx-auto mb-4 animate-float" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Get In Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions or want to partner with us? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="mailto:info@cleankili.org" 
              className="inline-flex items-center bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <Mail className="h-5 w-5 mr-2" />
              info@cleankili.org
            </a>
            <span className="text-gray-400">or</span>
            <a 
              href="tel:+254-700-25326" 
              className="inline-flex items-center border border-primary text-primary hover:bg-green-50 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +254-700-CLEAN
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Blobs */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 rounded-full opacity-30 blur-2xl animate-blob animation-delay-1000" />
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full opacity-20 blur-2xl animate-blob animation-delay-4000" />
    </section>
  );
};

export default AboutUs;
