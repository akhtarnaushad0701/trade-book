const db = require('./db');

module.exports = {
  getForTable: () => db.query(`SELECT expense.expID, DATE_FORMAT(expense.expDate,'%d-%m-%Y') as expDate, expense.accID, 
                              account.accName, account.accType,expense.amount,expense.remark FROM expense 
                              LEFT JOIN account ON expense.accID=account.accID ORDER BY expense.expID`),

  getExpenseWithSpclStr: (str) => db.query(`SELECT expense.expID, DATE_FORMAT(expense.expDate,'%d-%m-%Y') as expDate, expense.accID, 
                              account.accName, account.accType,expense.amount,expense.remark FROM expense 
                              LEFT JOIN account ON expense.accID=account.accID WHERE ${str} ORDER BY expense.expID`),
  getSqlQuery: (str) => db.query(str),

  getAll: () => db.query('SELECT * FROM expense'),
  getById: (id) => db.query("SELECT expID, accID,  DATE_FORMAT(expense.expDate,'%Y-%m-%d') as expDate, expHead, amount, remark FROM expense WHERE  expID=?", [id]),
  create: (data) =>
    db.query('INSERT INTO expense(accID, expDate, amount, remark) VALUES (?, ?, ?, ?)',
      [data.accID, data.expDate, data.amount, data.remark]),
  update: (id, data) =>
    db.query('UPDATE expense SET accID=?, expDate=?, amount=?, remark=? WHERE expID=?',
      [data.accID, data.expDate, data.amount, data.remark, id]),
  delete: (id) => db.query('DELETE FROM expense WHERE expID=?', [id])
};