import { useEffect, useState } from "react";
import AddInventoryItemForm from "../components/AddInventoryItemForm";
import type { InventoryItem } from "../models/types";
import {
  clearInventory,
  deleteInventoryItem,
  getInventory,
  loadSampleInventory,
  updateInventoryItem
} from "../services/inventoryService";
import { getExpiryLabel } from "../utils/expiry";

function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [editStorageLocation, setEditStorageLocation] = useState("");
  const [editExpiryDate, setEditExpiryDate] = useState("");

  useEffect(() => {
    setInventory(getInventory());
  }, []);

  function startEditing(item: InventoryItem) {
    setEditingItemId(item.id);
    setEditQuantity(String(item.quantity));
    setEditUnit(item.unit);
    setEditStorageLocation(item.storageLocation ?? "");
    setEditExpiryDate(item.expiryDate ?? "");
  }

  function cancelEditing() {
    setEditingItemId(null);
    setEditQuantity("");
    setEditUnit("");
    setEditStorageLocation("");
    setEditExpiryDate("");
  }

  function handleSaveEdit(item: InventoryItem) {
    const numericQuantity = Number(editQuantity);

    if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
      window.alert("数量必须大于 0");
      return;
    }

    const updatedInventory = updateInventoryItem(item.id, {
      quantity: numericQuantity,
      unit: editUnit,
      storageLocation: editStorageLocation,
      expiryDate: editExpiryDate
    });

    setInventory(updatedInventory);
    cancelEditing();
  }

  function handleDelete(item: InventoryItem) {
    const confirmed = window.confirm(`确定要删除 ${item.name} 吗？`);

    if (!confirmed) {
      return;
    }

    const updatedInventory = deleteInventoryItem(item.id);
    setInventory(updatedInventory);
  }

  function handleLoadSampleInventory() {
    const confirmed = window.confirm(
      "加载示例库存会覆盖当前库存，确定继续吗？"
    );

    if (!confirmed) {
      return;
    }

    const sampleInventory = loadSampleInventory();
    setInventory(sampleInventory);
    cancelEditing();
  }

  function handleClearInventory() {
    const confirmed = window.confirm("确定要清空所有库存吗？");

    if (!confirmed) {
      return;
    }

    const emptyInventory = clearInventory();
    setInventory(emptyInventory);
    cancelEditing();
  }

  return (
    <section className="inventory-page">
      <h1>库存</h1>

      <AddInventoryItemForm onInventoryChange={setInventory} />

      <div className="button-row">
        <button type="button" onClick={handleLoadSampleInventory}>
          加载示例库存
        </button>
        <button type="button" onClick={handleClearInventory}>
          清空库存
        </button>
      </div>

      {inventory.length === 0 ? (
        <p className="inventory-empty">暂无库存，请添加食材</p>
      ) : (
        <div className="inventory-list">
          {inventory.map((item) => (
            <article className="inventory-card" key={item.id}>
              {editingItemId === item.id ? (
                <div className="inventory-edit-form">
                  <label>
                    数量
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={editQuantity}
                      onChange={(event) => setEditQuantity(event.target.value)}
                    />
                  </label>

                  <label>
                    单位
                    <input
                      type="text"
                      value={editUnit}
                      onChange={(event) => setEditUnit(event.target.value)}
                    />
                  </label>

                  <label>
                    存放位置
                    <input
                      type="text"
                      value={editStorageLocation}
                      onChange={(event) =>
                        setEditStorageLocation(event.target.value)
                      }
                    />
                  </label>

                  <label>
                    过期日期
                    <input
                      type="date"
                      value={editExpiryDate}
                      onChange={(event) => setEditExpiryDate(event.target.value)}
                    />
                  </label>

                  <div className="button-row">
                    <button type="button" onClick={() => handleSaveEdit(item)}>
                      保存
                    </button>
                    <button type="button" onClick={cancelEditing}>
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="inventory-card-content">
                    <h2>{item.name}</h2>
                    <p>
                      {item.quantity} {item.unit}
                    </p>

                    {item.storageLocation ? (
                      <p>存放位置：{item.storageLocation}</p>
                    ) : null}

                    {item.purchaseDate ? (
                      <p>购买日期：{item.purchaseDate}</p>
                    ) : null}

                    <p>保质期：{getExpiryLabel(item.expiryDate)}</p>
                  </div>

                  <div className="button-row">
                    <button type="button" onClick={() => startEditing(item)}>
                      编辑
                    </button>
                    <button type="button" onClick={() => handleDelete(item)}>
                      删除
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default InventoryPage;
