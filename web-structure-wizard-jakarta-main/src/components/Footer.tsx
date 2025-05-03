
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ServPro</h3>
            <p className="text-gray-600 text-sm">
              La plateforme qui met en relation prestataires de services et demandeurs.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/categories" className="hover:text-blue-600">
                  Toutes les catégories
                </Link>
              </li>
              <li>
                <Link to="/prestataires" className="hover:text-blue-600">
                  Trouver un prestataire
                </Link>
              </li>
              <li>
                <Link to="/devenir-prestataire" className="hover:text-blue-600">
                  Devenir prestataire
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/a-propos" className="hover:text-blue-600">
                  Qui sommes-nous
                </Link>
              </li>
              <li>
                <Link to="/comment-ca-marche" className="hover:text-blue-600">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/confidentialite" className="hover:text-blue-600">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/conditions-utilisation" className="hover:text-blue-600">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-blue-600">
                  Gestion des cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} ServPro. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
