import { useState } from "react";

// Tracks the confirmed rating and the currently-hovered preview value
export const useStarRatingLogic = (totalStars = 5) => {
  const [rating, setRating] = useState(0);
  const [hoverValue, setHoverValue] = useState(0);

  // The value to render: hover preview takes priority over the saved rating
  const displayValue = hoverValue || rating;

  return { totalStars, rating, setRating, hoverValue, setHoverValue, displayValue };
};
