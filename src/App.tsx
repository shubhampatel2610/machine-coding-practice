import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes";

// Root component: sets up client-side routing for the whole app
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
