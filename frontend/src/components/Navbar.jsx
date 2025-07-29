import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/provider/UserProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuth, logout } = useUser();

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const renderAuthButtons = () => {
    if (isAuth) {
      return (
        <>
          <Button asChild className="bg-medical-orange hover:bg-opacity-90">
            <Link to="/book-appointment">Book Appointment</Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar className="h-10 w-10 cursor-pointer">
                <AvatarFallback className="bg-medical-blue text-white">
                  {user?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/appointments" className="cursor-pointer">My Appointments</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    }

    return (
      <>
        <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
          Login
        </Link>
        <Link to="/register" className={`nav-link ${isActive('/register') ? 'active' : ''}`}>
          Register
        </Link>
        <Button asChild className="bg-medical-orange hover:bg-opacity-90">
          <Link to="/book-appointment">Book Appointment</Link>
        </Button>
      </>
    );
  };

  const renderMobileAuthButtons = () => {
    if (isAuth) {
      return (
        <>
          <Link
            to="/profile"
            className={`nav-link py-2 px-3 rounded ${isActive('/profile') ? 'bg-gray-100 active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
          </Link>
          <Link
            to="/appointments"
            className={`nav-link py-2 px-3 rounded ${isActive('/appointments') ? 'bg-gray-100 active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            My Appointments
          </Link>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </>
      );
    }

    return (
      <>
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
      </>
    );
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
            <span className="text-xl font-bold text-medical-blue">Health Sphere</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
              About
            </Link>

            {renderAuthButtons()}


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

              <Button
                asChild
                className="bg-medical-orange hover:bg-opacity-90 w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/book-appointment">Book Appointment</Link>
              </Button>
              {renderMobileAuthButtons()}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
