import type { FormEvent } from "react";
import { useState } from "react";
import { sampleIngredients } from "../data/sampleIngredients";
import type { InventoryItem } from "../models/types";
import { addInventoryItem } from "../services/inventoryService";
import { addDaysToLocalDate } from "../utils/expiry";

type AddInventoryItemFormProps = {
  onInventoryChange: (items: InventoryItem[]) => void;
};

function AddInventoryItemForm({
  onInventoryChange
}: AddInventoryItemFormProps) {
  const [ingredientId, setIngredientId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("个");
  const [storageLocation, setStorageLocation] = useState("冰箱");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const selectedIngredient = sampleIngredients.find(
      (ingredient) => ingredient.id === ingredientId
    );

    if (!selectedIngredient) {
      window.alert("请选择食材");
      return;
    }

    const numericQuantity = Number(quantity);

    if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
      window.alert("数量必须大于 0");
      return;
    }

    let finalExpiryDate = expiryDate;

    if (
      !finalExpiryDate &&
      purchaseDate &&
      selectedIngredient.defaultShelfLifeDays
    ) {
      finalExpiryDate = addDaysToLocalDate(
        purchaseDate,
        selectedIngredient.defaultShelfLifeDays
      );
    }

    const newItem: InventoryItem = {
      id: `inv_${Date.now()}`,
      ingredientId: selectedIngredient.id,
      name: selectedIngredient.name,
      quantity: numericQuantity,
      unit,
      storageLocation,
      purchaseDate,
      expiryDate: finalExpiryDate
    };

    const updatedInventory = addInventoryItem(newItem);
    onInventoryChange(updatedInventory);

    setIngredientId("");
    setQuantity("1");
    setUnit("个");
    setStorageLocation("冰箱");
    setPurchaseDate("");
    setExpiryDate("");
  }

  return (
    <form className="add-inventory-form" onSubmit={handleSubmit}>
      <h2>添加食材</h2>

      <label>
        食材
        <select
          value={ingredientId}
          onChange={(event) => setIngredientId(event.target.value)}
        >
          <option value="">请选择食材</option>
          {sampleIngredients.map((ingredient) => (
            <option key={ingredient.id} value={ingredient.id}>
              {ingredient.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        数量
        <input
          type="number"
          min="0"
          step="0.1"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
      </label>

      <label>
        单位
        <input
          type="text"
          value={unit}
          onChange={(event) => setUnit(event.target.value)}
        />
      </label>

      <label>
        存放位置
        <input
          type="text"
          value={storageLocation}
          onChange={(event) => setStorageLocation(event.target.value)}
        />
      </label>

      <label>
        购买日期
        <input
          type="date"
          value={purchaseDate}
          onChange={(event) => setPurchaseDate(event.target.value)}
        />
      </label>

      <label>
        过期日期
        <input
          type="date"
          value={expiryDate}
          onChange={(event) => setExpiryDate(event.target.value)}
        />
      </label>

      <button type="submit">添加到库存</button>
    </form>
  );
}

export default AddInventoryItemForm;
