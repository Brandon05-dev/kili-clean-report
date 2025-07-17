
import React from 'react';
import { Leaf, Menu, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Header = () => {
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
    <header className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo - Far Left */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black flex items-baseline">
                <span>Cle</span>
                {/* Location Pin "a" */}
                <span className="relative inline-block mx-0.5 transform hover:scale-125 transition-transform duration-300 cursor-pointer">
                  <svg className="w-4 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </span>
                <span>nK</span>
                {/* Overflowing Bin "i" */}
                <span className="relative inline-block mx-0.5 transform hover:scale-125 transition-transform duration-300 cursor-pointer">
                  <svg className="w-3 h-5 text-black mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                    {/* Bin base */}
                    <path d="M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2h5v2h-1l-.86 12.14c-.05.71-.62 1.26-1.33 1.26H5.19c-.71 0-1.28-.55-1.33-1.26L3 8H2V6h6zm2-2v2h4V4h-4z"/>
                    {/* Overflow trash */}
                    <circle cx="7" cy="4" r="1.5" fill="currentColor" opacity="0.3"/>
                    <circle cx="17" cy="5" r="1" fill="currentColor" opacity="0.4"/>
                    <circle cx="19" cy="7" r="0.8" fill="currentColor" opacity="0.2"/>
                    <circle cx="6" cy="8" r="1.2" fill="currentColor" opacity="0.3"/>
                  </svg>
                  {/* Graffiti dot for i */}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full shadow-sm"></div>
                </span>
                <span className="text-black font-bold">l</span>
                <span className="text-black font-bold">i</span>
              </h1>
              <p className="text-xs text-green-600 hidden sm:block font-medium">Community Environmental Reporting</p>
            </div>
          </Link>
          
          {/* Spacer to push navigation to far right */}
          <div className="flex-1"></div>
          
          {/* Navigation Links - Far Right */}
          <div className="flex items-center space-x-1">
            {/* Main Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex items-center space-x-1 mr-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-green-700 hover:text-black hover:bg-green-50 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                onClick={() => scrollToSection('how-it-works')}
              >
                How it Works
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-green-700 hover:text-black hover:bg-green-50 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                onClick={() => scrollToSection('report')}
              >
                Report
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-green-700 hover:text-black hover:bg-green-50 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                onClick={() => scrollToSection('map')}
              >
                Map
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-green-700 hover:text-black hover:bg-green-50 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                onClick={() => scrollToSection('stats')}
              >
                Stats
              </Button>
            </nav>

            {/* Secondary Actions */}
            <div className="flex items-center space-x-2">
              <Link to="/dashboard">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-green-700 hover:text-black hover:bg-green-50 px-3 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="border-green-200 text-green-700 hover:bg-green-50 hover:text-black px-3 py-2 rounded-lg font-medium transition-all duration-200 hidden sm:flex"
              >
                English
              </Button>
              
              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden text-green-700 hover:text-black hover:bg-green-50 p-2 rounded-lg transition-all duration-200"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
