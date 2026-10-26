/**
 * data.js
 * -----------------------------------------------------------------------
 * SAMPLE / DEMO DATA ONLY.
 * This is a small, hand-crafted retail & e-commerce sales dataset used
 * as the dashboard's fallback dataset — it is shown whenever no CSV file
 * has been imported. It is NOT live or real business data.
 *
 * Each record shape (the same shape used internally for imported CSV
 * rows, after validation — see script.js):
 * {
 *   date:     "YYYY-MM-DD"  (order date)
 *   product:  string        (product name)
 *   category: string        (product category)
 *   units:    number        (units sold in this order)
 *   sales:    number        (total sale amount in INR for this order)
 *   cost:     number        (total cost amount in INR for this order)
 * }
 * profit for a record = sales - cost
 * -----------------------------------------------------------------------
 */

const SAMPLE_SALES_DATA = [
  // ---- January 2026 ----
  { date: "2026-01-04", product: "Wireless Earbuds",  category: "Electronics",    units: 5,  sales: 12495, cost: 7500 },
  { date: "2026-01-06", product: "Running Shoes",      category: "Fashion",       units: 3,  sales: 8997,  cost: 5400 },
  { date: "2026-01-09", product: "Non-stick Pan Set",  category: "Home & Kitchen",units: 4,  sales: 6396,  cost: 3600 },
  { date: "2026-01-12", product: "Face Serum",         category: "Beauty",       units: 6,  sales: 3594,  cost: 1800 },
  { date: "2026-01-15", product: "Yoga Mat",           category: "Sports",       units: 7,  sales: 4893,  cost: 2800 },
  { date: "2026-01-18", product: "Bluetooth Speaker",  category: "Electronics",  units: 3,  sales: 5997,  cost: 3600 },
  { date: "2026-01-21", product: "Denim Jeans",        category: "Fashion",      units: 5,  sales: 6495,  cost: 3750 },
  { date: "2026-01-25", product: "LED Desk Lamp",      category: "Home & Kitchen",units: 6, sales: 5394,  cost: 3000 },
  { date: "2026-01-28", product: "Lip Balm Set",       category: "Beauty",       units: 10, sales: 2490,  cost: 1100 },
  { date: "2026-01-30", product: "Dumbbell Set",       category: "Sports",       units: 2,  sales: 3998,  cost: 2600 },

  // ---- February 2026 ----
  { date: "2026-02-02", product: "Smartwatch",         category: "Electronics",  units: 4,  sales: 15996, cost: 9600 },
  { date: "2026-02-05", product: "Leather Wallet",     category: "Fashion",      units: 8,  sales: 5592,  cost: 3200 },
  { date: "2026-02-08", product: "Blender",            category: "Home & Kitchen",units: 3, sales: 7497,  cost: 4500 },
  { date: "2026-02-11", product: "Hair Dryer",         category: "Beauty",       units: 4,  sales: 5996,  cost: 3200 },
  { date: "2026-02-14", product: "Cricket Bat",        category: "Sports",       units: 2,  sales: 3598,  cost: 2200 },
  { date: "2026-02-17", product: "Power Bank",         category: "Electronics", units: 9,  sales: 8991,  cost: 5400 },
  { date: "2026-02-20", product: "Cotton T-Shirt",     category: "Fashion",      units: 12, sales: 5988,  cost: 3000 },
  { date: "2026-02-23", product: "Vacuum Flask",       category: "Home & Kitchen",units: 7, sales: 3493,  cost: 1890 },
  { date: "2026-02-26", product: "Sunscreen SPF50",    category: "Beauty",       units: 8,  sales: 3192,  cost: 1600 },
  { date: "2026-02-28", product: "Resistance Bands",   category: "Sports",       units: 10, sales: 3990,  cost: 2000 },

  // ---- March 2026 ----
  { date: "2026-03-03", product: "Wireless Earbuds",   category: "Electronics", units: 7,  sales: 17493, cost: 10500 },
  { date: "2026-03-06", product: "Running Shoes",      category: "Fashion",     units: 5,  sales: 14995, cost: 9000 },
  { date: "2026-03-09", product: "Non-stick Pan Set",  category: "Home & Kitchen",units: 6,sales: 9594,  cost: 5400 },
  { date: "2026-03-12", product: "Face Serum",         category: "Beauty",      units: 9,  sales: 5391,  cost: 2700 },
  { date: "2026-03-15", product: "Yoga Mat",           category: "Sports",      units: 5,  sales: 3495,  cost: 2000 },
  { date: "2026-03-18", product: "Smartwatch",         category: "Electronics",units: 3,  sales: 11997, cost: 7200 },
  { date: "2026-03-21", product: "Denim Jeans",        category: "Fashion",     units: 6,  sales: 7794,  cost: 4500 },
  { date: "2026-03-24", product: "LED Desk Lamp",      category: "Home & Kitchen",units: 4,sales: 3596,  cost: 2000 },
  { date: "2026-03-27", product: "Hair Dryer",         category: "Beauty",      units: 5,  sales: 7495,  cost: 4000 },
  { date: "2026-03-30", product: "Cricket Bat",        category: "Sports",      units: 3,  sales: 5397,  cost: 3300 },

  // ---- April 2026 ----
  { date: "2026-04-02", product: "Bluetooth Speaker",  category: "Electronics", units: 6,  sales: 11994, cost: 7200 },
  { date: "2026-04-05", product: "Leather Wallet",     category: "Fashion",     units: 10, sales: 6990,  cost: 4000 },
  { date: "2026-04-08", product: "Blender",            category: "Home & Kitchen",units: 4,sales: 9996,  cost: 6000 },
  { date: "2026-04-11", product: "Lip Balm Set",       category: "Beauty",      units: 15, sales: 3735,  cost: 1650 },
  { date: "2026-04-14", product: "Dumbbell Set",       category: "Sports",      units: 3,  sales: 5997,  cost: 3900 },
  { date: "2026-04-17", product: "Power Bank",         category: "Electronics",units: 11, sales: 10989, cost: 6600 },
  { date: "2026-04-20", product: "Cotton T-Shirt",     category: "Fashion",     units: 14, sales: 6986,  cost: 3500 },
  { date: "2026-04-23", product: "Vacuum Flask",       category: "Home & Kitchen",units: 8,sales: 3992,  cost: 2160 },
  { date: "2026-04-26", product: "Sunscreen SPF50",    category: "Beauty",      units: 10, sales: 3990,  cost: 2000 },
  { date: "2026-04-29", product: "Resistance Bands",   category: "Sports",      units: 12, sales: 4788,  cost: 2400 },

  // ---- May 2026 ----
  { date: "2026-05-03", product: "Smartwatch",         category: "Electronics",units: 6,  sales: 23994, cost: 14400 },
  { date: "2026-05-06", product: "Running Shoes",      category: "Fashion",     units: 7,  sales: 20993, cost: 12600 },
  { date: "2026-05-09", product: "Non-stick Pan Set",  category: "Home & Kitchen",units: 5,sales: 7995,  cost: 4500 },
  { date: "2026-05-12", product: "Face Serum",         category: "Beauty",      units: 11, sales: 6589,  cost: 3300 },
  { date: "2026-05-15", product: "Cricket Bat",        category: "Sports",      units: 4,  sales: 7196,  cost: 4400 },
  { date: "2026-05-18", product: "Wireless Earbuds",   category: "Electronics",units: 8,  sales: 19992, cost: 12000 },
  { date: "2026-05-21", product: "Denim Jeans",        category: "Fashion",     units: 8,  sales: 10392, cost: 6000 },
  { date: "2026-05-24", product: "LED Desk Lamp",      category: "Home & Kitchen",units: 7,sales: 6293,  cost: 3500 },
  { date: "2026-05-27", product: "Hair Dryer",         category: "Beauty",      units: 6,  sales: 8994,  cost: 4800 },
  { date: "2026-05-30", product: "Yoga Mat",           category: "Sports",      units: 9,  sales: 6291,  cost: 3600 },

  // ---- June 2026 ----
  { date: "2026-06-02", product: "Bluetooth Speaker",  category: "Electronics",units: 9,  sales: 17991, cost: 10800 },
  { date: "2026-06-05", product: "Leather Wallet",     category: "Fashion",    units: 13, sales: 9087,  cost: 5200 },
  { date: "2026-06-08", product: "Blender",            category: "Home & Kitchen",units: 6,sales: 14994, cost: 9000 },
  { date: "2026-06-11", product: "Lip Balm Set",       category: "Beauty",     units: 18, sales: 4482,  cost: 1980 },
  { date: "2026-06-14", product: "Dumbbell Set",       category: "Sports",     units: 5,  sales: 9995,  cost: 6500 },
  { date: "2026-06-17", product: "Power Bank",         category: "Electronics",units: 14,sales: 13986, cost: 8400 },
  { date: "2026-06-20", product: "Cotton T-Shirt",     category: "Fashion",    units: 16, sales: 7984,  cost: 4000 },
  { date: "2026-06-23", product: "Vacuum Flask",       category: "Home & Kitchen",units: 10,sales: 4990,cost: 2700 },
  { date: "2026-06-26", product: "Sunscreen SPF50",    category: "Beauty",     units: 12, sales: 4788,  cost: 2400 },
  { date: "2026-06-29", product: "Resistance Bands",   category: "Sports",     units: 14, sales: 5586,  cost: 2800 },
];
