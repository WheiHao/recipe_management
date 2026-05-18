import type { Recipe } from "../models/types";

export const sampleRecipes: Recipe[] = [
  {
    id: "recipe-tomato-egg",
    name: "番茄炒蛋",
    cookingTimeMinutes: 15,
    difficulty: "easy",
    ingredients: [
      {
        ingredientId: "ingredient-egg",
        name: "鸡蛋",
        quantity: 2,
        unit: "个",
        required: true
      },
      {
        ingredientId: "ingredient-tomato",
        name: "番茄",
        quantity: 2,
        unit: "个",
        required: true
      },
      {
        ingredientId: "ingredient-scallion",
        name: "葱",
        quantity: 1,
        unit: "根",
        required: false
      }
    ],
    steps: [
      "鸡蛋打散，番茄切块，葱切碎。",
      "先炒鸡蛋至凝固盛出，再炒番茄出汁。",
      "倒回鸡蛋翻炒均匀，撒葱花后出锅。"
    ]
  },
  {
    id: "recipe-egg-fried-rice",
    name: "蛋炒饭",
    cookingTimeMinutes: 12,
    difficulty: "easy",
    ingredients: [
      {
        ingredientId: "ingredient-rice",
        name: "米饭",
        quantity: 1,
        unit: "碗",
        required: true
      },
      {
        ingredientId: "ingredient-egg",
        name: "鸡蛋",
        quantity: 1,
        unit: "个",
        required: true
      },
      {
        ingredientId: "ingredient-scallion",
        name: "葱",
        quantity: 1,
        unit: "根",
        required: false
      }
    ],
    steps: [
      "鸡蛋打散，米饭打松，葱切碎。",
      "热锅炒蛋后加入米饭翻炒至颗粒分明。",
      "调味后撒入葱花，翻匀出锅。"
    ]
  },
  {
    id: "recipe-potato-chicken",
    name: "土豆鸡肉",
    cookingTimeMinutes: 30,
    difficulty: "medium",
    ingredients: [
      {
        ingredientId: "ingredient-potato",
        name: "土豆",
        quantity: 2,
        unit: "个",
        required: true
      },
      {
        ingredientId: "ingredient-chicken-breast",
        name: "鸡胸肉",
        quantity: 1,
        unit: "块",
        required: true
      },
      {
        ingredientId: "ingredient-onion",
        name: "洋葱",
        quantity: 0.5,
        unit: "个",
        required: false
      }
    ],
    steps: [
      "土豆切块，鸡胸肉切块，洋葱切片。",
      "先煎鸡肉至变色，再加入土豆和洋葱翻炒。",
      "加少量水焖煮至土豆变软，收汁后出锅。"
    ]
  },
  {
    id: "recipe-carrot-egg",
    name: "胡萝卜炒蛋",
    cookingTimeMinutes: 15,
    difficulty: "easy",
    ingredients: [
      {
        ingredientId: "ingredient-carrot",
        name: "胡萝卜",
        quantity: 1,
        unit: "根",
        required: true
      },
      {
        ingredientId: "ingredient-egg",
        name: "鸡蛋",
        quantity: 2,
        unit: "个",
        required: true
      },
      {
        ingredientId: "ingredient-scallion",
        name: "葱",
        quantity: 1,
        unit: "根",
        required: false
      }
    ],
    steps: [
      "胡萝卜切丝，鸡蛋打散，葱切碎。",
      "先炒鸡蛋盛出，再炒胡萝卜至变软。",
      "倒回鸡蛋翻炒调味，撒葱花后出锅。"
    ]
  },
  {
    id: "recipe-milk-oats",
    name: "牛奶燕麦",
    cookingTimeMinutes: 8,
    difficulty: "easy",
    ingredients: [
      {
        ingredientId: "ingredient-milk",
        name: "牛奶",
        quantity: 250,
        unit: "毫升",
        required: true
      },
      {
        ingredientId: "ingredient-oats",
        name: "燕麦",
        quantity: 40,
        unit: "克",
        required: true
      }
    ],
    steps: [
      "将牛奶倒入小锅中加热至微微冒泡。",
      "加入燕麦搅拌，小火煮至浓稠。",
      "关火后静置片刻即可食用。"
    ]
  }
];
