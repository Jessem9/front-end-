import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPrestataire } from "../data/mockData";
import { Prestataire } from "../types/models";

const PrestataireDetail = () => {
  const { id } = useParams();
  const [prestataire, setPrestataire] = useState<Prestataire | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrestataire() {
      try {
        if (!id) {
          setError("ID manquant");
          return;
        }

        const data = await getPrestataire(id);
        console.log("Fetched prestataire:", data);

        if (!data || !data.profileId) {
          setError("Données du prestataire incomplètes");
          return;
        }

        setPrestataire(data);
      } catch (err: any) {
        console.error("Failed to fetch prestataire data:", err);
        setError("Erreur lors du chargement des données du prestataire");
      } finally {
        setLoading(false);
      }
    }

    fetchPrestataire();
  }, [id]);

  if (loading) return <div className="p-6 text-gray-600">Chargement...</div>;

  if (error) return <div className="p-6 text-red-500 font-semibold">{error}</div>;

  if (!prestataire) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{prestataire.nom}</h1>
      <p>Email : {prestataire.email}</p>
      <p>Téléphone : {prestataire.telephone}</p>

      <h2 className="text-xl font-semibold mt-6">Profil</h2>
      <p>Nom complet : {prestataire.profil?.nom} {prestataire.profil?.prenom}</p>
      <p>Adresse : {prestataire.profil?.adresse}</p>

      {prestataire.profilPro && (
        <>
          <h2 className="text-xl font-semibold mt-6">Profil Professionnel</h2>
          <p>Spécialité : {prestataire.profilPro.specialite}</p>
          <p>Années d'expérience : {prestataire.profilPro.anneesExperience}</p>
        </>
      )}
    </div>
  );
};

export default PrestataireDetail;
