const mysql = require('mysql');
const sql = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'messenger_phake'
});

module.exports = sql;