import { useMemo, useState } from "react";
import { GRID_ITEMS } from "@/utils/constants";
import { matchesSearch } from "@/utils/helpers";

// Encapsulates the homepage's search state + derived filtered list
export const useHomeLogic = () => {
  const [searchValue, setSearchValue] = useState("");

  // Recompute filtered items only when the search text actually changes
  const filteredItems = useMemo(
    () =>
      GRID_ITEMS.filter(
        (item) =>
          matchesSearch(item.name, searchValue) ||
          matchesSearch(item.tag, searchValue)
      ),
    [searchValue]
  );

  return { searchValue, setSearchValue, filteredItems };
};
