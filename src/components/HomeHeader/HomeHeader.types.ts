// Props for the homepage-only header (logo + search + github link)
export interface HomeHeaderProps {
  searchValue: string; // current search text (controlled by Home page)
  onSearchChange: (value: string) => void; // called on every keystroke
}
