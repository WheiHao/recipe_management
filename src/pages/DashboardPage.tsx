import { useEffect, useState } from "react";
import { sampleRecipes } from "../data/sampleRecipes";
import type { InventoryItem, RecipeRecommendation } from "../models/types";
import { getInventory } from "../services/inventoryService";
import { matchRecipes } from "../services/recommendationService";
import { getExpiryLabel, isExpiringSoon } from "../utils/expiry";

function DashboardPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [expiringSoonItems, setExpiringSoonItems] = useState<InventoryItem[]>(
    []
  );
  const [topRecommendations, setTopRecommendations] = useState<
    RecipeRecommendation[]
  >([]);

  function refreshDashboard() {
    const currentInventory = getInventory();
    const currentExpiringSoonItems = currentInventory.filter((item) =>
      isExpiringSoon(item.expiryDate)
    );
    const currentRecommendations = matchRecipes(
      currentInventory,
      sampleRecipes
    ).slice(0, 3);

    setInventory(currentInventory);
    setExpiringSoonItems(currentExpiringSoonItems);
    setTopRecommendations(currentRecommendations);
  }

  useEffect(() => {
    refreshDashboard();
  }, []);

  return (
    <section className="dashboard-page">
      <h1>首页</h1>

      <button type="button" onClick={refreshDashboard}>
        刷新首页
      </button>

      <section className="dashboard-section">
        <h2>即将过期食材</h2>

        {expiringSoonItems.length === 0 ? (
          <p>暂无即将过期食材</p>
        ) : (
          <div className="dashboard-card-list">
            {expiringSoonItems.map((item) => (
              <article className="dashboard-card" key={item.id}>
                <h3>{item.name}</h3>
                <p>
                  {item.quantity} {item.unit}
                </p>
                <p>{getExpiryLabel(item.expiryDate)}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <h2>库存概览</h2>

        <p>当前库存种类：{inventory.length}</p>

        {inventory.length === 0 ? (
          <p>暂无库存，请先添加食材</p>
        ) : (
          <p>食材：{inventory.map((item) => item.name).join("、")}</p>
        )}
      </section>

      <section className="dashboard-section">
        <h2>今日推荐菜谱</h2>

        {inventory.length === 0 ? (
          <p>添加食材后将显示推荐菜谱</p>
        ) : (
          <div className="dashboard-card-list">
            {topRecommendations.map((recommendation) => (
              <article
                className="dashboard-card"
                key={recommendation.recipeId}
              >
                <h3>{recommendation.recipeName}</h3>
                <p>匹配度：{recommendation.matchRate}%</p>
                <p>
                  缺少：
                  {recommendation.missingIngredients.length > 0
                    ? recommendation.missingIngredients.join("、")
                    : "无"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default DashboardPage;
