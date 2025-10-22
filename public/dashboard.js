const express = require('express');
const router = express.Router();
const connection = require('./db'); // using db.js

router.get('/', (req, res) => {
    const sql1 = `SELECT 
SUM(totPQnty) as totPQnty,SUM(TotPurAmt) as TotPurAmt,SUM(TotPurAmt)/SUM(totPQnty) as avgPrate,SUM(saleQnty) as saleQnty ,SUM(Stock) as Stock,
SUM(PurAmt) as PurAmt,SUM(TotsAmt) as TotsAmt,SUM(TotsAmt)/SUM(saleQnty) as avgSrate,SUM(ProfitLoos) as ProfitLoos FROM find_profit_loss`;

    connection.query(sql1, (err, result1) => {
    if (err) throw err;
    const r1 = result1[0] || {};

    const totPQnty = r1.totPQnty || 0;
    const TotPurAmt = r1.TotPurAmt || 0;
    const avgPrate = Number(r1.avgPrate || 0);
    const saleQnty = r1.saleQnty || 0;
    const avgSrate = Number(r1.avgSrate || 0);
    const TotsAmt = r1.TotsAmt || 0;
    const Stock = r1.Stock || 0;
    const PurAmt = r1.PurAmt || 0;
    const ProfitLoos = r1.ProfitLoos || 0;

      // Query 2: Total Due
    const sql2 = `
      SELECT 
        SUM(Totsales) as Totsales,
        SUM(PrevDue) as PrevDue,
        SUM(TotPayment) as TotPayment,
        SUM(TotalDue) as TotalDue
      FROM find_total_due
    `;

    connection.query(sql2, (err, result2) => {
      if (err) throw err;
      const r2 = result2[0] || {};

      const Totsales = r2.Totsales || 0;
      const PrevDue = r2.PrevDue || 0;
      const TotPayment = r2.TotPayment || 0;
      const TotalDue = r2.TotalDue || 0;

    const sql3 = `
        SELECT 
          YEAR(saleDate) AS year,
          MONTH(saleDate) AS month_number,
          CONCAT(DATE_FORMAT(saleDate, '%b'), DATE_FORMAT(saleDate, '%y')) AS month_name,
          SUM(sAmount) AS total_sales
        FROM sales
        GROUP BY year, month_number
        ORDER BY year, month_number
      `;

      connection.query(sql3, (err, result3) => {
        if (err) throw err;

        const months = result3.map(r => r.month_name);
        const salesData = result3.map(r => r.total_sales);
    

        res.send(`
<!DOCTYPE html>
<html>

<head>
<title>Business Dashboard</title>
<link rel="stylesheet" href="/menuHeader.css">
<!-- Google Fonts (offline you can replace with local copy) -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">

<!-- Font Awesome (download for offline use) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
    body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        background: #f4f6f9;
    }
    .mainDiv {
        max-width: 1200px;
        margin: 30px auto;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 6px 30px rgba(0,0,0,0.15);
        padding: 30px;
    }
    h1 {
        text-align: center;
        margin-bottom: 25px;
        color: #1976d2;
        font-size: 28px;
        font-weight: 600;
    }
    .card-grid {
		margin-top: 10px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        margin-bottom: 30px;
    }
    .card {
        background: #fff;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 3px 15px rgba(0,0,0,0.1);
        text-align: center;
        transition: transform 0.2s;
    }
    .card:hover {
        transform: translateY(-5px);
    }
    .card i {
        font-size: 28px;
        margin-bottom: 10px;
        color: #1976d2;
    }
    .card h3 {
        margin: 5px 0;
        font-size: 18px;
        font-weight: 600;
        color: #333;
    }
    .card p {
        font-size: 16px;
        color: rgb(0,200,0);
		font-weight:bold;
    }
    .chart-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 20px;
        margin-bottom: 30px;
    }
    .chart-container {
        background: #fff;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 3px 15px rgba(0,0,0,0.1);
    }
    .table-container {
        background: #fff;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 3px 15px rgba(0,0,0,0.1);
        margin-bottom: 20px;
        overflow: auto;
        max-height: 300px;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        padding: 5px;
        <!--border-bottom: 1px solid #eee; -->
        text-align: left;
        font-size: 14px;
		 font-weight: bold;
    }
    th {
        background: #f4f6f9;
        font-weight: 600;
	
    }
    tr:hover {
        background: #f9f9f9;
    }
.toggle-box {
    padding: 15px;
    background: rgb(204, 0, 0);
	width:100%; 
	text-align: center;
	
    color: white;
    cursor: pointer;
    border-radius: 10px;
    margin-bottom: 10px;
	
}
.toggle-box:hover
{
		 background: rgb(255, 40, 40);
		  box-shadow: 0 3px 15px rgba(0,0,0,0.5);
}
.details {
    display: none;  /* hidden by default */
    padding: 15px;
	width:100%;
    background: white;
    border-radius: 6px;
    margin-bottom: 10px;
	 box-shadow: 0 3px 15px rgba(0,0,0,0.1);
}

.chart-container {
      width: 80%;
      max-width: 600px;
      margin: 40px auto;
    }
</style>
<script>
function toggleInfo(id) {
    let box = document.getElementById(id);
    if (box.style.display === "block") {
        box.style.display = "none";  // hide
    } else {
        box.style.display = "block"; // show
    }
}
</script>
 
</head>
<body>
<div id="menu-placeholder">Hi.. How are you</div>
<script>
// Load menu.html dynamically

fetch("/menu.html")
  .then(resp => resp.text())
  .then(html => document.getElementById("menu-placeholder").innerHTML = html);
</script>
<div class="mainDiv">
    <h1><i class="fa-solid fa-briefcase"></i>  Business Dashboard</h1>
<div style="display: flex;">
	<div style="width:300px;  background: white; border: 1px solid white; justify-content: center;  padding: 25px;">
		<div class="toggle-box" onclick="toggleInfo('info1')">  <i class="fa-solid fa-truck"></i> <h3> Purchase Value</h3></div>
			<div id="info1" class="details">
			 <table>
          <tr><td>Qnty:</td><td>${totPQnty}</td></tr>
          <tr><td>Avg. Rate:</td><td>₹ $${Number(avgPrate || 0).toFixed(2)}</td></tr>
          <tr><td>Tot. Amount:</td><td>₹ ${Number(TotPurAmt || 0).toFixed(2)}</td></tr>
        </table>
      </div>
	

		<div class="toggle-box" onclick="toggleInfo('info2')"><i class="fa-solid fa-bag-shopping"></i>  <h3>Sale Value</h3></div>
			<div id="info2" class="details">
			  <table>
          <tr><td>Qnty:</td><td>${saleQnty}</td></tr>
          <tr><td>Avg. Rate:</td><td>₹ ${Number(avgSrate || 0).toFixed(2)}</td></tr>
          <tr><td>Tot. Amount:</td><td>₹ ${Number(TotsAmt || 0).toFixed(2)}</td></tr>
        </table>
			</div>
			<div class="toggle-box" onclick="toggleInfo('info3')"> <i class="fa-solid fa-warehouse"></i>  <h3>Stock Value</h3></div>
			<div id="info3" class="details">
			 <table>
          <tr><td>Qnty:</td><td>${Stock}</td></tr>
          <tr><td>Avg. Rate:</td><td>₹ ${Number(avgPrate || 0).toFixed(2)}</td></tr>
          <tr><td>Tot. Amount:</td><td>₹ ${Number(avgPrate*Stock || 0).toFixed(2)}</td></tr>
        </table>
			</div>
			<div class="toggle-box" onclick="toggleInfo('info4')"><i class="fa-solid fa-money-bill-trend-up"></i>  <h3>Profit/Loss</h3></div>
			<div id="info4" class="details">
			     <table>
          <tr><td>Sale:</td><td>₹ ${Number(TotsAmt || 0).toFixed(2)}</td></tr>
          <tr><td>Purchase:</td><td>₹ ${Number(PurAmt || 0).toFixed(2)}</td></tr>
          <tr><td>Gross Profit:</td><td>₹${Number(ProfitLoos || 0).toFixed(2)}</td></tr>
        </table>
			</div>
			<div class="toggle-box" onclick="toggleInfo('info5')"><i class="fas fa-money-bill-wave"></i></i>  <h3>Total Expense</h3></div>
			<div id="info5" class="details">
			    <table>
				  <tr>
				  <td>Sale:</td> <td>₹ <td>
				  </tr>
				  <tr>
				  <td>Purchase:</td> <td>₹<td>
				  </tr>
				  <tr>
				  <td>Gross Profit:</td> <td> ₹<td>
				  </tr>
				 </table>
			</div>
		</div>
    <div style="width:800px; background:white;">
      <div class="card-grid">
        <div class="card"><i class="fas fa-chart-line"></i><h3>Total Sales</h3><p>₹${Number(Totsales || 0).toFixed(2)}</p></div>
        <div class="card"><i class="fas fa-history"></i><h3>Opening Due</h3><p style="color:red">₹${Number(PrevDue || 0).toFixed(2)}</p></div>
        <div class="card"><i class="fa-solid fa-money-bill-trend-up"></i><h3>Total Payment</h3><p>₹${Number(TotPayment || 0).toFixed(2)}</p></div>
        <div class="card"><i class="fas fa-balance-scale"></i><h3>Total Due</h3><p style="color:red">₹${Number(TotalDue || 0).toFixed(2)}</p></div>
      </div>
      <div class="chart-container">
        <canvas id="salesChart"></canvas>
      </div>
    </div>

  </div>    
</div>
<script>
const ctx = document.getElementById('salesChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ${JSON.stringify(months)},
    datasets: [{
      label: "Monthly Sales",
      data: ${JSON.stringify(salesData)},
      borderColor: "rgba(0, 0, 200, 1)",
      backgroundColor: "rgba(0, 0, 200, 0.2)",
      tension: 0.4,
      fill: true,
      pointRadius: 5,
      pointBackgroundColor: "#fff",
      pointBorderColor: "rgba(75, 192, 192, 1)"
    }]
  },
  options: { responsive: true }
});
</script>
</body>
</html>
        `);
    });
    });
     });
});

module.exports = router;
