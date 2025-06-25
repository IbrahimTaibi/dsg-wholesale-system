const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");
const Product = require("./src/models/Product");
const Order = require("./src/models/Order");
const Category = require("./src/models/Category");
require("dotenv").config();

// Generate 30 unique users
const firstNames = [
  "John",
  "Sarah",
  "Mike",
  "Emily",
  "Ahmed",
  "Maria",
  "David",
  "Lisa",
  "Robert",
  "Jennifer",
  "Michael",
  "Amanda",
  "James",
  "Jessica",
  "William",
  "Linda",
  "Richard",
  "Barbara",
  "Joseph",
  "Susan",
  "Thomas",
  "Karen",
  "Charles",
  "Nancy",
  "Christopher",
  "Betty",
  "Daniel",
  "Margaret",
  "Matthew",
  "Sandra",
];
const lastNames = [
  "Smith",
  "Johnson",
  "Wilson",
  "Davis",
  "Hassan",
  "Rodriguez",
  "Chen",
  "Thompson",
  "Brown",
  "White",
  "Garcia",
  "Lee",
  "Martinez",
  "Clark",
  "Lewis",
  "Walker",
  "Hall",
  "Allen",
  "Young",
  "King",
  "Wright",
  "Scott",
  "Green",
  "Baker",
  "Adams",
  "Nelson",
  "Carter",
  "Mitchell",
  "Perez",
  "Roberts",
  "Smith",
];
const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Miami",
  "Phoenix",
  "Seattle",
  "Denver",
  "Boston",
  "Atlanta",
  "San Francisco",
  "Portland",
  "Dallas",
  "Austin",
  "Orlando",
  "Detroit",
  "Baltimore",
  "Cleveland",
  "Tampa",
  "Minneapolis",
  "Las Vegas",
  "San Diego",
  "Charlotte",
  "Columbus",
  "Indianapolis",
  "Nashville",
  "Louisville",
  "Milwaukee",
  "Raleigh",
  "Omaha",
];
const states = [
  "NY",
  "CA",
  "IL",
  "TX",
  "FL",
  "AZ",
  "WA",
  "CO",
  "MA",
  "GA",
  "CA",
  "OR",
  "TX",
  "TX",
  "FL",
  "MI",
  "MD",
  "OH",
  "FL",
  "MN",
  "NV",
  "CA",
  "NC",
  "OH",
  "IN",
  "TN",
  "KY",
  "WI",
  "NC",
  "NE",
];

const sampleUsers = Array.from({ length: 30 }, (_, i) => {
  const first = firstNames[i % firstNames.length];
  const last = lastNames[i % lastNames.length];
  return {
    phone: `+1${(5550000000 + i).toString()}`,
    password: "password123",
    name: `${first} ${last}`,
    storeName: `${last}'s Market`,
    photo: `https://picsum.photos/200/200?random=${i + 1000}`,
    address: {
      street: `${100 + i} Main Street`,
      city: cities[i % cities.length],
      state: states[i % states.length],
      zipCode: (10000 + i * 7).toString().padStart(5, "0"),
    },
    role: i === 0 ? "admin" : "user",
  };
});

// Generate 60 unique products with unique Unsplash photos
const productNames = [
  // Water & Beverages (12 products)
  "Premium Spring Water 500ml",
  "Mineral Water 1L",
  "Sparkling Water 330ml",
  "Distilled Water 2L",
  "Alkaline Water 750ml",
  "Coconut Water 330ml",
  "Electrolyte Water 500ml",
  "Glacier Water 1.5L",
  "Natural Spring Water 1L",
  "Mineral Sparkling Water 500ml",
  "Purified Drinking Water 2L",
  "Enhanced Water with Vitamins 750ml",

  // Chips (12 products)
  "Classic Potato Chips",
  "BBQ Flavored Chips",
  "Sour Cream & Onion Chips",
  "Tortilla Chips",
  "Salt & Vinegar Chips",
  "Jalapeño Chips",
  "Cheese & Onion Chips",
  "Sea Salt Chips",
  "Sweet Chili Chips",
  "Lime Chips",
  "Ranch Flavored Chips",
  "Spicy Nacho Chips",

  // Mini Cakes (12 products)
  "Chocolate Mini Cakes",
  "Vanilla Mini Cakes",
  "Red Velvet Mini Cakes",
  "Carrot Mini Cakes",
  "Lemon Mini Cakes",
  "Strawberry Mini Cakes",
  "Coffee Mini Cakes",
  "Coconut Mini Cakes",
  "Blueberry Mini Cakes",
  "Banana Mini Cakes",
  "Pineapple Mini Cakes",
  "Orange Mini Cakes",

  // Juices (12 products)
  "Orange Juice 1L",
  "Apple Juice 1L",
  "Grape Juice 1L",
  "Pineapple Juice 1L",
  "Cranberry Juice 1L",
  "Mango Juice 1L",
  "Strawberry Juice 1L",
  "Lemonade 1L",
  "Peach Juice 1L",
  "Watermelon Juice 1L",
  "Pomegranate Juice 1L",
  "Mixed Berry Juice 1L",

  // Groceries (12 products)
  "Organic Bananas 1kg",
  "Fresh Apples 1kg",
  "Ripe Tomatoes 500g",
  "Fresh Lettuce",
  "Organic Carrots 1kg",
  "Fresh Onions 1kg",
  "Fresh Potatoes 2kg",
  "Fresh Garlic 250g",
  "Broccoli 500g",
  "Spinach 250g",
  "Fresh Cucumbers 500g",
  "Bell Peppers 500g",
];
const categories = [
  // Water & Beverages (12 products)
  "Water & Beverages",
  "Water & Beverages",
  "Water & Beverages",
  "Water & Beverages",
  "Water & Beverages",
  "Water & Beverages",
  "Water & Beverages",
  "Water & Beverages",
  "Water & Beverages",
  "Water & Beverages",
  "Water & Beverages",
  "Water & Beverages",

  // Chips (12 products)
  "Chips",
  "Chips",
  "Chips",
  "Chips",
  "Chips",
  "Chips",
  "Chips",
  "Chips",
  "Chips",
  "Chips",
  "Chips",
  "Chips",

  // Mini Cakes (12 products)
  "Mini Cakes",
  "Mini Cakes",
  "Mini Cakes",
  "Mini Cakes",
  "Mini Cakes",
  "Mini Cakes",
  "Mini Cakes",
  "Mini Cakes",
  "Mini Cakes",
  "Mini Cakes",
  "Mini Cakes",
  "Mini Cakes",

  // Juices (12 products)
  "Juices",
  "Juices",
  "Juices",
  "Juices",
  "Juices",
  "Juices",
  "Juices",
  "Juices",
  "Juices",
  "Juices",
  "Juices",
  "Juices",

  // Groceries (12 products)
  "Groceries",
  "Groceries",
  "Groceries",
  "Groceries",
  "Groceries",
  "Groceries",
  "Groceries",
  "Groceries",
  "Groceries",
  "Groceries",
  "Groceries",
  "Groceries",
];
const productPhotos = Array.from(
  { length: 60 },
  (_, i) => `https://picsum.photos/400/400?random=${i + 100}`,
);
const descriptions = [
  "High quality and fresh.",
  "Best seller in its category.",
  "Loved by our customers.",
  "Perfect for any occasion.",
  "Top-rated product.",
  "Great taste and value.",
  "Premium selection.",
  "A must-have item.",
  "Popular choice for families.",
  "Excellent for daily use.",
  "Fresh and nutritious.",
  "Premium quality product.",
  "Delicious and healthy.",
  "Perfect for snacking.",
  "Great value for money.",
  "Fresh from the farm.",
  "Organic and natural.",
  "Rich in vitamins.",
  "Perfect for hydration.",
  "Refreshing and pure.",
  "Made with care.",
  "Premium ingredients.",
  "Healthy choice.",
  "Natural goodness.",
  "Fresh and crisp.",
  "Delicious flavor.",
  "Perfect size.",
  "Great for sharing.",
  "Premium taste.",
  "Fresh daily.",
  "Quality guaranteed.",
  "Natural sweetness.",
  "Perfect balance.",
  "Rich flavor.",
  "Fresh ingredients.",
  "Premium quality.",
  "Delicious taste.",
  "Healthy option.",
  "Perfect portion.",
  "Great texture.",
  "Fresh and clean.",
  "Premium selection.",
  "Natural ingredients.",
  "Perfect for everyone.",
  "Great taste.",
  "Fresh and pure.",
  "Premium product.",
  "Delicious and fresh.",
  "Perfect choice.",
  "Great quality.",
  "Fresh daily.",
  "Premium taste.",
  "Natural goodness.",
  "Perfect size.",
  "Great value.",
  "Fresh ingredients.",
  "Premium quality.",
  "Delicious flavor.",
  "Perfect for any time.",
  "Great selection.",
  "Fresh and healthy.",
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://darkmageon:Canibalixftw..1@cluster0.tuv6l9p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })),
    );

    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Created ${createdUsers.length} users`);

    return createdUsers;
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
};

// Seed categories
const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log("Cleared existing categories");

    const mainCategories = [
      {
        name: "Water & Beverages",
        parent: null,
        variants: ["500ml", "1L", "1.5L", "2L"],
      },
      {
        name: "Juices",
        parent: null,
        variants: ["Orange", "Apple", "Grape", "Pineapple", "Mango"],
      },
      {
        name: "Mini Cakes",
        parent: null,
        variants: ["Chocolate", "Vanilla", "Red Velvet", "Carrot", "Lemon"],
      },
      {
        name: "Chips",
        parent: null,
        variants: ["Original", "BBQ", "Sour Cream & Onion", "Salt & Vinegar"],
      },
      {
        name: "Groceries",
        parent: null,
        variants: ["Organic", "Fresh", "Frozen", "Canned"],
      },
    ];

    const createdMainCategories = await Category.insertMany(mainCategories);
    console.log(`Created ${createdMainCategories.length} main categories`);

    // Create some subcategories
    const subcategories = [
      {
        name: "Spring Water",
        parent: createdMainCategories[0]._id, // Water & Beverages
        variants: ["Natural", "Mineral", "Alkaline"],
      },
      {
        name: "Sparkling Water",
        parent: createdMainCategories[0]._id, // Water & Beverages
        variants: ["Plain", "Lemon", "Lime", "Berry"],
      },
      {
        name: "Fresh Fruits",
        parent: createdMainCategories[4]._id, // Groceries
        variants: ["Bananas", "Apples", "Oranges", "Berries"],
      },
      {
        name: "Fresh Vegetables",
        parent: createdMainCategories[4]._id, // Groceries
        variants: ["Tomatoes", "Lettuce", "Carrots", "Onions"],
      },
    ];

    const createdSubcategories = await Category.insertMany(subcategories);
    console.log(`Created ${createdSubcategories.length} subcategories`);

    return [...createdMainCategories, ...createdSubcategories];
  } catch (error) {
    console.error("Error seeding categories:", error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("Starting database seeding...");

    const users = await seedUsers();
    const categories = await seedCategories();
    // Build category name -> ObjectId map
    const allCategories = await Category.find();
    const categoryMap = {};
    allCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });
    const products = await seedProducts(categoryMap);
    await seedOrders(users, products);

    console.log("Database seeding completed successfully!");
    console.log("\nSample login credentials:");
    console.log("Admin: +15550000000 / password123");
    console.log(
      "Users: +15550000001, +15550000002, +15550000003 / password123",
    );
    console.log(
      `\nCreated ${users.length} users, ${categories.length} categories, and ${products.length} products`,
    );

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

// Update seedProducts to accept categoryMap
const seedProducts = async (categoryMap) => {
  try {
    await Product.deleteMany({});
    console.log("Cleared existing products");

    const sampleProducts = Array.from({ length: 60 }, (_, i) => {
      const categoryName = categories[i % categories.length];
      const categoryId = categoryMap[categoryName];
      if (!categoryId) {
        console.warn("No categoryId for", categoryName);
        return null; // skip this product
      }

      const baseProduct = {
        name: productNames[i],
        categoryId, // Use ObjectId
        photo: productPhotos[i],
        price: (Math.random() * 15 + 1).toFixed(2),
        stock: Math.floor(Math.random() * 200 + 10),
        description: descriptions[i % descriptions.length],
        isAvailable: true,
      };

      // Add unit and minOrderQuantity based on category
      if (categoryName === "Water & Beverages") {
        baseProduct.unit = "bottle";
        baseProduct.minOrderQuantity = 6;
      } else if (categoryName === "Chips") {
        baseProduct.unit = "bag";
        baseProduct.minOrderQuantity = 10;
      } else if (categoryName === "Mini Cakes") {
        baseProduct.unit = "piece";
        baseProduct.minOrderQuantity = 1;
      } else if (categoryName === "Juices") {
        baseProduct.unit = "bottle";
        baseProduct.minOrderQuantity = 6;
      } else if (categoryName === "Groceries") {
        baseProduct.unit = "kg";
        baseProduct.minOrderQuantity = 1;
      }

      // Add variants based on category
      if (categoryName === "Chips") {
        baseProduct.variants = [
          {
            name: "Original",
            price: parseFloat(baseProduct.price),
            stock: Math.floor(Math.random() * 100 + 20),
            photo: productPhotos[i],
            isAvailable: true,
          },
          {
            name: "Spicy",
            price: (parseFloat(baseProduct.price) + 0.5).toFixed(2),
            stock: Math.floor(Math.random() * 80 + 15),
            photo: productPhotos[i],
            isAvailable: true,
          },
          {
            name: "Cheese",
            price: (parseFloat(baseProduct.price) + 0.3).toFixed(2),
            stock: Math.floor(Math.random() * 90 + 10),
            photo: productPhotos[i],
            isAvailable: true,
          },
        ];
      } else if (categoryName === "Mini Cakes") {
        baseProduct.variants = [
          {
            name: "Chocolate",
            price: parseFloat(baseProduct.price),
            stock: Math.floor(Math.random() * 50 + 10),
            photo: productPhotos[i],
            isAvailable: true,
          },
          {
            name: "Vanilla",
            price: (parseFloat(baseProduct.price) - 0.2).toFixed(2),
            stock: Math.floor(Math.random() * 60 + 15),
            photo: productPhotos[i],
            isAvailable: true,
          },
          {
            name: "Strawberry",
            price: (parseFloat(baseProduct.price) + 0.3).toFixed(2),
            stock: Math.floor(Math.random() * 40 + 8),
            photo: productPhotos[i],
            isAvailable: true,
          },
        ];
      } else if (categoryName === "Juices") {
        baseProduct.variants = [
          {
            name: "Orange",
            price: parseFloat(baseProduct.price),
            stock: Math.floor(Math.random() * 100 + 30),
            photo: productPhotos[i],
            isAvailable: true,
          },
          {
            name: "Apple",
            price: (parseFloat(baseProduct.price) - 0.1).toFixed(2),
            stock: Math.floor(Math.random() * 120 + 25),
            photo: productPhotos[i],
            isAvailable: true,
          },
          {
            name: "Grape",
            price: (parseFloat(baseProduct.price) + 0.2).toFixed(2),
            stock: Math.floor(Math.random() * 80 + 20),
            photo: productPhotos[i],
            isAvailable: true,
          },
        ];
      } else if (categoryName === "Water & Beverages") {
        baseProduct.variants = [
          {
            name: "500ml",
            price: parseFloat(baseProduct.price),
            stock: Math.floor(Math.random() * 150 + 50),
            photo: productPhotos[i],
            isAvailable: true,
          },
          {
            name: "1L",
            price: (parseFloat(baseProduct.price) + 0.5).toFixed(2),
            stock: Math.floor(Math.random() * 120 + 40),
            photo: productPhotos[i],
            isAvailable: true,
          },
          {
            name: "1.5L",
            price: (parseFloat(baseProduct.price) + 1.0).toFixed(2),
            stock: Math.floor(Math.random() * 100 + 30),
            photo: productPhotos[i],
            isAvailable: true,
          },
        ];
      }

      return baseProduct;
    });

    const filteredProducts = sampleProducts.filter(Boolean);
    const createdProducts = await Product.insertMany(filteredProducts);
    console.log(`Created ${createdProducts.length} products`);
    return createdProducts;
  } catch (error) {
    console.error("Error seeding products:", error);
    throw error;
  }
};

// Seed orders with more variety
const seedOrders = async (users, products) => {
  try {
    // Clear existing orders
    await Order.deleteMany({});
    console.log("Cleared existing orders");

    // Get regular users (not admin) to create orders for
    const regularUsers = users.filter((user) => user.role === "user");
    if (regularUsers.length === 0) {
      console.log("No regular users found, skipping orders");
      return [];
    }

    // Create sample orders with more variety
    const sampleOrders = [
      {
        user: regularUsers[0]._id,
        items: [
          {
            product: products[0]._id, // Premium Spring Water
            quantity: 5,
            price: products[0].price,
          },
          {
            product: products[6]._id, // Classic Potato Chips
            quantity: 2,
            price: products[6].price,
          },
        ],
        totalAmount: products[0].price * 5 + products[6].price * 2,
        status: "pending",
        paymentMethod: "cash_on_delivery",
        deliveryAddress: {
          street: "123 Test Street",
          city: "Test City",
          state: "Test State",
          zipCode: "12345",
          country: "Test Country",
        },
        orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        user: regularUsers[1]._id,
        items: [
          {
            product: products[14]._id, // Chocolate Mini Cakes
            quantity: 3,
            price: products[14].price,
          },
          {
            product: products[22]._id, // Butter Cookies
            quantity: 1,
            price: products[22].price,
          },
        ],
        totalAmount: products[14].price * 3 + products[22].price,
        status: "delivered",
        paymentMethod: "cash_on_delivery",
        deliveryAddress: {
          street: "456 Sample Avenue",
          city: "Sample City",
          state: "Sample State",
          zipCode: "67890",
          country: "Sample Country",
        },
        orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        deliveryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        user: regularUsers[2]._id,
        items: [
          {
            product: products[1]._id, // Mineral Water 1L
            quantity: 10,
            price: products[1].price,
          },
        ],
        totalAmount: products[1].price * 10,
        status: "pending",
        paymentMethod: "cash_on_delivery",
        deliveryAddress: {
          street: "789 Demo Road",
          city: "Demo City",
          state: "Demo State",
          zipCode: "11111",
          country: "Demo Country",
        },
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        user: regularUsers[3]._id,
        items: [
          {
            product: products[30]._id, // Orange Juice
            quantity: 2,
            price: products[30].price,
          },
          {
            product: products[38]._id, // Organic Bananas
            quantity: 1,
            price: products[38].price,
          },
          {
            product: products[7]._id, // BBQ Chips
            quantity: 3,
            price: products[7].price,
          },
        ],
        totalAmount:
          products[30].price * 2 + products[38].price + products[7].price * 3,
        status: "pending",
        paymentMethod: "cash_on_delivery",
        deliveryAddress: {
          street: "321 Market Street",
          city: "Market City",
          state: "Market State",
          zipCode: "22222",
          country: "Market Country",
        },
        orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        user: regularUsers[4]._id,
        items: [
          {
            product: products[16]._id, // Red Velvet Mini Cakes
            quantity: 5,
            price: products[16].price,
          },
          {
            product: products[26]._id, // Peanut Butter Cookies
            quantity: 2,
            price: products[26].price,
          },
        ],
        totalAmount: products[16].price * 5 + products[26].price * 2,
        status: "delivered",
        paymentMethod: "cash_on_delivery",
        deliveryAddress: {
          street: "654 Business Blvd",
          city: "Business City",
          state: "Business State",
          zipCode: "33333",
          country: "Business Country",
        },
        orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        deliveryDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
      },
    ];

    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`Created ${createdOrders.length} orders`);

    return createdOrders;
  } catch (error) {
    console.error("Error seeding orders:", error);
    throw error;
  }
};

// MIGRATION: Convert old categories to recursive structure
async function migrateCategories() {
  await mongoose.connect("mongodb://localhost:27017/YOUR_DB_NAME"); // <-- Set your DB name
  const categories = await Category.find();

  // Step 1: Find all main categories (parentCategory == itself)
  const mainCategories = categories.filter(
    (cat) => !cat.parentCategory || cat.parentCategory === cat.name,
  );

  // Step 2: Update main categories: set parent = null
  for (const main of mainCategories) {
    main.parent = null;
    await main.save();
  }

  // Step 3: For subcategories, set parent to ObjectId of main category
  for (const cat of categories) {
    if (cat.parentCategory && cat.parentCategory !== cat.name) {
      const parent = mainCategories.find((m) => m.name === cat.parentCategory);
      if (parent) {
        cat.parent = parent._id;
        await cat.save();
      }
    }
  }

  // Step 4: Remove parentCategory field from all categories
  await Category.updateMany({}, { $unset: { parentCategory: 1 } });

  console.log("Migration complete!");
  process.exit(0);
}

// Only run if called directly
// if (require.main === module) {
//   migrateCategories();
// }

// Run the seeding
seedDatabase();
