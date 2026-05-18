export type Ingredient = {
  id: string;
  name: string;
  category: string;
  defaultShelfLifeDays?: number;
  aliases?: string[];
};

export type InventoryItem = {
  id: string;
  ingredientId: string;
  name: string;
  quantity: number;
  unit: string;
  storageLocation?: string;
  purchaseDate?: string;
  expiryDate?: string;
};

export type RecipeIngredient = {
  ingredientId: string;
  name: string;
  quantity?: number;
  unit?: string;
  required: boolean;
};

export type Recipe = {
  id: string;
  name: string;
  cookingTimeMinutes?: number;
  difficulty?: "easy" | "medium" | "hard";
  ingredients: RecipeIngredient[];
  steps: string[];
};

export type RecipeRecommendation = {
  recipeId: string;
  recipeName: string;
  matchRate: number;
  availableIngredients: string[];
  missingIngredients: string[];
  usesExpiringItems: string[];
};
