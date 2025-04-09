
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Calendar, Users, User, Horse } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Calendar className="h-5 w-5" /> },
    { name: 'Pacientes', path: '/patients', icon: <Users className="h-5 w-5" /> },
    { name: 'Profesionales', path: '/professionals', icon: <User className="h-5 w-5" /> },
    { name: 'Caballos', path: '/horses', icon: <Horse className="h-5 w-5" /> },
    { name: 'Agenda', path: '/schedule', icon: <Calendar className="h-5 w-5" /> },
  ];

  return (
    <nav className="bg-equine-green-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Horse className="h-8 w-8" />
              <span className="text-xl font-bold">Centro de Equinoterapia</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center px-3 py-2 rounded-md hover:bg-equine-green-700 transition-colors"
              >
                <div className="mr-2">{item.icon}</div>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-equine-green-700 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-equine-green-600">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center px-3 py-2 rounded-md hover:bg-equine-green-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="mr-2">{item.icon}</div>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
