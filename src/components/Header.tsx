
import React from 'react';
import { Leaf, Menu, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-xl shadow-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CleanKili</h1>
              <p className="text-xs text-green-600 hidden sm:block">Community Environmental Reporting</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800 hover:bg-green-50">
                <Settings className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800 hover:bg-green-50">
              English
            </Button>
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
