const db = require('./db');  // your database connection

module.exports = {
 getSqlQuery : (sql)=>  db.query(sql)  // returns a promise

};

