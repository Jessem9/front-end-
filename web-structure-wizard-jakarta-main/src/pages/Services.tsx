import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { useState, useEffect } from "react";
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

  // Fetch categories, subcategories, and services
  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        const subCategoriesData = await fetchSousCategories();
        setSubCategories(subCategoriesData);
        const servicesData = await fetchServices();
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, []);

  // Helper function to get categoryId from sousCategorieId
  const getCategorieIdFromSousCategorieId = (sousCategorieId: number) => {
    return subCategories.find(sc => sc.id === sousCategorieId)?.categorieId;
  };

  // Filter subcategories based on selected category
  const filteredSubCategories = selectedCategory !== "all"
    ? subCategories.filter(sc => sc.categorieId === parseInt(selectedCategory, 10))
    : subCategories;

  // Filter services based on search, category, and subcategory
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

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Reset filters
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
          <h1 className="text-3xl font-bold mb-8">Tous les services</h1>

          {/* Filtres et recherche */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-grow">
                  <Input
                    placeholder="Rechercher un service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
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
                  <SelectTrigger className="w-full md:w-[200px]">
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
                >
                  Réinitialiser
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" />
                  Rechercher
                </Button>
              </div>
            </form>
          </div>

          {/* Résultats */}
          <div>
            <p className="text-gray-600 mb-4">
              {filteredServices.length} service(s) trouvé(s)
            </p>

            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service, index) => (
                  <ServiceCard 
                    key={service.id ?? index} 
                    service={service} 
                    prestataire={undefined}  // If you have the prestataire data, pass it here.
                    sousCategorie={subCategories.find(subCat => subCat.id === service.sousCategorieId)} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">
                  Aucun service ne correspond à votre recherche.
                </p>
                <Button 
                  variant="link" 
                  onClick={resetFilters} 
                  className="text-blue-600"
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
