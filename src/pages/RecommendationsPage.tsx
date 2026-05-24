import { useEffect, useState } from "react";
import type {
  InventoryItem,
  Recipe,
  RecipeRecommendation
} from "../models/types";
import {
  canCookRecipe,
  consumeInventoryForRecipe,
  getInventory,
  getMissingRequiredIngredientsForRecipe
} from "../services/inventoryService";
import { getAllRecipes } from "../services/recipeService";
import { matchRecipes } from "../services/recommendationService";
import { addMissingIngredientsToShoppingList } from "../services/shoppingListService";

function RecommendationsPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [recommendations, setRecommendations] = useState<
    RecipeRecommendation[]
  >([]);

  function refreshRecommendations() {
    const currentInventory = getInventory();
    const currentRecommendations = matchRecipes(currentInventory, getAllRecipes());

    setInventory(currentInventory);
    setRecommendations(currentRecommendations);
  }

  function handleConsumeInventory(recipe: Recipe) {
    const confirmed = window.confirm("确定已完成这道菜并扣减库存吗？");

    if (!confirmed) {
      return;
    }

    const currentInventory = getInventory();

    if (!canCookRecipe(recipe, currentInventory)) {
      window.alert("库存不足，无法扣减。");
      refreshRecommendations();
      return;
    }

    const updatedInventory = consumeInventoryForRecipe(recipe);
    const updatedRecommendations = matchRecipes(updatedInventory, getAllRecipes());

    setInventory(updatedInventory);
    setRecommendations(updatedRecommendations);
    window.alert("库存已更新。");
  }

  function handleAddMissingIngredientsToShoppingList(recipe: Recipe) {
    const currentInventory = getInventory();
    const missingRequiredIngredients = getMissingRequiredIngredientsForRecipe(
      recipe,
      currentInventory
    );

    if (missingRequiredIngredients.length === 0) {
      window.alert("所需食材已齐全。");
      refreshRecommendations();
      return;
    }

    addMissingIngredientsToShoppingList(missingRequiredIngredients);
    refreshRecommendations();
    window.alert("已加入购物清单。");
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
          {recommendations.map((recommendation) => {
            const recipe = getAllRecipes().find(
              (currentRecipe) => currentRecipe.id === recommendation.recipeId
            );

            return (
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

                <div className="button-row">
                  {recommendation.matchRate === 100 && recipe ? (
                    <button
                      type="button"
                      onClick={() => handleConsumeInventory(recipe)}
                    >
                      做完并扣减库存
                    </button>
                  ) : null}

                  {recommendation.missingIngredients.length > 0 && recipe ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleAddMissingIngredientsToShoppingList(recipe)
                      }
                    >
                      加入购物清单
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default RecommendationsPage;
