// const mysql = require('mysql2');
// const dotenv = require('dotenv');
// dotenv.config();

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   charset: 'utf8mb4',
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('❌ MySQL connection error:', err);
//     process.exit(1);
//   }
//   console.log(`✅ MySQL connected to database: ${process.env.DB_NAME}`);
// });

// module.exports = connection;




const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,        // रात्रभर idle connection जिवंत ठेवते
  keepAliveInitialDelay: 10000,
});

// फक्त startup तपासणी — fail झालं तरी process मारत नाही
connection.getConnection((err, conn) => {
  if (err) {
    console.error('❌ MySQL connection error:', err.message);
    return;   // process.exit नाही — पुढच्या query ला pool आपोआप पुन्हा जोडेल
  }
  console.log(`✅ MySQL connected to database: ${process.env.DB_NAME}`);
  conn.release();
});

module.exports = connection;