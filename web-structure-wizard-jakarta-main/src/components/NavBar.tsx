import { Link, useLocation } from "react-router-dom";
import { Menu, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Hide navbar on login and register pages
  if (location.pathname === "/connexion" || location.pathname === "/inscription") {
    return null;
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-blue-600 font-bold text-2xl">ServPro</span>
            </Link>

            {/* Navigation sur desktop */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link 
                to="/categories" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Catégories
              </Link>
              <Link 
                to="/prestataires" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Prestataires
              </Link>
              <Link 
                to="/services" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Services
              </Link>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="w-full flex">
              <Input
                type="text"
                placeholder="Rechercher un service..."
                className="w-full rounded-l-md"
              />
              <Button 
                variant="default" 
                className="rounded-l-none bg-blue-600 hover:bg-blue-700"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Boutons de droite */}
          <div className="flex items-center">
            <Link to="/connexion">
              <Button variant="outline" className="mr-2 hidden md:block">
                Connexion
              </Button>
            </Link>
            <Link to="/inscription">
              <Button className="bg-blue-600 hover:bg-blue-700 hidden md:block">
                Inscription
              </Button>
            </Link>

            {/* Menu profil */}
            <div className="ml-3 relative">
              <div>
                <Button variant="ghost" className="flex items-center">
                  <User className="h-5 w-5 text-gray-600" />
                </Button>
              </div>
            </div>

            {/* Menu mobile */}
            <div className="flex items-center md:hidden">
              <Button 
                variant="ghost" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu mobile ouvert */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/categories" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Catégories
            </Link>
            <Link 
              to="/prestataires" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Prestataires
            </Link>
            <Link 
              to="/services" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Services
            </Link>
            <div className="px-3 py-2 flex">
              <Input
                type="text"
                placeholder="Rechercher un service..."
                className="w-full rounded-l-md"
              />
              <Button 
                variant="default" 
                className="rounded-l-none bg-blue-600 hover:bg-blue-700"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="px-3 py-2 space-y-1">
              <Link to="/connexion">
                <Button variant="outline" className="w-full mb-2">
                  Connexion
                </Button>
              </Link>
              <Link to="/inscription">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Inscription
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}