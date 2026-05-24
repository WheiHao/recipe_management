import type {
  InventoryItem,
  Recipe,
  RecipeRecommendation
} from "../models/types";
import { isExpiringSoon } from "../utils/expiry";

export function matchRecipes(
  inventory: InventoryItem[],
  recipes: Recipe[]
): RecipeRecommendation[] {
  const inventoryByIngredientId = new Map<string, InventoryItem[]>();

  for (const item of inventory) {
    const existingItems = inventoryByIngredientId.get(item.ingredientId) ?? [];
    inventoryByIngredientId.set(item.ingredientId, [...existingItems, item]);
  }

  const recommendations = recipes.map((recipe) => {
    const requiredIngredients = recipe.ingredients.filter(
      (ingredient) => ingredient.required
    );

    const availableIngredients: string[] = [];
    const missingIngredients: string[] = [];
    const usesExpiringItems: string[] = [];

    for (const recipeIngredient of requiredIngredients) {
      const matchingInventoryItems = inventoryByIngredientId.get(
        recipeIngredient.ingredientId
      );
      const availableQuantity =
        matchingInventoryItems?.reduce((total, item) => total + item.quantity, 0) ??
        0;
      const hasEnoughQuantity =
        recipeIngredient.quantity === undefined ||
        availableQuantity >= recipeIngredient.quantity;

      if (
        matchingInventoryItems &&
        matchingInventoryItems.length > 0 &&
        hasEnoughQuantity
      ) {
        availableIngredients.push(recipeIngredient.name);

        if (
          matchingInventoryItems.some((item) => isExpiringSoon(item.expiryDate))
        ) {
          usesExpiringItems.push(recipeIngredient.name);
        }
      } else {
        missingIngredients.push(recipeIngredient.name);
      }
    }

    const matchRate =
      requiredIngredients.length === 0
        ? 0
        : Math.round(
            (availableIngredients.length / requiredIngredients.length) * 100
          );

    return {
      recipeId: recipe.id,
      recipeName: recipe.name,
      matchRate,
      availableIngredients,
      missingIngredients,
      usesExpiringItems
    };
  });

  return recommendations.sort((a, b) => {
    if (b.usesExpiringItems.length !== a.usesExpiringItems.length) {
      return b.usesExpiringItems.length - a.usesExpiringItems.length;
    }

    if (b.matchRate !== a.matchRate) {
      return b.matchRate - a.matchRate;
    }

    if (a.missingIngredients.length !== b.missingIngredients.length) {
      return a.missingIngredients.length - b.missingIngredients.length;
    }

    return a.recipeName.localeCompare(b.recipeName);
  });
}
