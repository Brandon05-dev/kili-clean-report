import React from 'react';
import { Users, Target, Heart, Mail, CheckCircle, MapPin, Shield } from 'lucide-react';

const AboutUs = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">About CleanKili</h2>
          <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
        </div>

        {/* Mission Statement */}
        <div className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Our Mission</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              CleanKili is a simple, community-powered digital platform that makes it easy for residents, 
              businesses, and visitors in Kilimani to report illegal dumping, littering, and blocked drains — 
              and helps waste teams and the County respond quickly and efficiently.
            </p>
          </div>
        </div>

        {/* Why It Matters */}
        <div className="mb-16 bg-gray-50 rounded-2xl p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Why It Matters</h3>
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              In Kilimani, illegal dumping and poor waste disposal are major problems. Overflowing garbage, 
              blocked drains, and careless littering make streets unsafe and unattractive. They can cause 
              floods during rain, spread disease, and lower the quality of life for everyone. CleanKili 
              fixes this by giving everyone an easy way to report problems instantly — and by giving the 
              County the data it needs to act fast.
            </p>
          </div>
        </div>

        {/* Community Image Placeholder */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-8 text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <MapPin className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Kilimani Community</h4>
              <p className="text-gray-600">
                Together we're building a cleaner, safer neighborhood for everyone
              </p>
            </div>
          </div>
        </div>

        {/* Who We Work With */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Who We Work With</h3>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              We partner with local waste collection companies, the County government, community groups, 
              landlords, and residents to keep Kilimani clean, healthy, and safe for all.
            </p>
          </div>

          {/* Partner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">County Government</h4>
              <p className="text-sm text-gray-600">Official waste management policies</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm-4 4h8a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Waste Collection</h4>
              <p className="text-sm text-gray-600">Local cleanup companies</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Community Groups</h4>
              <p className="text-sm text-gray-600">Local organizations and residents</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Property Owners</h4>
              <p className="text-sm text-gray-600">Landlords and businesses</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 lg:p-12 text-white text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">Join the Movement</h3>
          <p className="text-xl mb-6 opacity-90 max-w-3xl mx-auto">
            Together, small actions add up. Join us — report it, fix it, enjoy a cleaner Kilimani.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Start Reporting Issues
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Learn How It Works
            </button>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">Our Impact So Far</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">247+</div>
              <div className="text-gray-600">Issues Reported</div>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">89%</div>
              <div className="text-gray-600">Resolution Rate</div>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-10 w-10 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">1,200+</div>
              <div className="text-gray-600">Community Members</div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center bg-gray-50 rounded-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Get In Touch</h3>
          <p className="text-gray-600 mb-6">
            Have questions or want to partner with us? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="mailto:info@cleankili.org" 
              className="inline-flex items-center bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <Mail className="h-5 w-5 mr-2" />
              info@cleankili.org
            </a>
            <span className="text-gray-500">or</span>
            <a 
              href="tel:+254-700-25326" 
              className="inline-flex items-center border border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +254-700-CLEAN
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
