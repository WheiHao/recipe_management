import type { InventoryItem } from "../models/types";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { addDaysToLocalDate, formatLocalDate } from "../utils/expiry";

const INVENTORY_STORAGE_KEY = "kitchen_inventory";

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
