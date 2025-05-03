import { Prestataire, Service, SousCategorie } from "@/types/models";

interface ServiceCardProps {
  service: Service;
  prestataire: Prestataire | undefined;
  sousCategorie: SousCategorie | undefined;
}

const ServiceCard = ({ service, prestataire, sousCategorie }: ServiceCardProps) => {
  return (
    <div className="service-card">
      <h3>{service.titre || "Service sans titre"}</h3>
      <p>{service.description || "Aucune description disponible"}</p>

      {/* Check if prestataire is defined and handle its properties safely */}
      {prestataire && prestataire.profilPro ? (
        <p>Prestataire: {prestataire.profilPro.nom || "Nom inconnu"}</p>
      ) : (
        <p>Prestataire non disponible</p>
      )}

      {/* Check if sousCategorie is defined */}
      {sousCategorie ? (
        <p>Sous-catégorie: {sousCategorie.nom || "Non spécifié"}</p>
      ) : (
        <p>Sous-catégorie non disponible</p>
      )}

      {/* Check if reserveParId exists */}
      {service.reserveParId && (
        <p>Réservé par: {service.reserveParId}</p>
      )}

      {/* Ensure image URL is valid, otherwise show a fallback */}
      <img
        src={service.image || "/path/to/default-image.jpg"}  // Fallback image if none is provided
        alt={service.titre || "Service image"}
        className="service-image"
      />
    </div>
  );
};

export default ServiceCard;
