import { sampleRecipes } from "../data/sampleRecipes";
import type { Recipe } from "../models/types";
import { loadFromStorage, saveToStorage } from "../utils/storage";

const CUSTOM_RECIPES_STORAGE_KEY = "kitchen_custom_recipes";

export function getCustomRecipes(): Recipe[] {
  const storedRecipes = loadFromStorage<unknown>(
    CUSTOM_RECIPES_STORAGE_KEY,
    []
  );

  return Array.isArray(storedRecipes)
    ? (storedRecipes as Recipe[]).map((recipe) => ({
        ...recipe,
        source: "custom"
      }))
    : [];
}

export function saveCustomRecipes(recipes: Recipe[]): void {
  saveToStorage(
    CUSTOM_RECIPES_STORAGE_KEY,
    recipes.map((recipe) => ({
      ...recipe,
      source: "custom" as const
    }))
  );
}

export function addCustomRecipe(recipe: Recipe): Recipe[] {
  const customRecipes = getCustomRecipes();
  const updatedRecipes = [
    ...customRecipes,
    {
      ...recipe,
      source: "custom" as const
    }
  ];

  saveCustomRecipes(updatedRecipes);

  return updatedRecipes;
}

export function updateCustomRecipe(
  id: string,
  updates: Partial<Recipe>
): Recipe[] {
  const customRecipes = getCustomRecipes();
  const updatedRecipes = customRecipes.map((recipe) =>
    recipe.id === id
      ? {
          ...recipe,
          ...updates,
          id: recipe.id,
          source: "custom" as const
        }
      : recipe
  );

  saveCustomRecipes(updatedRecipes);

  return updatedRecipes;
}

export function deleteCustomRecipe(id: string): Recipe[] {
  const customRecipes = getCustomRecipes();
  const updatedRecipes = customRecipes.filter((recipe) => recipe.id !== id);

  saveCustomRecipes(updatedRecipes);

  return updatedRecipes;
}

export function getAllRecipes(): Recipe[] {
  return [
    ...sampleRecipes.map((recipe) => ({
      ...recipe,
      source: "sample" as const
    })),
    ...getCustomRecipes()
  ];
}
