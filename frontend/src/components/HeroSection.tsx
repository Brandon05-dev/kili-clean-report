
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
      className="relative bg-cover bg-center bg-no-repeat py-12 sm:py-20 2xl:py-24 3xl:py-32 4xl:py-40 5xl:py-48" 
      style={{backgroundImage: `url(${BgImage})`}}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="relative max-w-7xl 2xl:max-w-8xl 3xl:max-w-[90rem] 4xl:max-w-[110rem] 5xl:max-w-[140rem] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 3xl:px-20 4xl:px-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl 5xl:text-[10rem] font-bold text-white mb-6 2xl:mb-8 3xl:mb-10 4xl:mb-12">
            Keep Kilimani{' '}
            <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
              Clean
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl 5xl:text-5xl text-gray-200 mb-8 2xl:mb-12 3xl:mb-16 4xl:mb-20 max-w-3xl 2xl:max-w-4xl 3xl:max-w-5xl 4xl:max-w-6xl 5xl:max-w-7xl mx-auto leading-relaxed">
            Report illegal dumping, blocked drains, and littered areas in your community. 
            Together, we can make Kilimani cleaner and healthier for everyone.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 2xl:gap-6 3xl:gap-8 4xl:gap-10 justify-center mb-12 2xl:mb-16 3xl:mb-20 4xl:mb-24">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 2xl:px-10 2xl:py-5 3xl:px-12 3xl:py-6 4xl:px-14 4xl:py-7 5xl:px-16 5xl:py-8 text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl font-semibold rounded-xl 2xl:rounded-2xl 3xl:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-green"
              onClick={() => scrollToSection('report')}
            >
              <Camera className="mr-3 h-6 w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 4xl:h-10 4xl:w-10 5xl:h-12 5xl:w-12" />
              Report Now
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-green-500 text-green-700 hover:bg-green-50 hover:text-black px-8 py-4 2xl:px-10 2xl:py-5 3xl:px-12 3xl:py-6 4xl:px-14 4xl:py-7 5xl:px-16 5xl:py-8 text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl font-semibold rounded-xl 2xl:rounded-2xl 3xl:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => scrollToSection('map')}
            >
              <MapPin className="mr-3 h-6 w-6 2xl:h-7 2xl:w-7 3xl:h-8 3xl:w-8 4xl:h-10 4xl:w-10 5xl:h-12 5xl:w-12" />
              View Community Map
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 2xl:gap-12 3xl:gap-16 4xl:gap-20 max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl 4xl:max-w-7xl 5xl:max-w-8xl mx-auto">
            <div className="text-center">
              <div className="bg-white p-6 2xl:p-8 3xl:p-10 4xl:p-12 5xl:p-16 rounded-2xl 2xl:rounded-3xl 3xl:rounded-4xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:bg-green-50 group">
                <Camera className="h-12 w-12 2xl:h-14 2xl:w-14 3xl:h-16 3xl:w-16 4xl:h-20 4xl:w-20 5xl:h-24 5xl:w-24 text-green-600 mx-auto mb-4 2xl:mb-5 3xl:mb-6 4xl:mb-7 group-hover:text-green-700" />
                <h3 className="font-semibold text-black mb-2 2xl:mb-3 text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl">Take Photo</h3>
                <p className="text-black text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl font-medium">Snap a quick photo of the waste or blocked drain</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-6 2xl:p-8 3xl:p-10 4xl:p-12 5xl:p-16 rounded-2xl 2xl:rounded-3xl 3xl:rounded-4xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:bg-green-50 group">
                <MapPin className="h-12 w-12 2xl:h-14 2xl:w-14 3xl:h-16 3xl:w-16 4xl:h-20 4xl:w-20 5xl:h-24 5xl:w-24 text-green-600 mx-auto mb-4 2xl:mb-5 3xl:mb-6 4xl:mb-7 group-hover:text-green-700" />
                <h3 className="font-semibold text-black mb-2 2xl:mb-3 text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl">Drop Pin</h3>
                <p className="text-black text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl font-medium">Mark the exact location on the map</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-6 2xl:p-8 3xl:p-10 4xl:p-12 5xl:p-16 rounded-2xl 2xl:rounded-3xl 3xl:rounded-4xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:bg-green-50 group">
                <CheckCircle className="h-12 w-12 2xl:h-14 2xl:w-14 3xl:h-16 3xl:w-16 4xl:h-20 4xl:w-20 5xl:h-24 5xl:w-24 text-green-600 mx-auto mb-4 2xl:mb-5 3xl:mb-6 4xl:mb-7 group-hover:text-green-700" />
                <h3 className="font-semibold text-black mb-2 2xl:mb-3 text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl">Track Progress</h3>
                <p className="text-black text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl font-medium">See when your report gets addressed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
