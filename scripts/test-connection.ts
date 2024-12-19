import mysql from 'mysql2/promise';

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      ssl: {
        rejectUnauthorized: true
      }
    });

    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    console.log('Connection successful:', rows);
    await connection.end();
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

testConnection(); 