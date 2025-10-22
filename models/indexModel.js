const db = require('./db');

module.exports = {
  // Profit/Loss summary
  getProfitLossSummary: () => db.query(`
    SELECT 
      SUM(totPQnty) as totPQnty,
      SUM(TotPurAmt) as TotPurAmt,
      SUM(TotPurAmt)/SUM(totPQnty) as avgPrate,
      SUM(saleQnty) as saleQnty,
      SUM(Stock) as Stock,
      SUM(PurAmt) as PurAmt,
      SUM(TotsAmt) as TotsAmt,
      SUM(TotsAmt)/SUM(saleQnty) as avgSrate,
      SUM(ProfitLoos) as ProfitLoos
    FROM find_profit_loss
  `),

  // Total Due summary
  getTotalDueSummary: () => db.query(`
    SELECT 
      SUM(Totsales) as Totsales,
      SUM(PrevDue) as PrevDue,
      SUM(TotPayment) as TotPayment,
      SUM(TotalDue) as TotalDue
    FROM find_total_due
  `),

  // Monthly Sales
  getMonthlySales: () => db.query(`
    SELECT 
      YEAR(saleDate) AS year,
      MONTH(saleDate) AS month_number,
      CONCAT(DATE_FORMAT(saleDate, '%b'), DATE_FORMAT(saleDate, '%y')) AS month_name,
      SUM(sAmount) AS total_sales
    FROM sales
    GROUP BY year, month_number
    ORDER BY year, month_number
  `)
};
