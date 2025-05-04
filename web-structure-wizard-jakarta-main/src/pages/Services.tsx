import { useState, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { Input } from "@/components/ui/input";
import { X, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCategories, fetchSousCategories, fetchServices } from "@/data/mockData";
import { Categorie, Service, SousCategorie } from "@/types/models";

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [subCategories, setSubCategories] = useState<SousCategorie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, subCategoriesData, servicesData] = await Promise.all([
          fetchCategories(),
          fetchSousCategories(),
          fetchServices()
        ]);
        setCategories(categoriesData);
        setSubCategories(subCategoriesData);
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    loadData();
  }, []);

  const getCategorieIdFromSousCategorieId = (sousCategorieId: number) => {
    return subCategories.find(sc => sc.id === sousCategorieId)?.categorieId;
  };

  const filteredSubCategories = selectedCategory !== "all"
    ? subCategories.filter(sc => sc.categorieId === parseInt(selectedCategory, 10))
    : subCategories;

  const filteredServices = services.filter(service => {
    const matchesSearch =
      service.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    const serviceCategorieId = getCategorieIdFromSousCategorieId(service.sousCategorieId);

    const matchesCategory =
      selectedCategory === "all" ||
      serviceCategorieId === parseInt(selectedCategory, 10);

    const matchesSubCategory =
      selectedSubCategory === "all" ||
      service.sousCategorieId === parseInt(selectedSubCategory, 10);

    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedSubCategory("all");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Nos Services</h1>
          </div>

          {/* Compact Filter Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#09403A]/20 mb-8">
            <div className="flex items-center gap-3">
              {/* Big Search Input */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-[#09403A]/30 focus:border-[#09403A] pl-9 pr-8 h-9 text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="w-40">
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => {
                    setSelectedCategory(value);
                    setSelectedSubCategory("all");
                  }}
                >
                  <SelectTrigger className="border-[#09403A]/30 focus:border-[#09403A] h-9 text-sm">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory Filter */}
              <div className="w-40">
                <Select
                  value={selectedSubCategory}
                  onValueChange={setSelectedSubCategory}
                  disabled={selectedCategory === "all"}
                >
                  <SelectTrigger className="border-[#09403A]/30 focus:border-[#09403A] h-9 text-sm">
                    <SelectValue placeholder="Sous-cat." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {filteredSubCategories.map(subCat => (
                      <SelectItem key={subCat.id} value={subCat.id.toString()}>
                        {subCat.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Button */}
              {(searchTerm || selectedCategory !== "all" || selectedSubCategory !== "all") && (
                <button
                  onClick={resetFilters}
                  className="text-[#09403A] flex items-center text-xs hover:underline ml-1"
                  title="Réinitialiser"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div>
            <p className="text-gray-600 mb-4 text-sm">
              {filteredServices.length} service(s) trouvé(s)
            </p>

            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => {
                  const subCat = subCategories.find(sc => sc.id === service.sousCategorieId);
                  return (
                    <ServiceCard 
                      key={service.id} 
                      service={service}
                      sousCategorie={subCat}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">
                  Aucun service ne correspond à votre recherche.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-2 text-[#09403A] flex items-center justify-center mx-auto text-sm"
                >
                  <X className="mr-1 h-4 w-4" />
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;