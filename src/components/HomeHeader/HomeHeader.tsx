import { TerminalSquare } from "lucide-react";
import { APP_NAME, GITHUB_URL } from "@/utils/constants";
import SearchBar from "../SearchBar/SearchBar";
import GithubIcon from "./GithubIcon";
import type { HomeHeaderProps } from "./HomeHeader.types";
import "./HomeHeader.scss";

// Rendered ONLY on the homepage: logo + name, centered search, GitHub link
const HomeHeader = ({ searchValue, onSearchChange }: HomeHeaderProps) => {
  return (
    <header className="home-header">
      <div className="home-header-row">
        {/* Logo + app name */}
        <div className="home-header-brand">
          <span className="home-header-logo">
            <TerminalSquare size={22} />
          </span>
          <span className="home-header-name">{APP_NAME}</span>
        </div>

        {/* Centered search bar filters the homepage grid */}
        <div className="home-header-search">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search components..."
          />
        </div>

        {/* External link to the project's GitHub repo */}
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="home-header-github"
          aria-label="View source on GitHub"
        >
          <GithubIcon size={22} />
        </a>
      </div>
    </header>
  );
};

export default HomeHeader;
