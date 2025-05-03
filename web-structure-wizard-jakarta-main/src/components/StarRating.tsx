
import { StarIcon } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  max = 5 
}) => {
  return (
    <div className="flex items-center">
      {[...Array(max)].map((_, i) => (
        <StarIcon
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};
