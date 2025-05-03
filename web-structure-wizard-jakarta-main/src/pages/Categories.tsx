import { useEffect, useState } from 'react';
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { CategorieCard } from "@/components/CategorieCard";
import { fetchCategories, fetchSousCategories } from "@/data/mockData";
import { Categorie, SousCategorie } from "@/types/models";

const Categories = () => {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [sousCategories, setSousCategories] = useState<SousCategorie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await fetchCategories();
        const sousCategoriesData = await fetchSousCategories();
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-8">Catégories de services</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map(categorie => (
              <CategorieCard
                key={categorie.id}
                categorie={categorie}
                sousCategories={getSousCategoriesParCategorie(categorie.id)}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
