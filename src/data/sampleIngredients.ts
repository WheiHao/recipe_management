import type { Ingredient } from "../models/types";

export const sampleIngredients: Ingredient[] = [
  {
    id: "ingredient-egg",
    name: "鸡蛋",
    category: "蛋类",
    defaultShelfLifeDays: 21,
    aliases: ["蛋", "鸡蛋液"]
  },
  {
    id: "ingredient-tomato",
    name: "番茄",
    category: "蔬菜",
    defaultShelfLifeDays: 7,
    aliases: ["西红柿"]
  },
  {
    id: "ingredient-rice",
    name: "米饭",
    category: "主食",
    defaultShelfLifeDays: 2,
    aliases: ["熟米饭", "白饭"]
  },
  {
    id: "ingredient-milk",
    name: "牛奶",
    category: "乳制品",
    defaultShelfLifeDays: 7,
    aliases: ["鲜奶"]
  },
  {
    id: "ingredient-noodles",
    name: "面条",
    category: "主食",
    defaultShelfLifeDays: 180,
    aliases: ["挂面", "面"]
  },
  {
    id: "ingredient-chicken-breast",
    name: "鸡胸肉",
    category: "肉类",
    defaultShelfLifeDays: 2,
    aliases: ["鸡肉", "鸡胸"]
  },
  {
    id: "ingredient-onion",
    name: "洋葱",
    category: "蔬菜",
    defaultShelfLifeDays: 30,
    aliases: ["圆葱"]
  },
  {
    id: "ingredient-potato",
    name: "土豆",
    category: "蔬菜",
    defaultShelfLifeDays: 30,
    aliases: ["马铃薯"]
  },
  {
    id: "ingredient-carrot",
    name: "胡萝卜",
    category: "蔬菜",
    defaultShelfLifeDays: 21,
    aliases: ["红萝卜"]
  },
  {
    id: "ingredient-scallion",
    name: "葱",
    category: "调味蔬菜",
    defaultShelfLifeDays: 7,
    aliases: ["小葱", "香葱", "青葱"]
  },
  {
    id: "ingredient-oats",
    name: "燕麦",
    category: "谷物",
    defaultShelfLifeDays: 365,
    aliases: ["燕麦片"]
  }
];
