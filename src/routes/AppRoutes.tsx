import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home/Home";
import StarRating from "@/pages/StarRating/StarRating";
import NestedComments from "@/pages/NestedComments/NestedComments";
import NotFound from "@/pages/NotFound/NotFound";
import Playground from "@/pages/Playground/Playground";

// All routes live here - add a new <Route> when a new page/component is created.
// Paths must match the `route` field of the matching entry in utils/constants.ts.
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/star-rating" element={<StarRating />} />
      <Route path="/nested-comments" element={<NestedComments />} />
      <Route path="/playground/:componentId" element={<Playground />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
