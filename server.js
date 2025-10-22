const express = require('express');
const mysql = require('mysql2');   // ✅ add mysql2
const app = express();
const PORT = 3000;

// MySQL connection
const connection = require('./models/db'); // using db.js

// Parse JSON request body
app.use(express.json());
// Serve static files (HTML, CSS, JS) from public folder
app.use(express.static('public'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/index', require('./routes/indexs'));
app.use('/api/catagory', require('./routes/catagory'));
app.use('/api/subcatagory', require('./routes/subcatagory'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/account', require('./routes/account'));
app.use('/api/expense', require('./routes/expense'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/my_sql', require('./routes/my_sql'));

//app.use('/api/supplierinfo', require('./routes/supplierinfo'));
// Import dashboard route
//const dashboardRouter = require('./dashboard.js');
//app.use('/', dashboardRouter); 

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Tradebook Node.js Server is running at http://localhost:${PORT}`);
});
