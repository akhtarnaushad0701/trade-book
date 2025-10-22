const db = require('./db');

module.exports = {
  getAll: () => db.query('SELECT * FROM supplier'),
  getById: (id) => db.query('SELECT * FROM supplier WHERE supID=?', [id]),
  create: (sup) =>
    db.query('INSERT INTO supplier (supName, supContact, supAdd, supRemark) VALUES (?, ?, ?, ?)',
      [sup.supName, sup.supContact, sup.supAdd, sup.supRemark]),
  update: (id, sup) =>
    db.query('UPDATE supplier SET supName=?, supContact=?, supAdd=?, supRemark=? WHERE supID=?',
      [sup.supName, sup.supContact, sup.supAdd, sup.supRemark, id]),
  delete: (id) => db.query('DELETE FROM supplier WHERE supID=?', [id])
};
