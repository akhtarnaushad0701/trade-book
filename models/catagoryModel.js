const db = require('./db');

module.exports = {
  getCat: () => db.query(`SELECT catID, CONCAT(catName,' ',quality) as catName FROM catagory`),
  getAll: () => db.query('SELECT * FROM catagory'),
  getById: (id) => db.query('SELECT * FROM catagory WHERE catID=?', [id]),
  create: (cat) =>
    db.query('INSERT INTO catagory (catName, quality, remarks) VALUES (?, ?, ?)',
      [cat.catName, cat.quality, cat.remarks]),
  update: (id, cat) =>
    db.query('UPDATE catagory SET catName=?, quality=?, remarks=? WHERE catID=?',
      [cat.catName, cat.quality, cat.remarks, id]),
  delete: (id) => db.query('DELETE FROM catagory WHERE catID=?', [id])
};