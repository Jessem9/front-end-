import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navbar on login and register pages
  if (location.pathname === "/connexion" || location.pathname === "/inscription") {
    return null;
  }

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    setIsAuthenticated(!!token);
    setUserId(storedUserId); // Get the user ID from localStorage
  }, [location]); // Update when route changes

  const handleLogout = () => {
    // Remove user-related data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    
    // Set authentication status to false
    setIsAuthenticated(false);

    // Redirect to homepage
    navigate("/");
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white shadow-md border-b border-[#09403A]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-[#09403A] font-bold text-2xl">ServPro</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/categories" className="text-[#09403A] hover:text-[#0A554D] px-3 py-2 text-sm font-medium transition-colors">Catégories</Link>
              <Link to="/prestataires" className="text-[#09403A] hover:text-[#0A554D] px-3 py-2 text-sm font-medium transition-colors">Prestataires</Link>
              <Link to="/services" className="text-[#09403A] hover:text-[#0A554D] px-3 py-2 text-sm font-medium transition-colors">Services</Link>
            </div>
          </div>

          {/* Right-side buttons */}
          <div className="flex items-center">
            {!isAuthenticated ? (
              <>
                <Link to="/connexion">
                  <Button variant="outline" className="mr-2 hidden md:block border-[#09403A] text-[#09403A] hover:bg-[#09403A]/10">
                    Connexion
                  </Button>
                </Link>
                <Link to="/inscription">
                  <Button className="bg-[#09403A] hover:bg-[#0A554D] hidden md:block text-white">
                    Inscription
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={`/profil/${userId}`}>
                  <Button variant="ghost" className="flex items-center hover:bg-[#09403A]/10">
                    <User className="h-5 w-5 text-[#09403A]" />
                  </Button>
                </Link>
                <Button onClick={handleLogout} className="bg-[#09403A] hover:bg-[#0A554D] text-white hidden md:block">
                  Déconnexion
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center hover:bg-[#09403A]/10">
                <Menu className="h-6 w-6 text-[#09403A]" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/categories" className="block px-3 py-2 text-base font-medium text-[#09403A] hover:bg-[#09403A]/10">Catégories</Link>
            <Link to="/prestataires" className="block px-3 py-2 text-base font-medium text-[#09403A] hover:bg-[#09403A]/10">Prestataires</Link>
            <Link to="/services" className="block px-3 py-2 text-base font-medium text-[#09403A] hover:bg-[#09403A]/10">Services</Link>
            <div className="px-3 py-2 space-y-1">
              {!isAuthenticated ? (
                <>
                  <Link to="/connexion">
                    <Button variant="outline" className="w-full mb-2 border-[#09403A] text-[#09403A] hover:bg-[#09403A]/10">
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/inscription">
                    <Button className="w-full bg-[#09403A] hover:bg-[#0A554D] text-white">
                      Inscription
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to={`/profile`}>
                    <Button variant="ghost" className="w-full flex items-center hover:bg-[#09403A]/10">
                      <User className="h-5 w-5 text-[#09403A]" />
                      Mon Profil
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} className="w-full bg-[#09403A] hover:bg-[#0A554D] text-white">
                    Déconnexion
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
