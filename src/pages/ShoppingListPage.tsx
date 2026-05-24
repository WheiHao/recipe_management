import { useEffect, useState } from "react";
import type { ShoppingListItem } from "../models/types";
import {
  addCheckedShoppingListItemsToInventory,
  clearShoppingList,
  deleteShoppingListItem,
  getShoppingList,
  toggleShoppingListItem
} from "../services/shoppingListService";

function ShoppingListPage() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

  useEffect(() => {
    setShoppingList(getShoppingList());
  }, []);

  function handleToggleItem(id: string) {
    const updatedShoppingList = toggleShoppingListItem(id);
    setShoppingList(updatedShoppingList);
  }

  function handleDeleteItem(id: string) {
    const updatedShoppingList = deleteShoppingListItem(id);
    setShoppingList(updatedShoppingList);
  }

  function handleClearCheckedItems() {
    if (!shoppingList.some((item) => item.checked)) {
      window.alert("请先勾选已购买的物品。");
      return;
    }

    const updatedShoppingList = addCheckedShoppingListItemsToInventory();
    setShoppingList(updatedShoppingList);
    window.alert("已加入库存。");
  }

  function handleClearShoppingList() {
    const confirmed = window.confirm("确定要清空购物清单吗？");

    if (!confirmed) {
      return;
    }

    const updatedShoppingList = clearShoppingList();
    setShoppingList(updatedShoppingList);
  }

  return (
    <section className="shopping-list-page">
      <h1>购物清单</h1>

      <div className="button-row">
        <button type="button" onClick={handleClearCheckedItems}>
          清除已购买
        </button>
        <button type="button" onClick={handleClearShoppingList}>
          清空购物清单
        </button>
      </div>

      {shoppingList.length === 0 ? (
        <p className="shopping-list-empty">暂无购物清单</p>
      ) : (
        <div className="shopping-list">
          {shoppingList.map((item) => (
            <article className="shopping-list-card" key={item.id}>
              <label className="shopping-list-item">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggleItem(item.id)}
                />
                <span>
                  <strong>{item.name}</strong>
                  {item.quantity !== undefined ? (
                    <span className="shopping-list-quantity">
                      {item.quantity} {item.unit ?? ""}
                    </span>
                  ) : null}
                </span>
              </label>

              <button type="button" onClick={() => handleDeleteItem(item.id)}>
                删除
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ShoppingListPage;
