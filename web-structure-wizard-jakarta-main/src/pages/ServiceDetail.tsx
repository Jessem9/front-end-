import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { Service, SousCategorie, Categorie, Prestataire } from "@/types/models";
import { fetchServices, fetchSousCategories, fetchCategories, fetchPrestataires } from "@/data/mockData";

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const serviceId = id ? parseInt(id, 10) : null;

  const [service, setService] = useState<Service | null>(null);
  const [subCategories, setSubCategories] = useState<SousCategorie[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) {
      setError("ID de service invalide");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [services, sousCats, cats, prests] = await Promise.all([
          fetchServices().then(data => data || []),
          fetchSousCategories(),
          fetchCategories(),
          fetchPrestataires()
        ]);

        const selectedService = services.find(s => s.id === serviceId);
        
        if (selectedService) {
          setService(selectedService);
          setSubCategories(sousCats);
          setCategories(cats);
          setPrestataires(prests);
        } else {
          setError(`Service non trouvé (ID: ${serviceId})`);
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-gray-600">Chargement...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error || "Service non trouvé"}
            </h1>
            <Link to="/services" className="text-[#09403A] hover:underline">
              Retour aux services
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subCat = subCategories.find(sc => sc.id === service.sousCategorieId);
  const cat = categories.find(c => c.id === subCat?.categorieId);
  const prestataire = prestataires.find(p => p.id === service.prestataireId);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-[#09403A]">Accueil</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/services" className="hover:text-[#09403A]">Services</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-[#09403A] font-medium">{service.titre}</span>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-[#09403A]/20">
            {/* Hero Image */}
            <div className="relative h-72 w-full overflow-hidden">
              <img
                src={service.image || "/placeholder-service.jpg"}
                alt={service.titre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-service.jpg";
                }}
              />
            </div>

            {/* Main Content */}
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column */}
                <div className="md:w-2/3">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {subCat && (
                      <Badge className="bg-[#09403A]/10 text-[#09403A] hover:bg-[#09403A]/20">
                        {subCat.nom}
                      </Badge>
                    )}
                    {cat && (
                      <Badge className="bg-[#0A554D]/10 text-[#0A554D] hover:bg-[#0A554D]/20">
                        {cat.nom}
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold text-[#09403A] mb-4">
                    {service.titre}
                  </h1>

                  {prestataire ? (
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-gray-600">Prestataire:</span>
                      <Link 
                        to={`/prestataires/${prestataire.id}`}
                        className="text-[#09403A] font-medium hover:underline"
                      >
                        {
                         (prestataire.email ? prestataire.email.split('@')[0] : `Prestataire #${prestataire.id}`)}
                      </Link>
                     
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm mb-6">
                      Aucun prestataire associé à ce service
                    </div>
                  )}

                  <div className="prose max-w-none text-gray-700 mb-8">
                    <h2 className="text-xl font-semibold text-[#09403A] mb-4">
                      Description du service
                    </h2>
                    <p className="whitespace-pre-line">{service.description}</p>
                  </div>
                </div>

                {/* Right Column - Booking */}
                <div className="md:w-1/3">
                  <div className="bg-[#F5F5F5] p-6 rounded-lg border border-[#09403A]/20 sticky top-4">
                    <h2 className="text-xl font-semibold text-[#09403A] mb-4">
                      Réserver ce service
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-700">Prix:</h3>
                        <p className="text-2xl font-bold text-[#09403A]">
                          {service.id ? `${service.id} €` : "Sur devis"}
                        </p>
                      </div>
                      
                      <Button className="w-full bg-[#09403A] hover:bg-[#0A554D]">
                        Réserver maintenant
                      </Button>
                      
                      {prestataire && (
                        <Button variant="outline" className="w-full border-[#09403A] text-[#09403A] hover:bg-[#09403A]/10">
                          Contacter le prestataire
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetail;