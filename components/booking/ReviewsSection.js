import { Card } from "@/components/ui/card";
import { FiStar } from "react-icons/fi";

const ReviewsSection = ({ activity }) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Customer Reviews</h2>
          <div className="flex items-center gap-2">
            <FiStar className="text-yellow-400 fill-current" />
            <span className="font-semibold">4.8</span>
            <span className="text-gray-500">(123 reviews)</span>
          </div>
        </div>
        
        <div className="text-center py-8 text-gray-500">
          Reviews coming soon
        </div>
      </div>
    </Card>
  );
};

export default ReviewsSection;
