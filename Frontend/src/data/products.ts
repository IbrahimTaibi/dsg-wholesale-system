import { Product } from "../types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_1",
    name: "Classic Potato Chips",
    description: "Crispy, golden potato chips seasoned with a pinch of salt.",
    price: 2.99,
    category: "Chips",
    photo:
      "https://images.unsplash.com/photo-1599490659213-e2b92d720785?q=80&w=2400&auto=format&fit=crop",
    image:
      "https://images.unsplash.com/photo-1599490659213-e2b92d720785?q=80&w=2400&auto=format&fit=crop",
    stock: 150,
    unit: "bag",
    minOrderQuantity: 10,
  },
  {
    id: "prod_2",
    name: "Natural Spring Water",
    description: "Pure and refreshing spring water, bottled at the source.",
    price: 1.25,
    category: "Water",
    photo:
      "https://images.unsplash.com/photo-1551022372-0bdac0c42738?q=80&w=2264&auto=format&fit=crop",
    image:
      "https://images.unsplash.com/photo-1551022372-0bdac0c42738?q=80&w=2264&auto=format&fit=crop",
    stock: 300,
    unit: "bottle",
    minOrderQuantity: 24,
  },
  {
    id: "prod_3",
    name: "Chocolate Fudge Cake",
    description:
      "Rich, decadent chocolate fudge cake, perfect for any occasion.",
    price: 15.0,
    category: "Cakes",
    photo:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2589&auto=format&fit=crop",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2589&auto=format&fit=crop",
    stock: 50,
    unit: "cake",
    minOrderQuantity: 1,
  },
  {
    id: "prod_4",
    name: "Fresh Orange Juice",
    description: "100% pure squeezed orange juice, full of vitamins.",
    price: 4.5,
    category: "Juices",
    photo:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=2400&auto=format&fit=crop",
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=2400&auto=format&fit=crop",
    stock: 100,
    unit: "bottle",
    minOrderQuantity: 6,
  },
  {
    id: "prod_5",
    name: "Artisanal Grocery Crackers",
    description: "Wholesome crackers made with ancient grains.",
    price: 3.75,
    category: "Groceries",
    photo:
      "https://images.unsplash.com/photo-1611274341752-a54c35694a1d?q=80&w=2592&auto=format&fit=crop",
    image:
      "https://images.unsplash.com/photo-1611274341752-a54c35694a1d?q=80&w=2592&auto=format&fit=crop",
    stock: 200,
    unit: "box",
    minOrderQuantity: 8,
  },
];
