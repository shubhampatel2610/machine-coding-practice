import { ArrowLeft, Home, Play } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { GRID_ITEMS } from "@/utils/constants";
import type { PageHeaderProps } from "./PageHeader.types";
import "./PageHeader.scss";

// Reused by every machine-coding page - only shows back/home nav + title
const PageHeader = ({ title }: PageHeaderProps) => {
  const location = useLocation();
  const currentItem = GRID_ITEMS.find((item) => item.route === location.pathname);

  return (
    <header className="page-header">
      <div className="page-header-inner">
        {/* Back button always returns to the homepage grid */}
        <Link to="/" className="page-header-nav-btn" aria-label="Back to home">
          <ArrowLeft size={18} />
          <span>Back</span>
        </Link>

        <h1 className="page-header-title">{title}</h1>

        <div className="page-header-actions">
          {/* {currentItem && (
            <Link to={`/playground/${currentItem.id}`} className="page-header-nav-btn page-header-playground-btn">
              <Play size={16} />
              <span>Playground</span>
            </Link>
          )} */}
          <Link to="/" className="page-header-nav-btn page-header-nav-btn-icon-only" aria-label="Go to home">
            <Home size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
