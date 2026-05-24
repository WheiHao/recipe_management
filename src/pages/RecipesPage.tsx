import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { sampleIngredients } from "../data/sampleIngredients";
import type {
  InventoryItem,
  Recipe,
  RecipeIngredient
} from "../models/types";
import {
  canCookRecipe,
  consumeInventoryForRecipe,
  getInventory,
  getMissingRequiredIngredientsForRecipe
} from "../services/inventoryService";
import {
  addCustomRecipe,
  deleteCustomRecipe,
  getAllRecipes,
  updateCustomRecipe
} from "../services/recipeService";
import { addMissingIngredientsToShoppingList } from "../services/shoppingListService";

type RecipeIngredientFormRow = RecipeIngredient & {
  formId: string;
};

function getDifficultyLabel(difficulty?: "easy" | "medium" | "hard"): string {
  switch (difficulty) {
    case "easy":
      return "简单";
    case "medium":
      return "中等";
    case "hard":
      return "困难";
    default:
      return "未设置";
  }
}

function createIngredientFormRow(): RecipeIngredientFormRow {
  return {
    formId: `ingredient_form_${Date.now()}_${Math.random()}`,
    ingredientId: "",
    name: "",
    quantity: undefined,
    unit: "",
    required: true
  };
}

function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [expandedRecipeIds, setExpandedRecipeIds] = useState<string[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [recipeName, setRecipeName] = useState("");
  const [cookingTimeMinutes, setCookingTimeMinutes] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );
  const [ingredientRows, setIngredientRows] = useState<
    RecipeIngredientFormRow[]
  >([createIngredientFormRow()]);
  const [stepRows, setStepRows] = useState<string[]>([""]);

  useEffect(() => {
    setRecipes(getAllRecipes());
    setInventory(getInventory());
  }, []);

  function resetRecipeForm() {
    setEditingRecipeId(null);
    setRecipeName("");
    setCookingTimeMinutes("");
    setDifficulty("easy");
    setIngredientRows([createIngredientFormRow()]);
    setStepRows([""]);
  }

  function toggleRecipe(recipeId: string) {
    setExpandedRecipeIds((currentIds) =>
      currentIds.includes(recipeId)
        ? currentIds.filter((id) => id !== recipeId)
        : [...currentIds, recipeId]
    );
  }

  function updateIngredientRow(
    formId: string,
    updates: Partial<RecipeIngredientFormRow>
  ) {
    setIngredientRows((currentRows) =>
      currentRows.map((row) =>
        row.formId === formId
          ? {
              ...row,
              ...updates
            }
          : row
      )
    );
  }

  function handleIngredientSelect(formId: string, ingredientId: string) {
    const selectedIngredient = sampleIngredients.find(
      (ingredient) => ingredient.id === ingredientId
    );

    updateIngredientRow(formId, {
      ingredientId,
      name: selectedIngredient?.name ?? ""
    });
  }

  function handleRecipeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = recipeName.trim();
    const parsedCookingTime = cookingTimeMinutes
      ? Number(cookingTimeMinutes)
      : undefined;
    const ingredients = ingredientRows
      .filter((ingredient) => ingredient.ingredientId && ingredient.name)
      .map(({ formId: _formId, ...ingredient }) => ingredient);
    const steps = stepRows.map((step) => step.trim()).filter(Boolean);

    if (!trimmedName) {
      window.alert("菜谱名称必填");
      return;
    }

    if (
      parsedCookingTime !== undefined &&
      (!Number.isFinite(parsedCookingTime) || parsedCookingTime <= 0)
    ) {
      window.alert("烹饪时间必须大于 0");
      return;
    }

    if (!ingredients.some((ingredient) => ingredient.required)) {
      window.alert("至少需要一个必需食材");
      return;
    }

    if (
      ingredients.some(
        (ingredient) =>
          ingredient.quantity !== undefined &&
          (!Number.isFinite(ingredient.quantity) || ingredient.quantity <= 0)
      )
    ) {
      window.alert("食材数量必须大于 0");
      return;
    }

    if (steps.length === 0) {
      window.alert("至少需要一个步骤");
      return;
    }

    const recipe: Recipe = {
      id: editingRecipeId ?? `rec_custom_${Date.now()}`,
      name: trimmedName,
      source: "custom",
      cookingTimeMinutes: parsedCookingTime,
      difficulty,
      ingredients,
      steps
    };

    if (editingRecipeId) {
      updateCustomRecipe(editingRecipeId, recipe);
    } else {
      addCustomRecipe(recipe);
    }

    setRecipes(getAllRecipes());
    resetRecipeForm();
  }

  function handleEditRecipe(recipe: Recipe) {
    setEditingRecipeId(recipe.id);
    setRecipeName(recipe.name);
    setCookingTimeMinutes(
      recipe.cookingTimeMinutes ? String(recipe.cookingTimeMinutes) : ""
    );
    setDifficulty(recipe.difficulty ?? "easy");
    setIngredientRows(
      recipe.ingredients.map((ingredient) => ({
        ...ingredient,
        formId: `ingredient_form_${Date.now()}_${ingredient.ingredientId}`
      }))
    );
    setStepRows(recipe.steps.length > 0 ? recipe.steps : [""]);
  }

  function handleDeleteRecipe(recipe: Recipe) {
    const confirmed = window.confirm(`确定要删除 ${recipe.name} 吗？`);

    if (!confirmed) {
      return;
    }

    deleteCustomRecipe(recipe.id);
    setRecipes(getAllRecipes());
  }

  function handleConsumeInventory(recipe: Recipe) {
    const confirmed = window.confirm("确定已完成这道菜并扣减库存吗？");

    if (!confirmed) {
      return;
    }

    const currentInventory = getInventory();

    if (!canCookRecipe(recipe, currentInventory)) {
      window.alert("库存不足，无法扣减。");
      return;
    }

    const updatedInventory = consumeInventoryForRecipe(recipe);
    setInventory(updatedInventory);
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
      setInventory(currentInventory);
      return;
    }

    addMissingIngredientsToShoppingList(missingRequiredIngredients);
    setInventory(currentInventory);
    window.alert("已加入购物清单。");
  }

  return (
    <section className="recipes-page">
      <h1>菜谱</h1>

      <form className="recipe-form" onSubmit={handleRecipeSubmit}>
        <h2>{editingRecipeId ? "编辑自定义菜谱" : "添加自定义菜谱"}</h2>

        <label>
          菜谱名称
          <input
            type="text"
            value={recipeName}
            onChange={(event) => setRecipeName(event.target.value)}
          />
        </label>

        <label>
          烹饪时间
          <input
            type="number"
            min="1"
            value={cookingTimeMinutes}
            onChange={(event) => setCookingTimeMinutes(event.target.value)}
          />
        </label>

        <label>
          难度
          <select
            value={difficulty}
            onChange={(event) =>
              setDifficulty(event.target.value as "easy" | "medium" | "hard")
            }
          >
            <option value="easy">简单</option>
            <option value="medium">中等</option>
            <option value="hard">困难</option>
          </select>
        </label>

        <div className="recipe-form-section">
          <h3>食材</h3>

          {ingredientRows.map((ingredient) => (
            <div className="recipe-ingredient-row" key={ingredient.formId}>
              <select
                value={ingredient.ingredientId}
                onChange={(event) =>
                  handleIngredientSelect(ingredient.formId, event.target.value)
                }
              >
                <option value="">请选择食材</option>
                {sampleIngredients.map((sampleIngredient) => (
                  <option key={sampleIngredient.id} value={sampleIngredient.id}>
                    {sampleIngredient.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="数量"
                value={ingredient.quantity ?? ""}
                onChange={(event) =>
                  updateIngredientRow(ingredient.formId, {
                    quantity: event.target.value
                      ? Number(event.target.value)
                      : undefined
                  })
                }
              />

              <input
                type="text"
                placeholder="单位"
                value={ingredient.unit ?? ""}
                onChange={(event) =>
                  updateIngredientRow(ingredient.formId, {
                    unit: event.target.value
                  })
                }
              />

              <label className="inline-checkbox">
                <input
                  type="checkbox"
                  checked={ingredient.required}
                  onChange={(event) =>
                    updateIngredientRow(ingredient.formId, {
                      required: event.target.checked
                    })
                  }
                />
                必需
              </label>

              <button
                type="button"
                onClick={() =>
                  setIngredientRows((currentRows) =>
                    currentRows.filter((row) => row.formId !== ingredient.formId)
                  )
                }
              >
                删除
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setIngredientRows((currentRows) => [
                ...currentRows,
                createIngredientFormRow()
              ])
            }
          >
            添加食材
          </button>
        </div>

        <div className="recipe-form-section">
          <h3>步骤</h3>

          {stepRows.map((step, index) => (
            <div className="recipe-step-row" key={`step_${index}`}>
              <input
                type="text"
                value={step}
                onChange={(event) =>
                  setStepRows((currentSteps) =>
                    currentSteps.map((currentStep, currentIndex) =>
                      currentIndex === index ? event.target.value : currentStep
                    )
                  )
                }
              />
              <button
                type="button"
                onClick={() =>
                  setStepRows((currentSteps) =>
                    currentSteps.filter(
                      (_currentStep, currentIndex) => currentIndex !== index
                    )
                  )
                }
              >
                删除
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setStepRows((currentSteps) => [...currentSteps, ""])
            }
          >
            添加步骤
          </button>
        </div>

        <div className="button-row">
          <button type="submit">{editingRecipeId ? "保存修改" : "保存菜谱"}</button>
          {editingRecipeId ? (
            <button type="button" onClick={resetRecipeForm}>
              取消编辑
            </button>
          ) : null}
        </div>
      </form>

      <div className="recipe-list">
        {recipes.map((recipe) => {
          const isExpanded = expandedRecipeIds.includes(recipe.id);
          const requiredIngredients = recipe.ingredients.filter(
            (ingredient) => ingredient.required
          );
          const optionalIngredients = recipe.ingredients.filter(
            (ingredient) => !ingredient.required
          );
          const missingRequiredIngredients =
            getMissingRequiredIngredientsForRecipe(recipe, inventory);
          const isCustomRecipe = recipe.source === "custom";

          return (
            <article className="recipe-card" key={recipe.id}>
              <h2>{recipe.name}</h2>

              <p>
                <span className="recipe-source-label">
                  {isCustomRecipe ? "自定义" : "预设"}
                </span>
              </p>

              <p>
                {recipe.cookingTimeMinutes
                  ? `约 ${recipe.cookingTimeMinutes} 分钟`
                  : "未设置时间"}
                {" · "}
                难度：{getDifficultyLabel(recipe.difficulty)}
              </p>

              <p>
                必需食材：
                {requiredIngredients
                  .map((ingredient) => ingredient.name)
                  .join("、")}
              </p>

              {optionalIngredients.length > 0 ? (
                <p>
                  可选食材：
                  {optionalIngredients
                    .map((ingredient) => ingredient.name)
                    .join("、")}
                </p>
              ) : null}

              {isExpanded ? (
                <div className="recipe-details">
                  <h3>食材明细</h3>
                  <ul>
                    {recipe.ingredients.map((ingredient) => (
                      <li key={ingredient.ingredientId}>
                        {ingredient.name}
                        {ingredient.quantity ? ` ${ingredient.quantity}` : ""}
                        {ingredient.unit ? ` ${ingredient.unit}` : ""}
                        {ingredient.required ? "（必需）" : "（可选）"}
                      </li>
                    ))}
                  </ul>

                  <h3>步骤</h3>
                  <ol>
                    {recipe.steps.map((step, index) => (
                      <li key={`${recipe.id}_step_${index}`}>{step}</li>
                    ))}
                  </ol>
                </div>
              ) : null}

              <div className="button-row">
                <button type="button" onClick={() => toggleRecipe(recipe.id)}>
                  {isExpanded ? "收起" : "展开"}
                </button>
                <button
                  type="button"
                  onClick={() => handleConsumeInventory(recipe)}
                >
                  做完并扣减库存
                </button>
                {missingRequiredIngredients.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => handleAddMissingIngredientsToShoppingList(recipe)}
                  >
                    加入购物清单
                  </button>
                ) : null}
                {isCustomRecipe ? (
                  <>
                    <button type="button" onClick={() => handleEditRecipe(recipe)}>
                      编辑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRecipe(recipe)}
                    >
                      删除
                    </button>
                  </>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default RecipesPage;
