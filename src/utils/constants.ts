// ---------------------------------------------------------------------------
// Single source of truth for app-wide constants.
// Add a new machine-coding component? Register its route + grid card here -
// nothing else needs to change for it to show up on the homepage.
// ---------------------------------------------------------------------------

import type { GridItem } from "./interfaces.types";

// Basic app metadata used in header / tab title
export const APP_NAME = "Machine Coding";
export const APP_TAGLINE = "Practice hub for frontend machine-coding rounds";
export const GITHUB_URL = "https://github.com/";

// All homepage tiles. Each entry maps 1:1 to a route declared in
// `src/routes/AppRoutes.tsx` and a page component under `src/pages/`.
export const GRID_ITEMS: GridItem[] = [
  {
    id: "star-rating",
    name: "Star Rating",
    description: "Hover & click driven star rating widget",
    route: "/star-rating",
    tag: "UI",
  },
  {
    id: "nested-comments",
    name: "Nested Comments",
    description: "Recursive comment thread with replies",
    route: "/nested-comments",
    tag: "Recursion",
  },
];

// Local storage keys (centralised so no typos across files)
export const STORAGE_KEYS = {
  TODOS: "mc_todos",
};
