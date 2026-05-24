import type { ShoppingListItem } from "../models/types";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { addInventoryItem } from "./inventoryService";
import { formatLocalDate } from "../utils/expiry";

const SHOPPING_LIST_STORAGE_KEY = "kitchen_shopping_list";

type MissingIngredient = {
  ingredientId: string;
  name: string;
  quantity?: number;
  unit?: string;
};

export function getShoppingList(): ShoppingListItem[] {
  const storedShoppingList = loadFromStorage<unknown>(
    SHOPPING_LIST_STORAGE_KEY,
    []
  );

  return Array.isArray(storedShoppingList)
    ? (storedShoppingList as ShoppingListItem[])
    : [];
}

export function saveShoppingList(items: ShoppingListItem[]): void {
  saveToStorage(SHOPPING_LIST_STORAGE_KEY, items);
}

export function addShoppingListItem(
  item: ShoppingListItem
): ShoppingListItem[] {
  const shoppingList = getShoppingList();
  const updatedShoppingList = [...shoppingList, item];

  saveShoppingList(updatedShoppingList);

  return updatedShoppingList;
}

export function addMissingIngredientsToShoppingList(
  ingredients: MissingIngredient[]
): ShoppingListItem[] {
  const shoppingList = getShoppingList();
  const existingIngredientIds = new Set(
    shoppingList.map((item) => item.ingredientId)
  );
  const createdAt = new Date().toISOString();
  const newItems: ShoppingListItem[] = [];

  for (const ingredient of ingredients) {
    if (existingIngredientIds.has(ingredient.ingredientId)) {
      continue;
    }

    existingIngredientIds.add(ingredient.ingredientId);
    newItems.push({
      id: `shop_${Date.now()}_${ingredient.ingredientId}`,
      ingredientId: ingredient.ingredientId,
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      checked: false,
      createdAt
    });
  }

  const updatedShoppingList = [...shoppingList, ...newItems];

  saveShoppingList(updatedShoppingList);

  return updatedShoppingList;
}

export function toggleShoppingListItem(id: string): ShoppingListItem[] {
  const shoppingList = getShoppingList();
  const updatedShoppingList = shoppingList.map((item) =>
    item.id === id
      ? {
          ...item,
          checked: !item.checked
        }
      : item
  );

  saveShoppingList(updatedShoppingList);

  return updatedShoppingList;
}

export function deleteShoppingListItem(id: string): ShoppingListItem[] {
  const shoppingList = getShoppingList();
  const updatedShoppingList = shoppingList.filter((item) => item.id !== id);

  saveShoppingList(updatedShoppingList);

  return updatedShoppingList;
}

export function clearCheckedShoppingListItems(): ShoppingListItem[] {
  const shoppingList = getShoppingList();
  const updatedShoppingList = shoppingList.filter((item) => !item.checked);

  saveShoppingList(updatedShoppingList);

  return updatedShoppingList;
}

export function addCheckedShoppingListItemsToInventory(): ShoppingListItem[] {
  const shoppingList = getShoppingList();
  const checkedItems = shoppingList.filter((item) => item.checked);
  const purchaseDate = formatLocalDate(new Date());

  for (const item of checkedItems) {
    addInventoryItem({
      id: `inv_${Date.now()}_${item.ingredientId}`,
      ingredientId: item.ingredientId,
      name: item.name,
      quantity: item.quantity ?? 1,
      unit: item.unit ?? "份",
      storageLocation: "",
      purchaseDate,
      expiryDate: ""
    });
  }

  return clearCheckedShoppingListItems();
}

export function clearShoppingList(): ShoppingListItem[] {
  saveShoppingList([]);
  return [];
}
