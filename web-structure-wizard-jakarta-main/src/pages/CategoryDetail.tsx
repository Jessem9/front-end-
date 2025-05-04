import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchCategories, fetchSousCategories, fetchServices } from "@/data/mockData";
import { Categorie, Service, SousCategorie } from "@/types/models";

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = parseInt(id || "0", 10);

  const [categories, setCategories] = useState<Categorie[]>([]);
  const [sousCategories, setSousCategories] = useState<SousCategorie[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, sousCategoriesData, servicesData] = await Promise.all([
          fetchCategories(),
          fetchSousCategories(),
          fetchServices(),
        ]);
        setCategories(categoriesData);
        setSousCategories(sousCategoriesData);
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const category = categories.find((cat) => cat.id === categoryId);
  const subCategories = sousCategories.filter((sc) => sc.categorieId === categoryId);

  const filteredServices = services.filter(service => {
    const matchesSubCategory = selectedSubCategory 
      ? service.sousCategorieId === selectedSubCategory
      : true;
    
    const matchesSearch = searchTerm 
      ? service.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesSubCategory && matchesSearch;
  });

  const servicesBySubCategory = subCategories.map((sc) => ({
    sousCategorie: sc,
    services: filteredServices.filter((s) => s.sousCategorieId === sc.id),
  }));

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSubCategory(null);
  };

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200 max-w-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Catégorie non trouvée</h1>
            <Link 
              to="/categories" 
              className="text-[#09403A] hover:text-[#0A554D] font-medium hover:underline transition-colors"
            >
              Retour aux catégories
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-600 mb-6">
            <Link 
              to="/" 
              className="hover:text-[#09403A] transition-colors"
            >
              Accueil
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <Link 
              to="/categories" 
              className="hover:text-[#09403A] transition-colors"
            >
              Catégories
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-[#09403A] font-medium">{category.nom}</span>
          </div>

          {/* Header with search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Services dans {category.nom}</h1>
              <p className="text-gray-600">Explorez nos services spécialisés</p>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher des services..."
                className="pl-10 pr-8 border-gray-300 focus:border-[#09403A] focus:ring-[#09403A]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <X 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                  onClick={() => setSearchTerm("")}
                />
              )}
            </div>
          </div>

          {/* Active filters */}
          {(searchTerm || selectedSubCategory) && (
            <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <span className="text-sm text-gray-600">Filtres actifs :</span>
              {searchTerm && (
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-1 border-[#09403A]/30 bg-[#09403A]/10 text-[#09403A] hover:bg-[#09403A]/20"
                >
                  "{searchTerm}"
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-[#09403A]" 
                    onClick={() => setSearchTerm("")}
                  />
                </Badge>
              )}
              {selectedSubCategory && (
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-1 border-[#09403A]/30 bg-[#09403A]/10 text-[#09403A] hover:bg-[#09403A]/20"
                >
                  {subCategories.find(sc => sc.id === selectedSubCategory)?.nom}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-[#09403A]" 
                    onClick={() => setSelectedSubCategory(null)}
                  />
                </Badge>
              )}
              <button 
                onClick={clearFilters}
                className="text-sm text-[#09403A] hover:underline ml-2"
              >
                Tout effacer
              </button>
            </div>
          )}

          {/* Subcategories filter */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sous-catégories</h2>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!selectedSubCategory ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  !selectedSubCategory 
                    ? "bg-[#09403A] text-white hover:bg-[#0A554D]" 
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                }`}
                onClick={() => setSelectedSubCategory(null)}
              >
                Toutes
              </Badge>
              {subCategories.map((sc) => (
                <Badge 
                  key={sc.id} 
                  variant={selectedSubCategory === sc.id ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    selectedSubCategory === sc.id 
                      ? "bg-[#09403A] text-white hover:bg-[#0A554D]" 
                      : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                  }`}
                  onClick={() => setSelectedSubCategory(
                    selectedSubCategory === sc.id ? null : sc.id
                  )}
                >
                  {sc.nom}
                </Badge>
              ))}
            </div>
          </div>

          {/* Services list */}
          {servicesBySubCategory.some(group => group.services.length > 0) ? (
            <div className="space-y-12">
              {servicesBySubCategory.map(
                ({ sousCategorie, services }) =>
                  services.length > 0 && (
                    <div key={sousCategorie.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                        {sousCategorie.nom}
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          ({services.length} {services.length > 1 ? 'services' : 'service'})
                        </span>
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                          <ServiceCard 
                            key={service.id} 
                            service={service} 
                            sousCategorie={sousCategorie} 
                          />
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-gray-600 mb-4">
                Aucun service trouvé {searchTerm ? `pour "${searchTerm}"` : "dans cette sous-catégorie"}
              </div>
              <button 
                onClick={clearFilters}
                className="text-[#09403A] font-medium hover:underline flex items-center justify-center mx-auto"
              >
                <X className="h-4 w-4 mr-1" />
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryDetail;