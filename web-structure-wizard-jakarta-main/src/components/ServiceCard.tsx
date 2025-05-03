import { Link } from "react-router-dom";
import { Service, SousCategorie } from "@/types/models";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  service: Service;
  sousCategorie?: SousCategorie;
}

const ServiceCard = ({ service, sousCategorie }: ServiceCardProps) => {
  console.log('Service in Card:', service);
  console.log('Service id:', service.id);

 
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/default-service.png';
    target.className = "w-full h-full object-contain bg-gray-100";
  };

  return (
    <Link 
      to={`/services/${service.id}`} // Now guaranteed to have an ID
      className="group block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-[#09403A]/20 h-full flex flex-col"
    >

      <div className="h-48 overflow-hidden bg-gray-100">
        <img
          src={service.image || '/default-service.png'}
          alt={service.titre || "Service image"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
          loading="lazy"
        />
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-3">
          {sousCategorie && (
            <Badge className="bg-[#09403A]/10 text-[#09403A] hover:bg-[#09403A]/20">
              {sousCategorie.nom}
            </Badge>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-[#09403A] mb-3 line-clamp-2">
          {service.titre || "Service sans titre"}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-3 flex-grow">
          {service.description || "Aucune description disponible"}
        </p>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-[#09403A] group-hover:underline">
            Voir détails →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;