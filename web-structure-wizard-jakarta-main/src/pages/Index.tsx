import { useEffect, useState } from 'react';
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import { CategorieCard } from "@/components/CategorieCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { fetchCategories, fetchSousCategories, fetchServices } from "@/data/mockData";
import { Categorie, Service, SousCategorie } from '@/types/models';
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, ChevronRight, ChevronLeft, Star } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';

const Index = () => {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [sousCategories, setSousCategories] = useState<SousCategorie[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (token) {
        setIsLoggedIn(true);
        setUserRole(role);
      }
      try {
        const [categoriesData, sousCategoriesData, servicesData] = await Promise.all([
          fetchCategories(),
          fetchSousCategories(),
          fetchServices()
        ]);
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

  const getSousCategoriesParCategorie = (categorieId: number) => {
    return sousCategories
      .filter(sc => sc.categorieId === categorieId)
      .map(sc => sc.nom);
  };

  const filteredServices = services.filter(service =>
    service.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-1/3 bg-[#0A554D]/30" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, j) => (
                  <Skeleton key={j} className="h-48 rounded-xl bg-[#0A554D]/30" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5]">
      <div className="bg-[#09403A]/10 border border-[#0A554D] text-[#09403A] px-4 py-3 rounded max-w-md">
        <strong>Erreur:</strong> {error}
      </div>
      <Button 
        onClick={() => window.location.reload()} 
        className="mt-4 bg-[#09403A] hover:bg-[#0A554D] text-white"
      >
        Réessayer
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#09403A] to-[#0A554D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Trouvez le <span className="text-[#8DBEB2]">meilleur</span> prestataire
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-white/90">
              ServPro connecte les demandeurs aux prestataires qualifiés dans diverses catégories.
            </p>
            <div className="max-w-2xl mx-auto relative mb-10">
              <Input
                type="text"
                placeholder="Rechercher un service..."
                className="pl-12 pr-6 py-6 rounded-full border-none shadow-lg bg-white/90 focus:ring-2 focus:ring-[#8DBEB2]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0A554D]" />
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {/* Always show this button */}
              <Link to="/services">
                <Button 
                  size="lg"
                  className="relative overflow-hidden group transition-all duration-300 bg-white text-[#09403A] border-2 border-[#09403A] hover:bg-[#09403A] hover:text-white"
                >
                  <span className="relative z-10 flex items-center">
                    Explorer les services
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 bg-[#8DBEB2] opacity-0 group-active:opacity-100 transition-opacity duration-100" />
                </Button>
              </Link>
              {/* Conditionally show buttons based on the role */}
              {userRole === 'Demandeur' && (
                <Link to="/inscription">
                  <Button
                    variant="outline"
                    size="lg"
                    className="relative overflow-hidden group transition-all duration-300 bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#09403A]"
                  >
                    <span className="relative z-10">Devenir prestataire</span>
                    <span className="absolute inset-0 bg-[#0A554D] opacity-0 group-active:opacity-100 transition-opacity duration-100" />
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </Link>
              )}
              {userRole === 'Prestataire' && (
                <Link to="/creer-service">
                  <Button
                    variant="outline"
                    size="lg"
                    className="relative overflow-hidden group transition-all duration-300 bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#09403A]"
                  >
                    <span className="relative z-10">Créer un service</span>
                    <span className="absolute inset-0 bg-[#0A554D] opacity-0 group-active:opacity-100 transition-opacity duration-100" />
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Stats section */}
      <section className="bg-white py-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[ 
              { value: "500+", label: "Prestataires", color: "text-[#09403A]" },
              { value: "50+", label: "Catégories", color: "text-[#0A554D]" },
              { value: "10K+", label: "Clients satisfaits", color: "text-[#3A7D6E]" },
              { value: "95%", label: "Satisfaction", color: "text-[#8DBEB2]" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="p-4 hover:scale-105 transition-transform"
              >
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-700">{stat.label}</div>
              </div>
            ))}
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
