import React, { useState, useEffect } from 'react';
import { Leaf, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on window resize to large screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // Close mobile menu when scrolling to section
    closeMobileMenu();
    
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } else {
      // We're on home page, scroll directly
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section - Left Side */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="bg-green-600 p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CleanKili</h1>
              <p className="text-sm text-green-600 hidden sm:block">Community Environmental Reporting</p>
            </div>
          </Link>
          
          {/* Desktop Navigation - Right Side */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/#hero">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-green-600"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('hero');
                }}
              >
                Home
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="ghost" className="text-gray-700 hover:text-green-600">
                How It Works
              </Button>
            </Link>
            <Link to="/#report">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-green-600"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('report');
                }}
              >
                Report Issue
              </Button>
            </Link>
            <Link to="/reports">
              <Button variant="ghost" className="text-gray-700 hover:text-green-600">
                View Reports
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" className="text-gray-700 hover:text-green-600">
                About
              </Button>
            </Link>
            <Link to="/#contact">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-green-600"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contact');
                }}
              >
                Contact
              </Button>
            </Link>

          </nav>
          
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            className="lg:hidden text-gray-700 hover:text-green-600"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? 
              <X className="h-5 w-5" /> : 
              <Menu className="h-5 w-5" />
            }
          </Button>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <nav className="px-4 py-4 space-y-2">
              <Link to="/#hero" onClick={(e) => {
                e.preventDefault();
                scrollToSection('hero');
              }}>
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-green-600">
                  Home
                </Button>
              </Link>
              
              <Link to="/how-it-works" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-green-600">
                  How It Works
                </Button>
              </Link>
              
              <Link to="/#report" onClick={(e) => {
                e.preventDefault();
                scrollToSection('report');
              }}>
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-green-600">
                  Report Issue
                </Button>
              </Link>
              
              <Link to="/reports" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-green-600">
                  View Reports
                </Button>
              </Link>
              
              <Link to="/about" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-green-600">
                  About
                </Button>
              </Link>
              
              <Link to="/#contact" onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}>
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-green-600">
                  Contact
                </Button>
              </Link>
              
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
