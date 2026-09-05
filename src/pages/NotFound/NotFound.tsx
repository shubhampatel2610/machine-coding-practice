import PageHeader from "@/components/PageHeader/PageHeader";
import "./NotFound.scss";

// Fallback shown for any route not matched in AppRoutes
const NotFound = () => {
  return (
    <div className="page-shell">
      <PageHeader title="Not Found" />
      <main className="not-found">
        <p className="not-found-code">404</p>
        <p className="not-found-message">This page doesn't exist. Head back to explore the components.</p>
      </main>
    </div>
  );
};

export default NotFound;
