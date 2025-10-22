const db = require('./db');

module.exports = {
  getAll: () => db.query('SELECT * FROM customers'),
  getById: (id) => db.query('SELECT * FROM customers WHERE CustID=?', [id]),
  create: (Cust) =>
    db.query('INSERT INTO customers (CustName, Contact, Address, PrevDue, Remark) VALUES (?, ?, ?, ?, ?)',
      [Cust.CustName, Cust.Contact, Cust.Address, Cust.PrevDue, Cust.Remark]),
  update: (id, Cust) =>
    db.query('UPDATE customers SET CustName=?, Contact=?, Address=?, PrevDue=?, Remark=? WHERE CustID=?',
      [Cust.CustName, Cust.Contact, Cust.Address, Cust.PrevDue, Cust.Remark, id]),
  delete: (id) => db.query('DELETE FROM customers WHERE CustID=?', [id])
};