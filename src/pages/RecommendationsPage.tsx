import { useEffect, useState } from "react";
import { sampleRecipes } from "../data/sampleRecipes";
import type { InventoryItem, RecipeRecommendation } from "../models/types";
import { getInventory } from "../services/inventoryService";
import { matchRecipes } from "../services/recommendationService";

function RecommendationsPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [recommendations, setRecommendations] = useState<
    RecipeRecommendation[]
  >([]);

  function refreshRecommendations() {
    const currentInventory = getInventory();
    const currentRecommendations = matchRecipes(
      currentInventory,
      sampleRecipes
    );

    setInventory(currentInventory);
    setRecommendations(currentRecommendations);
  }

  useEffect(() => {
    refreshRecommendations();
  }, []);

  return (
    <section className="recommendations-page">
      <h1>推荐</h1>

      <button type="button" onClick={refreshRecommendations}>
        重新计算推荐
      </button>

      {inventory.length === 0 ? (
        <p className="recommendation-empty">暂无库存，请先添加食材</p>
      ) : (
        <div className="recommendation-list">
          {recommendations.map((recommendation) => (
            <article
              className="recommendation-card"
              key={recommendation.recipeId}
            >
              <h2>{recommendation.recipeName}</h2>

              <p>匹配度：{recommendation.matchRate}%</p>

              <p>
                已有：
                {recommendation.availableIngredients.length > 0
                  ? recommendation.availableIngredients.join("、")
                  : "无"}
              </p>

              <p>
                缺少：
                {recommendation.missingIngredients.length > 0
                  ? recommendation.missingIngredients.join("、")
                  : "无"}
              </p>

              <p>
                使用快过期食材：
                {recommendation.usesExpiringItems.length > 0
                  ? recommendation.usesExpiringItems.join("、")
                  : "无"}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecommendationsPage;
