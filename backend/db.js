const mysql = require('mysql2/promise');

const connectToMySql = async () => {
  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '9452701545asD@',
      database: 'user_management',
    });

    console.log('Connected to MySQL');
    return db;
  } catch (err) {
    console.log('Error connecting to MySQL', err);
    throw err;
  }
};

module.exports = connectToMySql;
