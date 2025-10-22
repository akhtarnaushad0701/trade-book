const db = require('./db');

module.exports = {
  getAll: () => db.query('SELECT * FROM account'),
  getById: (id) => db.query('SELECT * FROM account where accID=?', [id]),
  create: (data) =>
    db.query('INSERT INTO account(accName, accType, Remark) VALUES (?, ?, ?)',
      [data.accName, data.accType, data.Remark]),
  update: (id, data) =>
    db.query('UPDATE account SET accName=?, accType=?, Remark=? WHERE accID=?',
      [data.accName, data.accType, data.Remark, id]),
  delete: (id) => db.query('DELETE FROM account WHERE accID=?', [id])
};