
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
        <div className="flex justify-between items-center h-16">
          {/* Logo - Far Left */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black">CleanKili</h1>
              <p className="text-xs text-green-600 hidden sm:block font-medium">Community Environmental Reporting</p>
            </div>
          </Link>
          
          {/* Navigation Links - Far Right */}
          <div className="flex items-center space-x-1">
            {/* Main Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex items-center space-x-1 mr-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-green-700 hover:text-black hover:bg-green-50 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                onClick={() => scrollToSection('hero')}
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
