import HomeHeader from "@/components/HomeHeader/HomeHeader";
import GridCard from "@/components/GridCard/GridCard";
import { APP_TAGLINE } from "@/utils/constants";
import { useHomeLogic } from "./Home.logic";
import "./Home.scss";

// Landing page: shows the homepage-only header + searchable grid of tiles
const Home = () => {
  const { searchValue, setSearchValue, filteredItems } = useHomeLogic();

  return (
    <div className="home-page">
      <HomeHeader searchValue={searchValue} onSearchChange={setSearchValue} />

      <main className="home-page-content">
        <p className="home-page-tagline">{APP_TAGLINE}</p>

        {(filteredItems.length > 0) ? (
          <div className="home-page-grid">
            {filteredItems.map((item, index) => (
              <GridCard key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : (
          // Empty state: tells the user what happened and how to recover
          <div className="home-page-empty">
            <p>No components match “{searchValue}”.</p>
            <span>Try a different keyword or clear the search.</span>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
