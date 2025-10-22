// db.js
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'trade_test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = connection;







/*
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',      // your MySQL password
    database: 'trade_test'
});

connection.connect(err => {
    if (err) console.error('DB connection error:', err);
    else console.log('Connected to MySQL (db.js)');
});

module.exports = connection;
*/