import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); 

export const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error de conexión a MySQL:', err.message);
  } else {
    console.log('Conexión a MySQL exitosa');
    connection.release(); 
  }
});