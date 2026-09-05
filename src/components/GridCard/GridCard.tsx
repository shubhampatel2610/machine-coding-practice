import { Link } from "react-router-dom";
import type { GridCardProps } from "./GridCard.types";
import "./GridCard.scss";

// Button-like tile rendered in the homepage grid; navigates to `item.route`
const GridCard = ({ item, index }: GridCardProps) => {
  // Zero-padded index used as the mono "file id" badge, e.g. 01, 02...
  const paddedIndex = String(index + 1).padStart(2, "0");

  return (
    <Link to={item.route} className="grid-card">
      {/* IDE-style window chrome - the tile's signature visual detail */}
      <div className="grid-card-chrome">
        <span className="grid-card-dot grid-card-dot-rose" />
        <span className="grid-card-dot grid-card-dot-amber" />
        <span className="grid-card-dot grid-card-dot-mint" />
        <span className="grid-card-index">#{paddedIndex}</span>
      </div>

      <div className="grid-card-body">
        <h2 className="grid-card-name">{item.name}</h2>
        <p className="grid-card-description">{item.description}</p>
      </div>

      <div className="grid-card-footer">
        <span className="grid-card-tag">{item.tag}</span>
      </div>
    </Link>
  );
};

export default GridCard;
