import { useEffect, useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { StarRating } from "@/components/StarRating";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Prestataire, Profil, Service } from "@/types/models";
import { fetchPrestataires, fetchProfils, fetchServices } from "@/data/mockData";
import { Button } from "@/components/ui/button";

const Prestataires = () => {
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [profils, setProfils] = useState<Profil[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prestatairesData, profilsData, servicesData] = await Promise.all([
          fetchPrestataires(),
          fetchProfils(),
          fetchServices(),
        ]);
        setPrestataires(prestatairesData);
        setProfils(profilsData);
        setServices(servicesData);
      } catch (err) {
        setError("Échec du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10">Chargement...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  const prestatairesWithProfile = prestataires.map((prestataire) => {
    const profil = profils.find((p) => p.id === prestataire.id);
    const prestataireServices = services.filter((s) => s.prestataireId === prestataire.id);
    return {
      prestataire,
      profil,
      servicesCount: prestataireServices.length,
      feedback: {
        count: prestataireServices.length,
        rating: 4, // Placeholder
      },
    };
  });

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Nos prestataires</h1>
            <Link to="/inscription">
              <Button variant="outline">Devenir prestataire</Button>
            </Link>
          </div>
          {prestatairesWithProfile.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prestatairesWithProfile.map(({ prestataire, profil, servicesCount, feedback }) => (
                <Card key={prestataire.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <h2 className="text-xl font-semibold">
                      {profil ? `${profil.prenom} ${profil.nom}` : "Nom inconnu"}
                    </h2>
                    {feedback.count > 0 && (
                      <div className="flex items-center mt-1">
                        <StarRating rating={feedback.rating} />
                        <span className="ml-2 text-sm text-gray-600">
                          ({feedback.count} avis)
                        </span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {profil ? profil.bio : "Bio non disponible"}
                    </p>
                    <p className="text-sm text-gray-700 mb-4">
                      <strong>{servicesCount}</strong> service(s) proposé(s)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {prestataire.profilPro?.competences?.slice(0, 3).map((competence, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-800">
                          {competence}
                        </Badge>
                      ))}
                      {prestataire.profilPro?.competences?.length > 3 && (
                        <Badge className="bg-gray-100 text-gray-800">
                          +{prestataire.profilPro.competences.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t">
                    <Link to={`/prestataires/${prestataire.id}`} className="w-full">
                      <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                        Voir le profil
                      </button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">Aucun prestataire trouvé.</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Prestataires;
