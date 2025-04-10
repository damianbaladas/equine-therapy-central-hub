import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { usePathname } from '@/hooks/use-pathname';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react";

import { Home, Users, CalendarDays, Calendar as CalendarIcon, HorseSaddle, Clock } from 'lucide-react';

interface NavItemProps {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Inicio', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Pacientes', path: '/patients', icon: <Users className="h-5 w-5" /> },
    { name: 'Profesionales', path: '/professionals', icon: <Users className="h-5 w-5" /> },
    { name: 'Caballos', path: '/horses', icon: <HorseSaddle className="h-5 w-5" /> },
    { name: 'Agenda', path: '/schedule', icon: <CalendarDays className="h-5 w-5" /> },
    { name: 'Control de Horas', path: '/professional-hours', icon: <Clock className="h-5 w-5" /> },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-equine-green-700 font-bold text-xl">Equine Therapy</Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      pathname === item.path
                        ? 'bg-gray-100 text-equine-green-600'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-equine-green-600',
                      'group flex items-center px-3 py-2 rounded-md text-sm font-medium'
                    )}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleMenu}>
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:w-64 p-0">
                <SheetHeader className="pl-6 pr-8 pt-6 pb-4">
                  <SheetTitle>Equine Therapy</SheetTitle>
                  <SheetDescription>
                    Navega a través de las diferentes secciones.
                  </SheetDescription>
                </SheetHeader>
                <div className="divide-y divide-gray-200">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        pathname === item.path
                          ? 'bg-gray-100 text-equine-green-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-equine-green-600',
                        'flex items-center px-6 py-3 text-sm font-medium'
                      )}
                      onClick={closeMenu}
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
