const db = require('./db');  // your MySQL connection pool



// Insert sales invoice and items
async function insertSale(invoiceData, items) {
  const conn = await db.getConnection(); // get pooled connection
  try {
    await conn.beginTransaction();

    // 1. Insert into salesinv
    const [result] = await conn.query(
      "INSERT INTO salesinv  (sale_date,CustID,sale_tot,remarks) VALUES (?,?,?,?)",
      [invoiceData.sale_date,invoiceData.CustID,invoiceData.sale_tot,invoiceData.remarks]
    );

    const saleId = result.insertId; // Auto increment ID

    // 2. Insert into salesinv_items
    const itemSql = `
      INSERT INTO salesinv_items (sale_id,catID,subcatID,qnty,sPrice,sAmount) VALUES (?, ?, ?, ?, ?, ?)
    `;
    for (const item of items) {
      await conn.query(itemSql, [
        saleId,
        item.catID,
        item.subcatID,
        item.qnty,
        item.sPrice,
        item.sAmount,
       
      ]);
    }

    await conn.commit();
    return { success: true, saleId };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// Update Sales Item
async function updateSale(invoiceData, items, id) {
  const conn = await db.getConnection(); // get pooled connection
  try {
    await conn.beginTransaction();

    // 1. Insert into salesinv
    const [result] = await conn.query(
      "UPDATE salesinv SET sale_date=?, CustID=?, sale_tot=?, remarks=? WHERE sale_id=?",
      [invoiceData.sale_date,invoiceData.CustID,invoiceData.sale_tot,invoiceData.remarks,id]
    );

    //const saleId = result.insertId; // Auto increment ID

    // 2. Insert into salesinv_items
    const newDataSql = `
      INSERT INTO salesinv_items (sale_id,catID,subcatID,qnty,sPrice,sAmount) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const oldDataSql = `UPDATE salesinv_items SET catID=?, subcatID=?, qnty=?, sPrice=?, sAmount=? WHERE sTrnid=?`;
    let submitted_ids = [];
    for (const item of items) {
      if (item.sTrnid) {
          await conn.query(oldDataSql, [
          
          item.catID,
          item.subcatID,
          item.qnty,
          item.sPrice,
          item.sAmount,
          item.sTrnid,
        ]);
        submitted_ids.push(item.sTrnid);
      }
      else
      {
         const [result1] =await conn.query(newDataSql, [
          id,
          item.catID,
          item.subcatID,
          item.qnty,
          item.sPrice,
          item.sAmount,
        ]);
        submitted_ids.push(result1.insertId);
      }
    }
    if (submitted_ids.length > 0) {
        // convert to comma-separated integers
        let ids_str = submitted_ids.map(id => parseInt(id, 10)).join(",");

        // SQL query
       
       await  conn.query( `DELETE FROM salesinv_items 
                  WHERE sale_id = ? 
                  AND sTrnid NOT IN (${ids_str})`, 
                  [id]);
    }
    else{
        await conn.query("DELETE FROM salesinv_items WHERE sale_id=?", [id]);
    }
    await conn.commit();
   return { success: true, saleId: id };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// Delete sales invoice and items
async function deleteSale(id) {
  const conn = await db.getConnection(); // get pooled connection
  try {
    await conn.beginTransaction();

    // 1. Insert into salesinv
    await conn.query("DELETE FROM salesinv_items WHERE sale_id=?",[id]);
    await conn.query("DELETE FROM salesinv WHERE sale_id=?", [id]);
   
    await conn.commit();
    return { success: true, saleId: id };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
module.exports = { insertSale, updateSale, deleteSale };