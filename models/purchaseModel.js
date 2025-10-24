const db = require('./db');  // your MySQL connection pool



// Insert sales invoice and items
async function insertPurchase(invoiceData, items) {
  const conn = await db.getConnection(); // get pooled connection
  try {
    await conn.beginTransaction();

    // 1. Insert into salesinv
    const [result] = await conn.query(
      "INSERT INTO purinv(pur_date, supID, invoice_no, tot_amount, remarks) VALUES (?, ?, ?, ?, ?)",
      [invoiceData.pur_date,invoiceData.supID,invoiceData.invoice_no,invoiceData.tot_amount,invoiceData.remarks]
    );

    const purId = result.insertId; // Auto increment ID

    // 2. Insert into salesinv_items
    const itemSql = `
      INSERT INTO purinv_items(pur_id, catID, subcatID, qnty, pur_rate, pur_amount) VALUES (?, ?, ?, ?, ?, ?)
    `;
    for (const item of items) {
      await conn.query(itemSql, [
        purId,
        item.catID,
        item.subcatID,
        item.qnty,
        item.pur_rate,
        item.pur_amount,
       
      ]);
    }

    await conn.commit();
    return { success: true, purId };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// Update Sales Item
async function updatePurchase(invoiceData, items, id) {
  const conn = await db.getConnection(); // get pooled connection
  try {
    await conn.beginTransaction();

    // 1. Insert into salesinv
    const [result] = await conn.query(
      "UPDATE purinv SET pur_date=?,supID=?,invoice_no=?,tot_amount=?,remarks=? WHERE pur_id=?",
      [invoiceData.pur_date,invoiceData.supID,invoiceData.invoice_no,invoiceData.tot_amount,invoiceData.remarks,id]
    );

    //const saleId = result.insertId; // Auto increment ID

    // 2. Insert into salesinv_items
    const newDataSql = `
      INSERT INTO purinv_items(pur_id, catID, subcatID, qnty, pur_rate, pur_amount) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const oldDataSql = `UPDATE purinv_items SET catID=?,subcatID=?,qnty=?,pur_rate=?,pur_amount=? WHERE pTran_id=? `;
    let submitted_ids = [];
    for (const item of items) {
      if (item.pTran_id) {
          await conn.query(oldDataSql, [
          
            item.catID,
            item.subcatID,
            item.qnty,
            item.pur_rate,
            item.pur_amount,
            item.pTran_id,
        ]);
        submitted_ids.push(item.pTran_id);
      }
      else
      {
         const [result1] =await conn.query(newDataSql, [
            id,
            item.catID,
            item.subcatID,
            item.qnty,
            item.pur_rate,
            item.pur_amount,
        ]);
        submitted_ids.push(result1.insertId);
      }
    }
    if (submitted_ids.length > 0) {
        // convert to comma-separated integers
        let ids_str = submitted_ids.map(id => parseInt(id, 10)).join(",");

        // SQL query
       
       await  conn.query( `DELETE FROM purinv_items 
                  WHERE pur_id = ? 
                  AND pTran_id NOT IN (${ids_str})`, 
                  [id]);
    }
    else{
        await conn.query("DELETE FROM purinv_items WHERE pur_id=?", [id]);
    }
    await conn.commit();
   return { success: true, purId: id };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// Delete sales invoice and items
async function deletePurchase(id) {
  const conn = await db.getConnection(); // get pooled connection
  try {
    await conn.beginTransaction();

    // 1. Insert into salesinv
    await conn.query("DELETE FROM purinv_items WHERE pur_id=?",[id]);
    await conn.query("DELETE FROM purinv WHERE pur_id=?", [id]);
   
    await conn.commit();
    return { success: true, purId: id };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
module.exports = { insertPurchase, updatePurchase, deletePurchase };