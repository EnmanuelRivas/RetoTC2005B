const mysql = require('mysql2');
require('dotenv').config(); // Usar el .env local del game-api

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect(err => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err);
  } else {
    console.log('✅ Conectado a MySQL - Base de datos del videojuego AWAQ');
  }
});

module.exports = db;
