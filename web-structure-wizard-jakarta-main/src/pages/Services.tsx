import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedSubCategory("all");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-[#09403A] mb-8">Nos Services</h1>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#09403A]/20 mb-8">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-grow">
                  <Input
                    placeholder="Rechercher un service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-[#09403A]/30 focus:border-[#09403A]"
                  />
                </div>

                <Select
                  value={selectedCategory}
                  onValueChange={(value) => {
                    setSelectedCategory(value);
                    setSelectedSubCategory("all"); // Reset subcategory when category changes
                  }}
                >
                  <SelectTrigger className="w-full md:w-[200px] border-[#09403A]/30 focus:border-[#09403A]">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedSubCategory}
                  onValueChange={setSelectedSubCategory}
                  disabled={selectedCategory === "all"}
                >
                  <SelectTrigger className="w-full md:w-[200px] border-[#09403A]/30 focus:border-[#09403A]">
                    <SelectValue placeholder="Sous-catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les sous-catégories</SelectItem>
                    {filteredSubCategories.map(subCat => (
                      <SelectItem key={subCat.id} value={subCat.id.toString()}>
                        {subCat.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetFilters}
                  className="border-[#09403A] text-[#09403A] hover:bg-[#09403A]/10"
                >
                  Réinitialiser
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#09403A] hover:bg-[#0A554D]"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Rechercher
                </Button>
              </div>
            </form>
          </div>

          {/* Results */}
          <div>
            <p className="text-gray-600 mb-4">
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
                <Button 
                  variant="link" 
                  onClick={resetFilters} 
                  className="text-[#09403A]"
                >
                  Réinitialiser les filtres
                </Button>
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