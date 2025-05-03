
import { Link } from "react-router-dom";
import { Categorie } from "@/types/models";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface CategorieCardProps {
  categorie: Categorie;
  sousCategories: string[];
}

export const CategorieCard: React.FC<CategorieCardProps> = ({ 
  categorie, 
  sousCategories 
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold text-center mb-4">{categorie.nom}</h3>
        <div className="text-gray-600 text-sm">
          {sousCategories.slice(0, 3).map((sousCat, index) => (
            <p key={index} className="mb-1">{sousCat}</p>
          ))}
          {sousCategories.length > 3 && (
            <p className="text-blue-600">+ {sousCategories.length - 3} autres</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Link 
          to={`/categories/${categorie.id}`} 
          className="w-full"
        >
          <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
            Explorer
          </button>
        </Link>
      </CardFooter>
    </Card>
  );
};
