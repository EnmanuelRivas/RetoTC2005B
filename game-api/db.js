const mysql = require('mysql2');
require('dotenv').config({ path: '../backend/.env' }); // Usar el .env del backend

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD, // Usar la contraseña del .env
  database: 'awaq_juego' // Base de datos específica del juego
});

db.connect(err => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err);
  } else {
    console.log('✅ Conectado a MySQL - Base de datos del videojuego AWAQ');
  }
});

module.exports = db;
