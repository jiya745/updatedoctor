
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-medical-blue flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-xl font-bold text-medical-blue">AI Doctor</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
              About
            </Link>
            <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
              Login
            </Link>
            <Link to="/register" className={`nav-link ${isActive('/register') ? 'active' : ''}`}>
              Register
            </Link>
            <Button asChild className="bg-medical-orange hover:bg-opacity-90">
              <Link to="/book-appointment">Book Appointment</Link>
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden p-2">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mt-4 md:hidden transition-all duration-300 ease-in-out">
            <div className="flex flex-col space-y-4 pb-4">
              <Link 
                to="/" 
                className={`nav-link py-2 px-3 rounded ${isActive('/') ? 'bg-gray-100 active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about"
                className={`nav-link py-2 px-3 rounded ${isActive('/about') ? 'bg-gray-100 active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/login"
                className={`nav-link py-2 px-3 rounded ${isActive('/login') ? 'bg-gray-100 active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register"
                className={`nav-link py-2 px-3 rounded ${isActive('/register') ? 'bg-gray-100 active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
              <Button 
                asChild 
                className="bg-medical-orange hover:bg-opacity-90 w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/book-appointment">Book Appointment</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
