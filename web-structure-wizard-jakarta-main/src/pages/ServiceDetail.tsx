import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import FeedbackCard from "@/components/FeedbackCard";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { Feedback, Service, SousCategorie, Categorie, Prestataire } from "@/types/models";
import { fetchServices, fetchSousCategories, fetchCategories, fetchPrestataires } from "@/data/mockData";

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const serviceId = parseInt(id || "0", 10);

  const [service, setService] = useState<Service | null>(null);
  const [subCategories, setSubCategories] = useState<SousCategorie[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [services, sousCats, cats, prests] = await Promise.all([
          fetchServices(),
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
          // TODO: Replace with real fetch for feedbacks
          setFeedbacks([]);
        } else {
          setError("Service non trouvé");
        }
      } catch (err) {
        setError("Erreur lors de la récupération des données");
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
            <Link to="/services" className="text-blue-600 hover:underline">
              Retour aux services
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Extract instances from IDs
  const subCat = subCategories.find(sc => sc.id === service.sousCategorieId);
  const cat = categories.find(c => c.id === subCat?.categorieId);
  const prestataire = prestataires.find(p => p.id === service.prestataireId);

  const averageRating =
    feedbacks.length > 0
      ? feedbacks.reduce((acc, curr) => acc + curr.note, 0) / feedbacks.length
      : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-blue-600">Accueil</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/categories" className="hover:text-blue-600">Catégories</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            {cat && (
              <>
                <Link to={`/categories/${cat.id}`} className="hover:text-blue-600">
                  {cat.nom}
                </Link>
                <ChevronRight className="h-4 w-4 mx-2" />
              </>
            )}
            <span className="text-gray-800">{service.titre}</span>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{service.titre}</h1>
                  <div className="flex items-center mt-2 space-x-4">
                    {subCat && (
                      <Badge className="bg-blue-100 text-blue-800">
                        {subCat.nom}
                      </Badge>
                    )}
                    {feedbacks.length > 0 && (
                      <div className="flex items-center">
                        <StarRating rating={Math.round(averageRating)} />
                        <span className="ml-2 text-sm text-gray-600">
                          ({feedbacks.length} avis)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Réserver ce service
                  </Button>
                  <Button variant="outline">
                    Contacter le prestataire
                  </Button>
                </div>
              </div>
            </div>

            {/* Description + Prestataire */}
            <div className="p-6 md:flex gap-8">
              <div className="flex-grow md:w-2/3">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <p className="text-gray-600 mb-4">
                  Notre prestataire est disponible pour vous aider avec ce service. Nous garantissons un travail de qualité.
                </p>
                <p className="text-gray-600">
                  N'hésitez pas à nous contacter pour plus d'informations ou pour discuter de vos besoins spécifiques.
                </p>
              </div>
              <div className="md:w-1/3 mt-8 md:mt-0">
                <h2 className="text-xl font-semibold mb-4">Prestataire</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {prestataire ? (
                    <>
                      <h3 className="font-medium mb-2">
                        {prestataire.email.split('@')[0]}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Prestataire professionnel dans {cat?.nom}
                      </p>
                      <Link
                        to={`/prestataires/${prestataire.id}`}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Voir le profil complet
                      </Link>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Prestataire introuvable.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Feedbacks */}
            <div className="p-6 border-t">
              <h2 className="text-xl font-semibold mb-4">
                Avis clients ({feedbacks.length})
              </h2>
              {feedbacks.length > 0 ? (
                <div className="space-y-4">
                  {feedbacks.map((feedback) => (
                    <FeedbackCard key={feedback.id} feedback={feedback} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  Aucun avis pour ce service pour le moment.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetail;
