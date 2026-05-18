import { useState } from "react";
import { sampleRecipes } from "../data/sampleRecipes";

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

function RecipesPage() {
  const [expandedRecipeIds, setExpandedRecipeIds] = useState<string[]>([]);

  function toggleRecipe(recipeId: string) {
    setExpandedRecipeIds((currentIds) =>
      currentIds.includes(recipeId)
        ? currentIds.filter((id) => id !== recipeId)
        : [...currentIds, recipeId]
    );
  }

  return (
    <section className="recipes-page">
      <h1>菜谱</h1>

      <div className="recipe-list">
        {sampleRecipes.map((recipe) => {
          const isExpanded = expandedRecipeIds.includes(recipe.id);
          const requiredIngredients = recipe.ingredients.filter(
            (ingredient) => ingredient.required
          );
          const optionalIngredients = recipe.ingredients.filter(
            (ingredient) => !ingredient.required
          );

          return (
            <article className="recipe-card" key={recipe.id}>
              <h2>{recipe.name}</h2>

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

              <button type="button" onClick={() => toggleRecipe(recipe.id)}>
                {isExpanded ? "收起" : "展开"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default RecipesPage;
