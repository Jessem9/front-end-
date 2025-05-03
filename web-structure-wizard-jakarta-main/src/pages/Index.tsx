import { useEffect, useState } from 'react';
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import  ServiceCard  from "@/components/ServiceCard";
import { CategorieCard } from "@/components/CategorieCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { fetchCategories, fetchSousCategories, fetchServices } from "@/data/mockData";
import { Categorie, Service, SousCategorie } from '@/types/models';

const Index = () => {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [sousCategories, setSousCategories] = useState<SousCategorie[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await fetchCategories();
        const sousCategoriesData = await fetchSousCategories();
        const servicesData = await fetchServices();
        setCategories(categoriesData);
        setSousCategories(sousCategoriesData);
        setServices(servicesData);
      } catch (err) {
        setError('Échec du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  const getSousCategoriesParCategorie = (categorieId: number) => {
    return sousCategories
      .filter(sc => sc.categorieId === categorieId)
      .map(sc => sc.nom);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Trouvez le bon prestataire pour votre besoin
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              ServPro connecte les demandeurs aux meilleurs prestataires de services
              dans diverses catégories.
            </p>
            <div className="flex justify-center">
              <Link to="/services">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 mr-4">
                  Découvrir les services
                </Button>
              </Link>
              <Link to="/inscription">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Devenir prestataire
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories populaires */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Catégories populaires</h2>
            <Link to="/categories">
              <Button variant="outline">Voir toutes les catégories</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.length > 0 ? (
              categories.map(categorie => (
                <CategorieCard
                  key={categorie.id}  // Ensure `categorie.id` is unique
                  categorie={categorie}
                  sousCategories={getSousCategoriesParCategorie(categorie.id)}
                />
              ))
            ) : (
              <div>Pas de catégories disponibles.</div>
            )}
          </div>
        </div>
      </section>

      {/* Services récents */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Services récents</h2>
            <Link to="/services">
              <Button variant="outline">Voir tous les services</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.length > 0 ? (
              services.slice(0, 6).map(service => (
                <ServiceCard key={service.id} service={service} prestataire={undefined} sousCategorie={undefined} />
              ))
            ) : (
              <div>Pas de services disponibles.</div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
