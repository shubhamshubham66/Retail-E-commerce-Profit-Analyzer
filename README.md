# Retail & E-commerce Profit Analyzer

A simple, beginner-friendly analytics dashboard built with **HTML, CSS, vanilla JavaScript, and Chart.js**. It analyzes retail/e-commerce order data — either the built-in sample dataset or your own imported CSV file — to show sales, profit, and performance by month, category, and product, entirely in the browser. No backend, database, login, AI features, or external API.

## Features

- Four KPI cards: **Total Sales**, **Total Profit**, **Total Orders**, **Profit Margin**
- Monthly **Sales & Profit** line chart
- **Sales by Category** doughnut chart
- **Top Selling Products** table (Product, Category, Units Sold, Sales, Profit)
- Month filter and category filter (combine together), with a **Reset Filters** button
- **CSV import** — upload your own retail transaction data
- Currency formatted in Indian Rupees (₹); profit margin safely handles zero sales
- Clean empty state when no data matches the selected filters
- Fully responsive (desktop and mobile)

## Project structure

```
index.html   → page markup (sidebar, import card, filters, KPI cards, charts, table)
style.css    → styling (white content area, dark sidebar, green accents)
data.js      → sample/demo dataset (SAMPLE_SALES_DATA) — the fallback when no CSV is imported
script.js    → all dashboard logic (CSV parsing/validation, KPI math, filtering, chart & table rendering)
```

## How it works

- The dashboard always has one **active dataset**: the sample data in `data.js` until you import a CSV file, after which the imported rows become the active dataset.
- `script.js` computes profit as `sales - cost` for every record, and derives all KPIs, chart data, and the product table from the active dataset — nothing is hardcoded separately from the data.
- Profit margin is calculated as `(profit / sales) * 100`, and safely returns `0%` when sales is `0`.
- Changing the month or category filter re-computes and re-renders the KPIs, both charts, and the table. The two filters combine (AND): e.g. "March" + "Electronics" shows only March electronics orders.
- **Reset Filters** clears the month/category filters back to "All" — it does *not* change the active dataset. Use **Use Sample Data** to switch back to the built-in sample dataset after importing a CSV.

## Importing your own CSV

Click **Choose CSV File** and pick a `.csv` file with these columns (header names are case-insensitive, any column order):

| Column   | Required?               | Notes                                             |
|----------|--------------------------|----------------------------------------------------|
| Date     | Yes                      | e.g. `2026-03-14`, or any format `Date.parse` understands |
| Product  | Yes                      | Product name                                      |
| Category | Yes                      | Product category                                  |
| Quantity | Yes                      | Positive whole number                             |
| Sales    | Yes                      | Non-negative number (total sale amount)           |
| Cost     | One of Cost / Profit required | Non-negative number (total cost amount)     |
| Profit   | One of Cost / Profit required | See calculation rule below                  |

**Profit calculation rule:**

- If a row has a **Cost** value, profit is always calculated as `Sales − Cost` (a Profit column, if also present on that row, is ignored for the calculation).
- If a row has **no Cost** value but does have a **Profit** value, Cost is derived as `Sales − Profit`. Profit cannot be greater than Sales — that would mean a negative cost — and is rejected as an invalid row if it is.
- A row with neither Cost nor Profit is invalid and is skipped.

**Validation behavior:**

- If the file is missing a required column, or has neither a Cost nor a Profit column at all, the whole file is rejected with an error message and the current dataset is left unchanged.
- Individual invalid rows (bad date, non-numeric or negative Quantity/Sales/Cost, Profit greater than Sales, etc.) are skipped, and a summary of what was skipped and why is shown after import.
- If every row in the file is invalid, the file is rejected and the current dataset is left unchanged.
- Blank lines are ignored.

A small sample CSV you can test with:

```csv
Date,Product,Category,Quantity,Sales,Cost
2026-07-01,Wireless Earbuds,Electronics,4,9996,6000
2026-07-03,Running Shoes,Fashion,2,5998,3600
2026-07-05,Yoga Mat,Sports,3,2097,1200
```

Or using a Profit column instead of Cost:

```csv
Date,Product,Category,Quantity,Sales,Profit
2026-07-01,Wireless Earbuds,Electronics,4,9996,3996
2026-07-03,Running Shoes,Fashion,2,5998,2398
```

## Running it locally

No build step, no installs — it's plain HTML/CSS/JS.

**Option 1 — just open it:**
Double-click `index.html` (or open it from your browser with File → Open). It will work, though some browsers restrict local file access slightly more strictly than a local server.

**Option 2 — use a simple local server (recommended):**

```bash
# From inside the project folder
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

Or, if you use VS Code, the **Live Server** extension works too — just right-click `index.html` → "Open with Live Server".

## Using your own data without the CSV importer

You can also replace the contents of the `SAMPLE_SALES_DATA` array in `data.js` directly, keeping the same shape:

```js
{ date: "2026-01-04", product: "Wireless Earbuds", category: "Electronics", units: 5, sales: 12495, cost: 7500 }
```
