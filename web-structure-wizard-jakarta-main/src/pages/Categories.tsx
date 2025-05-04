import { useEffect, useState } from 'react';
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { CategorieCard } from "@/components/CategorieCard";
import { fetchCategories, fetchSousCategories } from "@/data/mockData";
import { Categorie, SousCategorie } from "@/types/models";
import { Input } from "@/components/ui/input";
import { X, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Categories = () => {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [sousCategories, setSousCategories] = useState<SousCategorie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, sousCategoriesData] = await Promise.all([
          fetchCategories(),
          fetchSousCategories()
        ]);
        setCategories(categoriesData);
        setSousCategories(sousCategoriesData);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getSousCategoriesParCategorie = (categorieId: number) => {
    return sousCategories
      .filter(sc => sc.categorieId === categorieId)
      .map(sc => sc.nom);
  };

  const filteredCategories = categories.filter(categorie => {
    const matchesSearch = categorie.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || categorie.id.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Catégories de services</h1>
          </div>

          {/* Search and Filter - Single Line */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#09403A]/20 mb-8">
            <div className="flex items-center gap-3">
              {/* Big Search Input - Takes more space */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une catégorie..."
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

              {/* Small Filter - Takes less space */}
              <div className="w-48">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="border-[#09403A]/30 focus:border-[#09403A] h-9 text-sm">
                    <SelectValue placeholder="Filtrer" />
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

              {/* Reset Button - Only shows when needed */}
              {(searchTerm || selectedCategory !== "all") && (
                <button
                  onClick={resetFilters}
                  className="text-[#09403A] flex items-center text-xs hover:underline ml-2"
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
              {filteredCategories.length} catégorie(s) trouvée(s)
            </p>

            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCategories.map(categorie => (
                  <CategorieCard
                    key={categorie.id}
                    categorie={categorie}
                    sousCategories={getSousCategoriesParCategorie(categorie.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">
                  Aucune catégorie ne correspond à votre recherche.
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

export default Categories;