const db = require('./db');

module.exports = {
  getPaymentWithJoin: () => db.query(`SELECT p.pmtID,DATE_FORMAT(p.pmtDate,'%d-%m-%Y') as pmtDate,p.CustID,c.CustName, 
                                    p.pmtAmount,p.Remark FROM payment p LEFT JOIN 
                                    customers c ON p.CustID=c.CustID ORDER BY p.pmtID`),
    
  getPaymentByCustId: (id) => db.query(`SELECT p.pmtID,DATE_FORMAT(p.pmtDate,'%Y-%m-%d') as pmtDate,p.CustID,c.CustName, p.pmtAmount,p.Remark FROM payment p LEFT JOIN customers c ON p.CustID=c.CustID WHERE p.CustID=?`, [id]),

  getAll: () => db.query('SELECT * FROM payment'),

  getById: (id) => db.query(`SELECT p.pmtID, p.pmtID,DATE_FORMAT(p.pmtDate,'%Y-%m-%d') as pmtDate,p.CustID,c.CustName, p.pmtAmount,p.Remark FROM payment p LEFT JOIN customers c ON p.CustID=c.CustID WHERE p.pmtID=?`, [id]),

  create: (p) =>
    db.query('INSERT INTO payment(pmtID, pmtDate, CustID, pmtAmount, Remark) VALUES (?, ?, ?, ?, ?)',
      [p.pmtID, p.pmtDate, p.CustID, p.pmtAmount, p.Remark]),

  update: (id, p) =>
    db.query('UPDATE payment SET pmtDate=?, CustID=?, pmtAmount=?, Remark=? WHERE pmtID=?',
      [p.pmtDate, p.CustID, p.pmtAmount, p.Remark, id]),

  delete: (id) => db.query('DELETE FROM payment WHERE pmtID=?', [id])
};