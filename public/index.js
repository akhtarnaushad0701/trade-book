async function loadDashboard() {
  try {
    // Profit/Loss
    const res1 = await fetch('/api/index/profit-loss');
    const profLoss = await res1.json();
   

        document.getElementById("purVal1").textContent=profLoss.totPQnty;
        document.getElementById("purVal2").textContent="₹"+Number(profLoss.avgPrate || 0).toFixed(2);
        document.getElementById("purVal3").textContent="₹"+Number(profLoss.TotPurAmt || 0).toFixed(2);

        document.getElementById("salVal1").textContent=profLoss.saleQnty;
        document.getElementById("salVal2").textContent="₹"+Number(profLoss.avgSrate || 0).toFixed(2);
        document.getElementById("salVal3").textContent="₹"+Number(profLoss.TotsAmt || 0).toFixed(2);

        document.getElementById("stVal1").textContent=profLoss.Stock;
        document.getElementById("stVal2").textContent="₹" +Number(profLoss.avgPrate || 0).toFixed(2);
        document.getElementById("stVal3").textContent="₹" +Number((profLoss.avgPrate)*(profLoss.Stock) || 0).toFixed(2);

        document.getElementById("plVal1").textContent="₹" +Number(profLoss.TotsAmt || 0).toFixed(2);
        document.getElementById("plVal2").textContent="₹" +Number(profLoss.PurAmt || 0).toFixed(2);
        document.getElementById("plVal3").textContent="₹" +Number(profLoss.ProfitLoos || 0).toFixed(2);

    // Total Due
    const res2 = await fetch('/api/index/total-due');
    const totalDue = await res2.json();
   

       document.getElementById("tsVal1").textContent="₹"+Number(totalDue.Totsales || 0).toFixed(2);
       document.getElementById("odVal1").textContent="₹"+Number(totalDue.PrevDue || 0).toFixed(2);
       document.getElementById("tpVal1").textContent="₹"+Number(totalDue.TotPayment || 0).toFixed(2);
       document.getElementById("tdVal1").textContent="₹"+Number(totalDue.TotalDue || 0).toFixed(2);
       
       

    // Monthly Sales
    const res3 = await fetch('/api/index/monthly-sales');
    const monthly = await res3.json();
    
    const months = monthly.map(row => row.month_name);
    const salesData = monthly.map(row => row.total_sales);

    // Draw Chart.js line graph
    const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: "Monthly Sales",
          data: salesData,
          borderColor: "rgba(0, 0, 200, 1)",
          backgroundColor: "rgba(0, 0, 200, 0.2)",
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointBackgroundColor: "#fff",
          pointBorderColor: "rgba(75, 192, 192, 1)"
        }]
      },
      options: { 
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });


  } catch (err) {
    console.error('Error loading dashboard:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadDashboard);
