const db = require('./db');

module.exports = {
  getSubCatWithJoin: () => db.query(`SELECT subcatagory.subcatID,CONCAT(catagory.catName,' ',
    catagory.quality) as catName,subcatagory.subcatNm,subcatagory.subcatRate,
		subcatagory.Locality FROM subcatagory LEFT JOIN catagory on catagory.catID=subcatagory.catID`),
    
  getSubCatByCatId: (id) => db.query('SELECT * FROM subcatagory WHERE catID=?', [id]),
  getAll: () => db.query('SELECT * FROM subcatagory'),
  getById: (id) => db.query('SELECT * FROM subcatagory WHERE subcatID=?', [id]),
  create: (subcat) =>
    db.query('INSERT INTO subcatagory (subcatNm, catID, subcatRate, Locality) VALUES (?, ?, ?, ?)',
      [subcat.subcatNm, subcat.catID, subcat.subcatRate, subcat.Locality]),
  update: (id, subcat) =>
    db.query('UPDATE subcatagory SET subcatNm=?, catID=?, subcatRate=?, Locality=? WHERE subcatID=?',
      [subcat.subcatNm, subcat.catID, subcat.subcatRate, subcat.Locality, id]),
  delete: (id) => db.query('DELETE FROM subcatagory WHERE subcatID=?', [id])
};