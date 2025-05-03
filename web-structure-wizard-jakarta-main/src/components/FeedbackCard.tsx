import { Feedback } from "@/types/models";

interface FeedbackCardProps {
  feedback: Feedback;
}

const FeedbackCard = ({ feedback }: FeedbackCardProps) => {
  return (
    <div className="feedback-card bg-gray-100 p-4 rounded shadow-sm">
      <p className="text-sm text-gray-800 mb-2">Note: {feedback.note}/5</p>
      <p className="text-gray-700 italic">"{feedback.commentaire}"</p>
      <p className="text-xs text-gray-500 mt-2">
        Demandeur ID: {feedback.demandeurId} | Service ID: {feedback.serviceId}
      </p>
    </div>
  );
};

export default FeedbackCard;
