const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");
const Product = require("./src/models/Product");
const Order = require("./src/models/Order");
require("dotenv").config();

// Sample users data
const sampleUsers = [
  {
    phone: "+1234567890",
    password: "password123",
    name: "John Smith",
    storeName: "Smith's Grocery Store",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    role: "admin",
  },
  {
    phone: "+1987654321",
    password: "password123",
    name: "Sarah Johnson",
    storeName: "Johnson's Market",
    address: {
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
    },
    role: "user",
  },
  {
    phone: "+1555123456",
    password: "password123",
    name: "Mike Wilson",
    storeName: "Wilson's Convenience",
    address: {
      street: "789 Pine Street",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
    },
    role: "user",
  },
  {
    phone: "+1444567890",
    password: "password123",
    name: "Emily Davis",
    storeName: "Davis Corner Store",
    address: {
      street: "321 Elm Street",
      city: "Houston",
      state: "TX",
      zipCode: "77001",
    },
    role: "user",
  },
];

// Sample products data
const sampleProducts = [
  // Water products
  {
    name: "Premium Spring Water 500ml",
    category: "water",
    photo:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop",
    price: 0.75,
    stock: 500,
    description:
      "Pure spring water sourced from natural springs, perfect for hydration.",
  },
  {
    name: "Mineral Water 1L",
    category: "water",
    photo:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop",
    price: 1.25,
    stock: 300,
    description: "Rich in essential minerals, great for daily consumption.",
  },
  {
    name: "Sparkling Water 330ml",
    category: "water",
    photo:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop",
    price: 0.95,
    stock: 200,
    description: "Refreshing sparkling water with natural carbonation.",
  },
  {
    name: "Distilled Water 2L",
    category: "water",
    photo:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop",
    price: 2.5,
    stock: 150,
    description: "Pure distilled water, ideal for medical and laboratory use.",
  },

  // Chips products
  {
    name: "Classic Potato Chips",
    category: "chips",
    photo:
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop",
    price: 2.99,
    stock: 100,
    description:
      "Crispy potato chips with sea salt, perfect snack for any occasion.",
  },
  {
    name: "BBQ Flavored Chips",
    category: "chips",
    photo:
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop",
    price: 3.25,
    stock: 80,
    description: "Smoky BBQ flavored chips with a tangy kick.",
  },
  {
    name: "Sour Cream & Onion Chips",
    category: "chips",
    photo:
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop",
    price: 3.15,
    stock: 90,
    description: "Creamy sour cream and onion flavored potato chips.",
  },
  {
    name: "Tortilla Chips",
    category: "chips",
    photo:
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop",
    price: 2.75,
    stock: 120,
    description: "Authentic Mexican tortilla chips, perfect for dipping.",
  },

  // Mini cakes products
  {
    name: "Chocolate Mini Cakes",
    category: "mini-cakes",
    photo:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    price: 4.99,
    stock: 50,
    description: "Rich chocolate mini cakes with creamy frosting.",
  },
  {
    name: "Vanilla Mini Cakes",
    category: "mini-cakes",
    photo:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    price: 4.75,
    stock: 45,
    description: "Light vanilla mini cakes with buttercream frosting.",
  },
  {
    name: "Red Velvet Mini Cakes",
    category: "mini-cakes",
    photo:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    price: 5.25,
    stock: 40,
    description: "Classic red velvet mini cakes with cream cheese frosting.",
  },
  {
    name: "Carrot Mini Cakes",
    category: "mini-cakes",
    photo:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    price: 4.5,
    stock: 35,
    description: "Moist carrot mini cakes with cream cheese frosting.",
  },

  // Biscuits products
  {
    name: "Butter Cookies",
    category: "biscuits",
    photo:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
    price: 3.99,
    stock: 75,
    description: "Classic butter cookies with a melt-in-your-mouth texture.",
  },
  {
    name: "Chocolate Chip Cookies",
    category: "biscuits",
    photo:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
    price: 4.25,
    stock: 60,
    description: "Soft chocolate chip cookies with generous chocolate chunks.",
  },
  {
    name: "Oatmeal Raisin Cookies",
    category: "biscuits",
    photo:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
    price: 3.75,
    stock: 55,
    description: "Hearty oatmeal cookies with plump raisins.",
  },
  {
    name: "Shortbread Cookies",
    category: "biscuits",
    photo:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
    price: 4.5,
    stock: 40,
    description: "Traditional Scottish shortbread cookies, rich and buttery.",
  },
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
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

// Seed products
const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Created ${createdProducts.length} products`);

    return createdProducts;
  } catch (error) {
    console.error("Error seeding products:", error);
    throw error;
  }
};

// Seed orders
const seedOrders = async (users, products) => {
  try {
    // Clear existing orders
    await Order.deleteMany({});
    console.log("Cleared existing orders");

    // Get a regular user (not admin) to create orders for
    const regularUser = users.find((user) => user.role === "user");
    if (!regularUser) {
      console.log("No regular user found, skipping orders");
      return [];
    }

    // Create sample orders
    const sampleOrders = [
      {
        user: regularUser._id,
        items: [
          {
            product: products[0]._id, // Premium Spring Water
            quantity: 5,
            price: products[0].price,
          },
          {
            product: products[4]._id, // Classic Potato Chips
            quantity: 2,
            price: products[4].price,
          },
        ],
        totalAmount: products[0].price * 5 + products[4].price * 2,
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
        user: regularUser._id,
        items: [
          {
            product: products[8]._id, // Chocolate Mini Cakes
            quantity: 3,
            price: products[8].price,
          },
          {
            product: products[12]._id, // Butter Cookies
            quantity: 1,
            price: products[12].price,
          },
        ],
        totalAmount: products[8].price * 3 + products[12].price,
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
        user: regularUser._id,
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
    ];

    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`Created ${createdOrders.length} orders`);

    return createdOrders;
  } catch (error) {
    console.error("Error seeding orders:", error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("Starting database seeding...");

    const users = await seedUsers();
    const products = await seedProducts();
    await seedOrders(users, products);

    console.log("Database seeding completed successfully!");
    console.log("\nSample login credentials:");
    console.log("Admin: +1234567890 / password123");
    console.log("User: +1987654321 / password123");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

// Run the seeding
seedDatabase();
