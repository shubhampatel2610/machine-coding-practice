import { Star } from "lucide-react";
import PageHeader from "@/components/PageHeader/PageHeader";
import { useStarRatingLogic } from "./StarRating.logic";
import "./StarRating.scss";

// Hover-preview + click-to-select star rating widget
const StarRating = () => {
  const { totalStars, rating, setRating, setHoverValue, displayValue } = useStarRatingLogic();

  return (
    <div className="page-shell">
      <PageHeader title="Star Rating" />

      <main className="star-rating">
        <div
          className="star-rating-stars"
          onMouseLeave={() => setHoverValue(0)}
          role="radiogroup"
          aria-label="Star rating"
        >
          {Array.from({ length: totalStars }, (_, index) => {
            const starValue = index + 1;
            const filled = starValue <= displayValue;
            return (
              <button
                key={starValue}
                className="star-rating-star"
                onMouseEnter={() => setHoverValue(starValue)}
                onClick={() => setRating(starValue)}
                aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
                role="radio"
                aria-checked={rating === starValue}
              >
                <Star size={34} fill={filled ? "currentColor" : "none"} />
              </button>
            );
          })}
        </div>

        <p className="star-rating-value">
          {rating > 0 ? `You rated ${rating} / ${totalStars}` : "Not rated yet"}
        </p>
      </main>
    </div>
  );
};

export default StarRating;
