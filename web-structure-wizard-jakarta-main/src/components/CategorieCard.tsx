import { Link } from "react-router-dom";
import { Categorie } from "@/types/models";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChevronRight, CheckCircle } from "lucide-react";

interface CategorieCardProps {
  categorie: Categorie & {
    image?: string;
  };
  sousCategories: string[];
  icon?: React.ReactNode;
}

export const CategorieCard: React.FC<CategorieCardProps> = ({ 
  categorie, 
  sousCategories,
  icon
}) => {
  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 border border-[#09403A]/20 h-full flex flex-col">
      {/* Original size container */}
      <div className="flex flex-col h-full">
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#09403A]/5 to-[#0A554D]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardContent className="pt-8 pb-6 flex flex-col flex-grow">
          {/* Original image size */}
          <div className="flex items-center justify-center mb-6 aspect-square w-full max-w-[144px] mx-auto">
            <div className="relative w-full h-0 pb-[100%] rounded-full bg-[#09403A]/5">
              {categorie.image ? (
                <img 
                  src={categorie.image} 
                  alt={categorie.nom}
                  className="absolute inset-0 w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : icon ? (
                <div className="absolute inset-0 rounded-full bg-[#09403A] flex items-center justify-center p-5">
                  {icon}
                </div>
              ) : (
                <div className="absolute inset-0 rounded-full bg-[#09403A] flex items-center justify-center">
                  <span className="text-white font-bold text-5xl">
                    {categorie.nom.charAt(0)}
                  </span>
                </div>
              )}
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-[3px] border-[#0A554D]/20 pointer-events-none" />
            </div>
          </div>
          
          {/* Original title size */}
          <div className="min-h-[72px] max-h-[72px] flex items-center justify-center mb-4">
            <h3 className="text-2xl font-bold text-center text-[#09403A] line-clamp-2">
              {categorie.nom}
            </h3>
          </div>
          
          {/* Original subcategories size */}
          <div className="flex-grow min-h-[60px] max-h-[100px] overflow-hidden">
            <div className="space-y-3 text-gray-600 text-base h-full">
              {sousCategories.slice(0, 3).map((sousCat, index) => (
                <div key={index} className="flex items-center h-6">
                  <CheckCircle className="w-5 h-5 mr-3 text-[#0A554D] flex-shrink-0" />
                  <span className="truncate">{sousCat}</span>
                </div>
              ))}
              {sousCategories.length > 3 && (
                <div className="h-6 mt-3">
                  <p className="text-[#0A554D] text-base font-medium">
                    + {sousCategories.length - 3} autres services
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        {/* Original footer size */}
        <CardFooter className="border-t border-[#09403A]/10 p-0 h-16 flex-shrink-0">
          <Link 
            to={`/categories/${categorie.id}`}
            className="w-full h-full px-6 flex items-center justify-between hover:bg-[#F5F5F5] transition-colors group-hover:bg-[#F5F5F5]/50"
            aria-label={`Explorer ${categorie.nom}`}
          >
            <span className="font-semibold text-lg text-[#09403A] group-hover:text-[#0A554D]">
              Voir les services
            </span>
            <ChevronRight className="w-6 h-6 text-[#0A554D] group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
};