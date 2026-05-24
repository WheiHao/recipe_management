import type { InventoryItem, Recipe } from "../models/types";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { addDaysToLocalDate, formatLocalDate } from "../utils/expiry";

const INVENTORY_STORAGE_KEY = "kitchen_inventory";

type MissingRecipeIngredient = {
  ingredientId: string;
  name: string;
  quantity?: number;
  unit?: string;
};

export function getInventory(): InventoryItem[] {
  const storedInventory = loadFromStorage<unknown>(INVENTORY_STORAGE_KEY, []);

  return Array.isArray(storedInventory)
    ? (storedInventory as InventoryItem[])
    : [];
}

export function saveInventory(items: InventoryItem[]): void {
  saveToStorage(INVENTORY_STORAGE_KEY, items);
}

export function loadSampleInventory(): InventoryItem[] {
  const today = new Date();
  const purchaseDate = formatLocalDate(today);

  const sampleInventory: InventoryItem[] = [
    {
      id: "inv_sample_egg",
      ingredientId: "ingredient-egg",
      name: "鸡蛋",
      quantity: 6,
      unit: "个",
      storageLocation: "冰箱",
      purchaseDate,
      expiryDate: addDaysToLocalDate(purchaseDate, 14)
    },
    {
      id: "inv_sample_tomato",
      ingredientId: "ingredient-tomato",
      name: "番茄",
      quantity: 3,
      unit: "个",
      storageLocation: "冰箱",
      purchaseDate,
      expiryDate: addDaysToLocalDate(purchaseDate, 2)
    },
    {
      id: "inv_sample_milk",
      ingredientId: "ingredient-milk",
      name: "牛奶",
      quantity: 1,
      unit: "瓶",
      storageLocation: "冰箱",
      purchaseDate,
      expiryDate: addDaysToLocalDate(purchaseDate, 1)
    },
    {
      id: "inv_sample_carrot",
      ingredientId: "ingredient-carrot",
      name: "胡萝卜",
      quantity: 2,
      unit: "根",
      storageLocation: "冰箱",
      purchaseDate,
      expiryDate: addDaysToLocalDate(purchaseDate, 5)
    }
  ];

  saveInventory(sampleInventory);

  return sampleInventory;
}

export function clearInventory(): InventoryItem[] {
  saveInventory([]);
  return [];
}

export function addInventoryItem(item: InventoryItem): InventoryItem[] {
  const inventory = getInventory();
  const updatedInventory = [...inventory, item];

  saveInventory(updatedInventory);

  return updatedInventory;
}

export function updateInventoryItem(
  id: string,
  updates: Partial<InventoryItem>
): InventoryItem[] {
  const inventory = getInventory();

  const updatedInventory = inventory.map((item) =>
    item.id === id
      ? {
          ...item,
          ...updates
        }
      : item
  );

  saveInventory(updatedInventory);

  return updatedInventory;
}

export function deleteInventoryItem(id: string): InventoryItem[] {
  const inventory = getInventory();
  const updatedInventory = inventory.filter((item) => item.id !== id);

  saveInventory(updatedInventory);

  return updatedInventory;
}

export function canCookRecipe(
  recipe: Recipe,
  inventory: InventoryItem[]
): boolean {
  return recipe.ingredients
    .filter((ingredient) => ingredient.required)
    .every((recipeIngredient) => {
      const matchingInventoryItems = inventory.filter(
        (item) => item.ingredientId === recipeIngredient.ingredientId
      );

      if (matchingInventoryItems.length === 0) {
        return false;
      }

      if (recipeIngredient.quantity === undefined) {
        return true;
      }

      const availableQuantity = matchingInventoryItems.reduce(
        (total, item) => total + item.quantity,
        0
      );

      return availableQuantity >= recipeIngredient.quantity;
    });
}

export function getMissingRequiredIngredientsForRecipe(
  recipe: Recipe,
  inventory: InventoryItem[]
): MissingRecipeIngredient[] {
  return recipe.ingredients
    .filter((ingredient) => ingredient.required)
    .flatMap((recipeIngredient) => {
      const matchingInventoryItems = inventory.filter(
        (item) => item.ingredientId === recipeIngredient.ingredientId
      );
      const availableQuantity = matchingInventoryItems.reduce(
        (total, item) => total + item.quantity,
        0
      );

      if (recipeIngredient.quantity === undefined) {
        return matchingInventoryItems.length === 0
          ? [
              {
                ingredientId: recipeIngredient.ingredientId,
                name: recipeIngredient.name,
                unit: recipeIngredient.unit
              }
            ]
          : [];
      }

      const missingQuantity = recipeIngredient.quantity - availableQuantity;

      if (missingQuantity <= 0) {
        return [];
      }

      return [
        {
          ingredientId: recipeIngredient.ingredientId,
          name: recipeIngredient.name,
          quantity: missingQuantity,
          unit: recipeIngredient.unit
        }
      ];
    });
}

export function consumeInventoryForRecipe(recipe: Recipe): InventoryItem[] {
  const updatedInventory = [...getInventory()];
  const requiredIngredients = recipe.ingredients.filter(
    (ingredient) => ingredient.required
  );

  for (const recipeIngredient of requiredIngredients) {
    if (recipeIngredient.quantity === undefined) {
      continue;
    }

    let remainingQuantityToConsume = recipeIngredient.quantity;

    for (let index = 0; index < updatedInventory.length; index += 1) {
      const inventoryItem = updatedInventory[index];

      if (
        inventoryItem.ingredientId !== recipeIngredient.ingredientId ||
        remainingQuantityToConsume <= 0
      ) {
        continue;
      }

      const updatedQuantity =
        inventoryItem.quantity - remainingQuantityToConsume;

      if (updatedQuantity > 0) {
        updatedInventory[index] = {
          ...inventoryItem,
          quantity: updatedQuantity
        };
        remainingQuantityToConsume = 0;
      } else {
        remainingQuantityToConsume -= inventoryItem.quantity;
        updatedInventory.splice(index, 1);
        index -= 1;
      }
    }
  }

  saveInventory(updatedInventory);

  return updatedInventory;
}
