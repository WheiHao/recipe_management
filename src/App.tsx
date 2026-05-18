import { useState } from "react";
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import RecipesPage from "./pages/RecipesPage";
import RecommendationsPage from "./pages/RecommendationsPage";

type AppPage = "dashboard" | "inventory" | "recipes" | "recommendations";

const navItems: Array<{
  id: AppPage;
  label: string;
}> = [
  { id: "dashboard", label: "首页" },
  { id: "inventory", label: "库存" },
  { id: "recipes", label: "菜谱" },
  { id: "recommendations", label: "推荐" }
];

function renderPage(activePage: AppPage) {
  switch (activePage) {
    case "dashboard":
      return <DashboardPage />;
    case "inventory":
      return <InventoryPage />;
    case "recipes":
      return <RecipesPage />;
    case "recommendations":
      return <RecommendationsPage />;
  }
}

export default function App() {
  const [activePage, setActivePage] = useState<AppPage>("dashboard");

  return (
    <div className="app-shell">
      <main className="app-main">{renderPage(activePage)}</main>

      <nav className="bottom-nav" aria-label="主导航">
        {navItems.map((item) => (
          <button
            className={activePage === item.id ? "active" : undefined}
            key={item.id}
            type="button"
            onClick={() => setActivePage(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
