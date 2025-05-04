import { useEffect, useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { StarRating } from "@/components/StarRating";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Prestataire, Profil, Service } from "@/types/models";
import { fetchPrestataires, fetchServices, fetchProfils } from "@/data/mockData";
import { Button } from "@/components/ui/button";

type PrestataireWithDetails = Prestataire & {
  profil?: Profil;
  servicesCount: number;
  feedback: {
    count: number;
    rating: number;
  };
};

const Prestataires = () => {
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [profils, setProfils] = useState<Profil[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prestatairesData, servicesData, profilsData] = await Promise.all([
          fetchPrestataires(),
          fetchServices(),
          fetchProfils(),
        ]);

        setPrestataires(prestatairesData);
        setServices(servicesData);
        setProfils(profilsData);
      } catch (err) {
        console.error("Erreur de chargement:", err);
        setError("Échec du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10">Chargement...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  const prestatairesWithDetails: PrestataireWithDetails[] = prestataires.map((prestataire) => {
    const profil = profils.find((p) => p.id === prestataire.profileId);
    const prestataireServices = services.filter((s) => s.prestataireId === prestataire.id);

    return {
      ...prestataire,
      profil,
      servicesCount: prestataireServices.length,
      feedback: {
        count: prestataireServices.length,
        rating: 4, // Valeur par défaut
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

          {prestatairesWithDetails.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prestatairesWithDetails.map((prestataire) => {
                if (!prestataire.profil) {
                  console.warn(`Prestataire ${prestataire.id} n'a pas de profil associé`);
                  return null;
                }

                return (
                  <Card key={prestataire.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-2">
                      <h2 className="text-xl font-semibold">
                        {prestataire.profil.prenom} {prestataire.profil.nom}
                      </h2>
                      {prestataire.feedback.count > 0 && (
                        <div className="flex items-center mt-1">
                          <StarRating rating={prestataire.feedback.rating} />
                          <span className="ml-2 text-sm text-gray-600">
                            ({prestataire.feedback.count} avis)
                          </span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {prestataire.profil.bio || "Bio non disponible"}
                      </p>
                      <p className="text-sm text-gray-700 mb-4">
                        <strong>{prestataire.servicesCount}</strong> service(s) proposé(s)
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
                        <Button variant="outline" className="w-full">
                          Voir le profil
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p>Aucun prestataire trouvé.</p>
              <div className="mt-4 p-4 bg-gray-100 rounded text-left">
                <h3 className="font-semibold">Informations de débogage:</h3>
                <pre className="text-xs">
                  {JSON.stringify(
                    {
                      prestatairesCount: prestataires.length,
                      servicesCount: services.length,
                      profilsCount: profils.length,
                      prestatairesWithProfils: prestataires.filter((p) =>
                        profils.some((pr) => pr.id === p.profileId)
                      ).length,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Prestataires;
