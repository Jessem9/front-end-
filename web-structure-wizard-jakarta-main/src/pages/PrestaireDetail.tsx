import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import ServiceCard  from "@/components/ServiceCard";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Prestataire } from "@/types/models";
import { fetchPrestataires } from "@/data/mockData";

const PrestataireDetail = () => {
  const { id } = useParams<{ id: string }>();
  const prestataireId = parseInt(id || "0", 10);

  const [prestataire, setPrestataire] = useState<Prestataire | null>(null);

  useEffect(() => {
    const getPrestataire = async () => {
      try {
        const prestatairesData = await fetchPrestataires();
        const selectedPrestataire = prestatairesData.find(p => p.id === prestataireId);
        if (selectedPrestataire) {
          setPrestataire(selectedPrestataire);
        }
      } catch (error) {
        console.error("Failed to fetch prestataire data:", error);
      }
    };
    getPrestataire();
  }, [prestataireId]);

  if (!prestataire || !prestataire.profilPro) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Prestataire non trouvé
            </h1>
            <Link to="/prestataires" className="text-blue-600 hover:underline">
              Retour aux prestataires
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Example of rating
  const averageRating = 4.5;
  const reviewCount = 15;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-blue-600">Accueil</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/prestataires" className="hover:text-blue-600">Prestataires</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-800">{prestataire.profilPro.prenom} {prestataire.profilPro.nom}</span>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="text-2xl font-bold">
                    {prestataire.profilPro.prenom} {prestataire.profilPro.nom}
                  </h1>
                  <div className="flex items-center mt-2">
                    <StarRating rating={Math.round(averageRating)} />
                    <span className="ml-2 text-sm text-gray-600">
                      ({reviewCount} avis)
                    </span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Contacter
                  </Button>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 md:flex gap-8">
              {/* Main information */}
              <div className="flex-grow md:w-2/3">
                <h2 className="text-xl font-semibold mb-4">À propos</h2>
                <p className="text-gray-600 mb-6">
                  {prestataire.profilPro.bio}
                </p>

                {/* Skills */}
                <h2 className="text-xl font-semibold mb-4 mt-8">Compétences</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {prestataire.profilPro.competences.map((competence, index) => (
                    <Badge 
                      key={index} 
                      className="bg-blue-100 text-blue-800"
                    >
                      {competence}
                    </Badge>
                  ))}
                </div>

                {/* Experience */}
                <h2 className="text-xl font-semibold mb-4 mt-8">Expérience</h2>
                <ul className="list-disc pl-6 text-gray-600 mb-6">
                  {prestataire.profilPro.experience.map((exp, index) => (
                    <li key={index} className="mb-2">{exp}</li>
                  ))}
                </ul>
              </div>

              {/* Contact information */}
              <div className="md:w-1/3 mt-8 md:mt-0">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4">Coordonnées</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p>{prestataire.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Adresse</p>
                        <p>{prestataire.profilPro.adress}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Services */}
            <div className="p-6 border-t">
              <h2 className="text-xl font-semibold mb-6">
                Services proposés ({prestataire.services.length})
              </h2>

              {prestataire.services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {prestataire.services.map(service => (
                    <ServiceCard key={service.id} service={service} prestataire={undefined} sousCategorie={undefined} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  Ce prestataire n'a pas encore publié de services.
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

export default PrestataireDetail;
