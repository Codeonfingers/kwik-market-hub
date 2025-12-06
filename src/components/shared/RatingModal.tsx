import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRatings } from "@/hooks/useRatings";

interface RatingModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  targetUserId: string;
  targetName: string;
  targetType: "vendor" | "shopper";
  onSuccess?: () => void;
}

const RatingModal = ({
  open,
  onClose,
  orderId,
  targetUserId,
  targetName,
  targetType,
  onSuccess,
}: RatingModalProps) => {
  const { createRating } = useRatings();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;

    setLoading(true);
    const { error } = await createRating(orderId, targetUserId, rating, comment || undefined);
    setLoading(false);

    if (!error) {
      onSuccess?.();
      onClose();
      setRating(0);
      setComment("");
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your {targetType === "vendor" ? "Vendor" : "Shopper"}</DialogTitle>
          <DialogDescription>
            How was your experience with {targetName}?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Star Rating */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= displayRating
                        ? "fill-gold text-gold"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            <p className="text-lg font-medium">
              {displayRating === 0 && "Tap to rate"}
              {displayRating === 1 && "Poor"}
              {displayRating === 2 && "Fair"}
              {displayRating === 3 && "Good"}
              {displayRating === 4 && "Very Good"}
              {displayRating === 5 && "Excellent!"}
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Comment (optional)</Label>
            <Textarea
              id="comment"
              placeholder="Share more about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            variant="hero"
            className="w-full"
            onClick={handleSubmit}
            disabled={rating === 0 || loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Rating"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
