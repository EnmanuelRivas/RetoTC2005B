const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  decimalNumbers: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

class QueryResult {
    constructor(status, rows, gen_id, changes, err) {
        this.status = status;
        this.rows = rows;
        this.gen_id = gen_id;
        this.changes = changes;
        this.err = err;
    }

    getStatus = () => { return this.status; }
    getRows = () => { return this.rows; }
    getGenId = () => { return this.gen_id; }
    getChanges = () => { return this.changes; }
    getErr = () => { return this.err; }
}

// Ya NO necesitas 'open()' porque usamos pool siempre.

// Obtener datos sin parámetros
async function getData(query) {
    try {
        console.log("Get Data");
        const [rows] = await pool.promise().query(query);
        return new QueryResult(true, rows, 0, 0, '');
    } catch (error) {
        return new QueryResult(false, [], 0, 0, error.message);
    }
}

// Obtener datos con parámetros
async function getDataWithParams(query, params) {
    try {
        console.log("Get Data with Params");
        const [rows] = await pool.promise().query(query, params);
        return new QueryResult(true, rows, 0, 0, '');
    } catch (error) {
        return new QueryResult(false, [], 0, 0, error.message);
    }
}

// Insertar datos
async function insertData(query, params) {
    try {
        console.log("Insert Data");
        const [result] = await pool.promise().query(query, params);
        return new QueryResult(true, result, result.insertId, result.affectedRows, '');
    } catch (error) {
        return new QueryResult(false, null, 0, 0, error.message);
    }
}

// Insertar varios datos a la vez (bulk)
async function bulkInsertData(query, elements) {
    try {
        console.log("BULK Insert Data");
        const [result] = await pool.promise().query(query, [elements]);
        return new QueryResult(true, result, result.insertId, result.affectedRows, '');
    } catch (error) {
        return new QueryResult(false, null, 0, 0, error.message);
    }
}

// Actualizar datos
async function updateData(query, params) {
    try {
        console.log("Update Data");
        const [result] = await pool.promise().query(query, params);
        return new QueryResult(true, result, 0, result.affectedRows, '');
    } catch (error) {
        return new QueryResult(false, null, 0, 0, error.message);
    }
}

module.exports = {
    getData,
    getDataWithParams,
    insertData,
    bulkInsertData,
    updateData,
    QueryResult,
    pool // para los servicios que quieran usar pool directo
};
