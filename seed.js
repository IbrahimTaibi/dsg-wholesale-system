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
