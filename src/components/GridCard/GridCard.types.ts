import type { GridItem } from "@/utils/interfaces.types";

// Props for a single homepage grid tile
export interface GridCardProps {
  item: GridItem; // the grid item's data (name, route, tag, etc.)
  index: number; // position in the (filtered) list, used for the mono badge
}
