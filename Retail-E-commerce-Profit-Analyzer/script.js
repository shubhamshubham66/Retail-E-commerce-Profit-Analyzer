/**
 * script.js
 * -----------------------------------------------------------------------
 * Retail & E-commerce Profit Analyzer — dashboard logic.
 *
 * Reads the active dataset (sample data from data.js, or an imported CSV
 * file), computes KPIs/charts/table from it, and re-renders everything
 * whenever filters change or a new dataset is loaded.
 * No backend, no database, no login, no AI — everything runs in the browser.
 *
 * Record shape used throughout (same for sample data and parsed CSV rows):
 *   { date: "YYYY-MM-DD", product, category, units, sales, cost }
 *   profit for a record = sales - cost
 * -----------------------------------------------------------------------
 */

(function () {
  "use strict";

  // ---------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------

  /** Format a number as Indian Rupees, e.g. 125000 -> "₹1,25,000" */
  function formatINR(amount) {
    const safe = Number.isFinite(amount) ? amount : 0;
    const rounded = Math.round(safe);
    return "₹" + rounded.toLocaleString("en-IN");
  }

  /** "2026-01-04" -> "2026-01" */
  function getMonthKey(dateStr) {
    return dateStr.slice(0, 7);
  }

  /** "2026-01" -> "Jan 2026" */
  function formatMonthLabel(monthKey) {
    const [year, month] = monthKey.split("-");
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }

  /** profit margin % = profit / sales * 100, safe for sales = 0 (and negative-sales edge cases) */
  function calcMarginPct(sales, profit) {
    if (!sales) return 0;
    return (profit / sales) * 100;
  }

  function round2(n) {
    return Math.round(n * 100) / 100;
  }

  // ---------------------------------------------------------------
  // State
  // ---------------------------------------------------------------

  const state = {
    month: "all",
    category: "all",
  };

  /** The dataset currently powering the dashboard — starts as the sample data. */
  let currentData = SAMPLE_SALES_DATA;

  let lineChart = null;
  let doughnutChart = null;

  // ---------------------------------------------------------------
  // DOM references
  // ---------------------------------------------------------------

  const monthFilterEl = document.getElementById("monthFilter");
  const categoryFilterEl = document.getElementById("categoryFilter");
  const resetBtn = document.getElementById("resetFilters");
  const emptyStateResetBtn = document.getElementById("emptyStateReset");

  const kpiSalesEl = document.getElementById("kpiSales");
  const kpiProfitEl = document.getElementById("kpiProfit");
  const kpiOrdersEl = document.getElementById("kpiOrders");
  const kpiMarginEl = document.getElementById("kpiMargin");

  const tableBodyEl = document.getElementById("productTableBody");
  const emptyStateEl = document.getElementById("emptyState");
  const tableEl = document.getElementById("productTable");

  const csvFileInputEl = document.getElementById("csvFileInput");
  const useSampleDataBtn = document.getElementById("useSampleDataBtn");
  const importStatusEl = document.getElementById("importStatus");
  const dataSourceSubtitleEl = document.getElementById("dataSourceSubtitle");

  // ---------------------------------------------------------------
  // Build filter options from the active dataset (no hardcoding)
  // ---------------------------------------------------------------

  function populateFilterOptions() {
    // Reset back to just the "All" option, then rebuild from currentData.
    monthFilterEl.innerHTML = '<option value="all">All months</option>';
    categoryFilterEl.innerHTML = '<option value="all">All categories</option>';

    const months = Array.from(new Set(currentData.map((r) => getMonthKey(r.date)))).sort();
    months.forEach((monthKey) => {
      const opt = document.createElement("option");
      opt.value = monthKey;
      opt.textContent = formatMonthLabel(monthKey);
      monthFilterEl.appendChild(opt);
    });

    const categories = Array.from(new Set(currentData.map((r) => r.category))).sort();
    categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      categoryFilterEl.appendChild(opt);
    });

    monthFilterEl.value = "all";
    categoryFilterEl.value = "all";
  }

  // ---------------------------------------------------------------
  // Filtering (month and category filters combine with AND logic)
  // ---------------------------------------------------------------

  function getFilteredData() {
    return currentData.filter((row) => {
      const monthMatches = state.month === "all" || getMonthKey(row.date) === state.month;
      const categoryMatches = state.category === "all" || row.category === state.category;
      return monthMatches && categoryMatches;
    });
  }

  // ---------------------------------------------------------------
  // KPI calculation
  // ---------------------------------------------------------------

  function renderKPIs(rows) {
    const totalSales = rows.reduce((sum, r) => sum + r.sales, 0);
    const totalCost = rows.reduce((sum, r) => sum + r.cost, 0);
    const totalProfit = totalSales - totalCost;
    const totalOrders = rows.length;
    const margin = calcMarginPct(totalSales, totalProfit);

    kpiSalesEl.textContent = formatINR(totalSales);
    kpiProfitEl.textContent = formatINR(totalProfit);
    kpiOrdersEl.textContent = totalOrders.toLocaleString("en-IN");
    kpiMarginEl.textContent = margin.toFixed(1) + "%";
  }

  // ---------------------------------------------------------------
  // Monthly sales & profit line chart
  // ---------------------------------------------------------------

  function renderLineChart(rows) {
    const byMonth = {};
    rows.forEach((r) => {
      const key = getMonthKey(r.date);
      if (!byMonth[key]) byMonth[key] = { sales: 0, profit: 0 };
      byMonth[key].sales += r.sales;
      byMonth[key].profit += r.sales - r.cost;
    });

    const months = Object.keys(byMonth).sort();
    const labels = months.map(formatMonthLabel);
    const salesSeries = months.map((m) => byMonth[m].sales);
    const profitSeries = months.map((m) => byMonth[m].profit);

    const ctx = document.getElementById("lineChart").getContext("2d");

    if (lineChart) lineChart.destroy();

    lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Sales",
            data: salesSeries,
            borderColor: "#1fa971",
            backgroundColor: "rgba(31, 169, 113, 0.12)",
            tension: 0.3,
            fill: true,
            pointRadius: 3,
          },
          {
            label: "Profit",
            data: profitSeries,
            borderColor: "#16895a",
            backgroundColor: "rgba(22, 137, 90, 0.08)",
            borderDash: [5, 4],
            tension: 0.3,
            fill: true,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${formatINR(ctx.parsed.y)}`,
            },
          },
        },
        scales: {
          y: {
            ticks: { callback: (value) => formatINR(value) },
          },
        },
      },
    });
  }

  // ---------------------------------------------------------------
  // Sales-by-category doughnut chart
  // ---------------------------------------------------------------

  const CATEGORY_COLORS = ["#1fa971", "#58c99a", "#0e6b45", "#9be3c3", "#145c3b", "#7fd4ac", "#2fcf8e", "#0a4530"];

  function renderDoughnutChart(rows) {
    const byCategory = {};
    rows.forEach((r) => {
      byCategory[r.category] = (byCategory[r.category] || 0) + r.sales;
    });

    const categories = Object.keys(byCategory).sort();
    const values = categories.map((c) => byCategory[c]);

    const ctx = document.getElementById("doughnutChart").getContext("2d");

    if (doughnutChart) doughnutChart.destroy();

    doughnutChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: categories,
        datasets: [
          {
            data: values,
            backgroundColor: categories.map((_, i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length]),
            borderWidth: 2,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "62%",
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${formatINR(ctx.parsed)}`,
            },
          },
        },
      },
    });
  }

  // ---------------------------------------------------------------
  // Top-selling products table
  // ---------------------------------------------------------------

  function renderProductTable(rows) {
    const byProduct = {};

    rows.forEach((r) => {
      if (!byProduct[r.product]) {
        byProduct[r.product] = {
          product: r.product,
          category: r.category,
          units: 0,
          sales: 0,
          profit: 0,
        };
      }
      byProduct[r.product].units += r.units;
      byProduct[r.product].sales += r.sales;
      byProduct[r.product].profit += r.sales - r.cost;
    });

    const products = Object.values(byProduct).sort((a, b) => b.sales - a.sales);

    tableBodyEl.innerHTML = "";

    if (products.length === 0) {
      tableEl.hidden = true;
      emptyStateEl.hidden = false;
      return;
    }

    tableEl.hidden = false;
    emptyStateEl.hidden = true;

    products.forEach((p) => {
      const tr = document.createElement("tr");

      const profitClass = p.profit >= 0 ? "profit-positive" : "profit-negative";

      tr.innerHTML = `
        <td>${escapeHtml(p.product)}</td>
        <td><span class="cat-badge">${escapeHtml(p.category)}</span></td>
        <td>${p.units.toLocaleString("en-IN")}</td>
        <td>${formatINR(p.sales)}</td>
        <td class="${profitClass}">${formatINR(p.profit)}</td>
      `;

      tableBodyEl.appendChild(tr);
    });
  }

  /** Minimal HTML-escaping for values that originate from an uploaded CSV. */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // ---------------------------------------------------------------
  // Master render
  // ---------------------------------------------------------------

  function render() {
    const rows = getFilteredData();
    renderKPIs(rows);
    renderProductTable(rows);

    if (rows.length === 0) {
      // Still clear charts so stale data isn't shown behind the empty state.
      if (lineChart) lineChart.destroy();
      if (doughnutChart) doughnutChart.destroy();
      lineChart = null;
      doughnutChart = null;
      return;
    }

    renderLineChart(rows);
    renderDoughnutChart(rows);
  }

  // ---------------------------------------------------------------
  // Filter events
  // ---------------------------------------------------------------

  function resetFilters() {
    state.month = "all";
    state.category = "all";
    monthFilterEl.value = "all";
    categoryFilterEl.value = "all";
    render();
  }

  monthFilterEl.addEventListener("change", (e) => {
    state.month = e.target.value;
    render();
  });

  categoryFilterEl.addEventListener("change", (e) => {
    state.category = e.target.value;
    render();
  });

  resetBtn.addEventListener("click", resetFilters);
  emptyStateResetBtn.addEventListener("click", resetFilters);

  // =================================================================
  // CSV import
  // =================================================================
  //
  // Expected columns (case-insensitive, any order): Date, Product,
  // Category, Quantity, Sales, and at least one of Cost / Profit.
  //
  // Data rules:
  //  - If a row has a Cost value, profit is always calculated as
  //    Sales - Cost (a Profit column, if also present, is ignored for
  //    that row's calculation).
  //  - If a row has no Cost value but does have a Profit value, Cost is
  //    derived as Sales - Profit. Profit cannot exceed Sales (that would
  //    mean a negative cost), which is treated as a validation error.
  //  - A row with neither Cost nor Profit is invalid and is skipped.
  //
  // Invalid individual rows are skipped (with a reported reason); an
  // invalid file (missing required columns, no data, zero valid rows)
  // is rejected entirely and the active dataset is left unchanged.

  const REQUIRED_HEADERS = ["Date", "Product", "Category", "Quantity", "Sales"];

  /** Parses one CSV line into fields, honoring double-quoted fields (with "" as an escaped quote). */
  function parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];

      if (inQuotes) {
        if (ch === '"') {
          if (line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        result.push(current);
        current = "";
      } else {
        current += ch;
      }
    }

    result.push(current);
    return result.map((s) => s.trim());
  }

  function parseCSV(text) {
    const lines = text.split(/\r\n|\n|\r/).filter((l) => l.trim() !== "");
    if (lines.length === 0) return { headers: [], rows: [] };

    const headers = parseCSVLine(lines[0]);
    const rows = lines.slice(1).map(parseCSVLine);
    return { headers, rows };
  }

  function validateHeaders(headers) {
    const lowerHeaders = headers.map((h) => h.toLowerCase());
    const missing = REQUIRED_HEADERS.filter((h) => !lowerHeaders.includes(h.toLowerCase()));
    const hasCost = lowerHeaders.includes("cost");
    const hasProfit = lowerHeaders.includes("profit");

    const errors = [];
    if (missing.length > 0) {
      errors.push(`Missing required column${missing.length === 1 ? "" : "s"}: ${missing.join(", ")}.`);
    }
    if (!hasCost && !hasProfit) {
      errors.push('The file must include a "Cost" column, a "Profit" column, or both.');
    }

    return { valid: errors.length === 0, errors, hasCost, hasProfit };
  }

  /** Normalizes a date string to "YYYY-MM-DD", or returns null if it can't be parsed. */
  function parseDateValue(value) {
    const trimmed = String(value || "").trim();
    if (!trimmed) return null;

    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
    if (isoMatch) {
      const d = new Date(trimmed + "T00:00:00");
      return isNaN(d.getTime()) ? null : trimmed;
    }

    const parsed = new Date(trimmed);
    if (isNaN(parsed.getTime())) return null;

    const yyyy = parsed.getFullYear();
    const mm = String(parsed.getMonth() + 1).padStart(2, "0");
    const dd = String(parsed.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  /** Parses a numeric field, tolerating "₹", commas and surrounding whitespace. */
  function parseNumericValue(value) {
    if (value === undefined || value === null) return NaN;
    const cleaned = String(value).replace(/[₹,\s]/g, "");
    if (cleaned === "") return NaN;
    return Number(cleaned);
  }

  function transformRows(headers, rawRows, hasCost, hasProfit) {
    const colIndex = {};
    headers.forEach((h, i) => {
      colIndex[h.toLowerCase()] = i;
    });

    const records = [];
    const errors = [];

    rawRows.forEach((row, i) => {
      const lineNum = i + 2; // +1 for header row, +1 for 1-based line numbers

      if (row.every((cell) => cell.trim() === "")) return; // skip blank lines

      const rawDate = row[colIndex["date"]] ?? "";
      const product = (row[colIndex["product"]] ?? "").trim();
      const category = (row[colIndex["category"]] ?? "").trim();
      const rawQuantity = row[colIndex["quantity"]] ?? "";
      const rawSales = row[colIndex["sales"]] ?? "";
      const rawCost = hasCost ? row[colIndex["cost"]] ?? "" : "";
      const rawProfit = hasProfit ? row[colIndex["profit"]] ?? "" : "";

      const date = parseDateValue(rawDate);
      if (!date) {
        errors.push(`Row ${lineNum}: invalid Date ("${rawDate}").`);
        return;
      }

      if (!product) {
        errors.push(`Row ${lineNum}: Product is empty.`);
        return;
      }

      if (!category) {
        errors.push(`Row ${lineNum}: Category is empty.`);
        return;
      }

      const units = parseNumericValue(rawQuantity);
      if (!Number.isFinite(units) || units <= 0 || !Number.isInteger(units)) {
        errors.push(`Row ${lineNum}: Quantity must be a positive whole number ("${rawQuantity}").`);
        return;
      }

      const sales = parseNumericValue(rawSales);
      if (!Number.isFinite(sales) || sales < 0) {
        errors.push(`Row ${lineNum}: Sales must be a non-negative number ("${rawSales}").`);
        return;
      }

      let cost;

      if (hasCost && String(rawCost).trim() !== "") {
        cost = parseNumericValue(rawCost);
        if (!Number.isFinite(cost) || cost < 0) {
          errors.push(`Row ${lineNum}: Cost must be a non-negative number ("${rawCost}").`);
          return;
        }
        // Profit, if also present on this row, is recalculated as Sales - Cost.
      } else if (hasProfit && String(rawProfit).trim() !== "") {
        const profit = parseNumericValue(rawProfit);
        if (!Number.isFinite(profit)) {
          errors.push(`Row ${lineNum}: Profit must be a number ("${rawProfit}").`);
          return;
        }
        const derivedCost = sales - profit;
        if (derivedCost < -0.01) {
          errors.push(`Row ${lineNum}: Profit ("${rawProfit}") cannot be greater than Sales ("${rawSales}").`);
          return;
        }
        cost = Math.max(derivedCost, 0);
      } else {
        errors.push(`Row ${lineNum}: must include a value for Cost or Profit.`);
        return;
      }

      records.push({
        date,
        product,
        category,
        units: Math.round(units),
        sales: round2(sales),
        cost: round2(cost),
      });
    });

    return { records, errors };
  }

  function summarizeErrors(errors, limit) {
    const shown = errors.slice(0, limit);
    let text = shown.join(" ");
    if (errors.length > limit) {
      text += ` …and ${errors.length - limit} more.`;
    }
    return text;
  }

  function setImportStatus(type, message) {
    importStatusEl.textContent = message;
    importStatusEl.className = "import-status" + (type ? " " + type : "");
  }

  function setActiveDataset(records, sourceLabel) {
    currentData = records;
    state.month = "all";
    state.category = "all";
    populateFilterOptions();
    render();
    dataSourceSubtitleEl.textContent = `Overview of sales, profit and performance — using ${sourceLabel}`;
  }

  function handleCSVFile(file) {
    const reader = new FileReader();

    reader.onerror = () => {
      setImportStatus("error", "Could not read the selected file. Please try again.");
    };

    reader.onload = (event) => {
      const text = String(event.target.result || "");
      const { headers, rows } = parseCSV(text);

      if (headers.length === 0 || rows.length === 0) {
        setImportStatus("error", "That file is empty or isn't a valid CSV.");
        return;
      }

      const headerCheck = validateHeaders(headers);
      if (!headerCheck.valid) {
        setImportStatus("error", "Could not import this file. " + headerCheck.errors.join(" "));
        return;
      }

      const { records, errors } = transformRows(headers, rows, headerCheck.hasCost, headerCheck.hasProfit);

      if (records.length === 0) {
        setImportStatus(
          "error",
          `No valid rows were found in this file, so nothing was imported. ${summarizeErrors(errors, 5)}`
        );
        return;
      }

      setActiveDataset(records, `imported data (${file.name})`);

      const rowWord = records.length === 1 ? "row" : "rows";
      if (errors.length > 0) {
        setImportStatus(
          "warning",
          `Imported ${records.length} ${rowWord} from "${file.name}". Skipped ${errors.length} invalid row${
            errors.length === 1 ? "" : "s"
          }: ${summarizeErrors(errors, 5)}`
        );
      } else {
        setImportStatus("success", `Imported ${records.length} ${rowWord} from "${file.name}".`);
      }
    };

    reader.readAsText(file);
  }

  csvFileInputEl.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) handleCSVFile(file);
  });

  useSampleDataBtn.addEventListener("click", () => {
    csvFileInputEl.value = "";
    setActiveDataset(SAMPLE_SALES_DATA, "sample demo data");
    setImportStatus("success", "Showing sample demo data.");
  });

  // ---------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------

  populateFilterOptions();
  render();
})();
