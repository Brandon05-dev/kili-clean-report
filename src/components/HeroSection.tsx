
import React from 'react';
import { Camera, MapPin, CheckCircle, Leaf, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BgImage from './images/BG.jpg';

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative bg-cover bg-center bg-no-repeat py-12 sm:py-20" 
      style={{backgroundImage: `url(${BgImage})`}}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-float mb-8">
            <div className="bg-gradient-to-br from-green-400 to-green-600 w-20 h-20 rounded-2xl mx-auto flex items-center justify-center shadow-xl">
              <Leaf className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Keep Kilimani{' '}
            <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
              Clean
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Report illegal dumping, blocked drains, and littered areas in your community. 
            Together, we can make Kilimani cleaner and healthier for everyone.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-green"
              onClick={() => scrollToSection('report')}
            >
              <Camera className="mr-3 h-6 w-6" />
              Report Now
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-green-500 text-green-700 hover:bg-green-50 hover:text-black px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => scrollToSection('map')}
            >
              <MapPin className="mr-3 h-6 w-6" />
              View Community Map
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:bg-green-50 group">
                <Camera className="h-12 w-12 text-green-600 mx-auto mb-4 group-hover:text-green-700" />
                <h3 className="font-semibold text-black mb-2">Take Photo</h3>
                <p className="text-black text-sm font-medium">Snap a quick photo of the waste or blocked drain</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:bg-green-50 group">
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4 group-hover:text-green-700" />
                <h3 className="font-semibold text-black mb-2">Drop Pin</h3>
                <p className="text-black text-sm font-medium">Mark the exact location on the map</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:bg-green-50 group">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4 group-hover:text-green-700" />
                <h3 className="font-semibold text-black mb-2">Track Progress</h3>
                <p className="text-black text-sm font-medium">See when your report gets addressed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
