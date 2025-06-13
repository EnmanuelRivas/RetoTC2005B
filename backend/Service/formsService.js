const { pool } = require("../Data/MySQLMngr.js");

// ----------- Métodos Generales -----------
async function getRegistros() {
  const [rows] = await pool.promise().query("SELECT * FROM registros");
  return rows;
}

async function insertRegistro({ estadoTiempo, estacion, tipoRegistro }) {
  const [result] = await pool.promise().query(
    "INSERT INTO registros (estadoTiempo, estacion, tipoRegistro) VALUES (?, ?, ?)",
    [estadoTiempo, estacion, tipoRegistro]
  );
  return result.insertId;
}

async function getVariablesClimatica() {
  const [rows] = await pool.promise().query("SELECT * FROM variables_climaticas");
  return rows;
}

async function insertVariableClimatica(idRegistro, variable) {
  const {
    zona,
    pluviosidadMm,
    temperaturaMaxima,
    humedadMaxima,
    temperaturaMinima,
    nivelQuebradaMt
  } = variable;

  const [result] = await pool.promise().query(
    `INSERT INTO variables_climaticas 
    (idRegistro, zona, pluviosidadMm, temperaturaMaxima, humedadMaxima, temperaturaMinima, nivelQuebradaMt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [idRegistro, zona, pluviosidadMm, temperaturaMaxima, humedadMaxima, temperaturaMinima, nivelQuebradaMt]
  );

  return result.insertId;
}

// ----------- Parcela Vegetación -----------
async function getParcelaVegetacion() {
  const [rows] = await pool.promise().query("SELECT * FROM parcela_vegetacion");
  return rows;
}

async function insertParcelaVegetacion(idRegistro, body) {
  const {
    codigo, cuadrante, subCuadrante, habitoCrecimiento, nombreComun, nombreCientifico, placa,
    circunferenciaCm, distanciaMt, estaturaBiomonitorMt, alturaMt, evidencias, observaciones
  } = body;

  const evidenciasValor = Array.isArray(evidencias) && evidencias.length > 0 ? JSON.stringify(evidencias) : null;
  const observacionesValor = observaciones ? observaciones : null;

  await pool.promise().query(
    `INSERT INTO parcela_vegetacion (
      idRegistro, codigo, cuadrante, subCuadrante, habitoCrecimiento,
      nombreComun, nombreCientifico, placa, circunferenciaCm, distanciaMt,
      estaturaBiomonitorMt, alturaMt, evidencias, observaciones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      idRegistro, codigo, cuadrante, subCuadrante, habitoCrecimiento,
      nombreComun, nombreCientifico, placa, circunferenciaCm, distanciaMt,
      estaturaBiomonitorMt, alturaMt, evidenciasValor, observacionesValor
    ]
  );
}

// ----------- Camaras Trampa -----------
async function getCamarasTrampa() {
  const [rows] = await pool.promise().query("SELECT * FROM camaras_trampa");
  return rows;
}

async function insertCamarasTrampa(idRegistro, body) {
  const {
    codigo, zona, nombreCamara, placaCamara, placaGuaya, anchoCaminoMt, fechaInstalacion,
    distanciaObjetivoMt, alturaLenteMt, listaChequeo, evidencias, observaciones
  } = body;

  const evidenciasValor = Array.isArray(evidencias) && evidencias.length > 0 ? JSON.stringify(evidencias) : null;
  const observacionesValor = observaciones ? observaciones : null;
  let fechaParaInsertar = null;
  if (fechaInstalacion) {
    const fecha = new Date(fechaInstalacion);
    if (!isNaN(fecha)) {
      fechaParaInsertar = fecha.toISOString().slice(0, 19).replace('T', ' ');
    }
  }

  await pool.promise().query(
    `INSERT INTO camaras_trampa (
      idRegistro, codigo, zona, nombreCamara, placaCamara,
      placaGuaya, anchoCaminoMt, fechaInstalacion, distanciaObjetivoMt,
      alturaLenteMt, listaChequeo, evidencias, observaciones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      idRegistro, codigo, zona, nombreCamara, placaCamara, placaGuaya, anchoCaminoMt,
      fechaParaInsertar, distanciaObjetivoMt, alturaLenteMt, listaChequeo, evidenciasValor, observacionesValor
    ]
  );
}

// ----------- Validación Cobertura -----------
async function getValidacionCobertura() {
  const [rows] = await pool.promise().query("SELECT * FROM validacion_cobertura");
  return rows;
}

async function insertValidacionCobertura(idRegistro, body) {
  const {
    codigo, transecto, subtransecto, distanciaMt, especie, grupo,
    sexo, edad, comportamiento, observaciones
  } = body;
  const observacionesValor = observaciones ? observaciones : null;
  await pool.promise().query(
    `INSERT INTO validacion_cobertura (
      idRegistro, codigo, transecto, subtransecto, distanciaMt,
      especie, grupo, sexo, edad, comportamiento,
      observaciones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      idRegistro, codigo, transecto, subtransecto, distanciaMt,
      especie, grupo, sexo, edad, comportamiento,
      observacionesValor
    ]
  );
}

// ----------- Fauna Transecto -----------
async function getFaunaTransecto() {
  const [rows] = await pool.promise().query("SELECT * FROM fauna_transecto");
  return rows;
}

async function insertFaunaTransecto(idRegistro, body) {
  const {
    codigo, transecto, subtransecto, distanciaMt, especie, grupo,
    sexo, edad, comportamiento, observaciones
  } = body;

  const observacionesValor = observaciones ? observaciones : null;

  await pool.promise().query(
    `INSERT INTO fauna_transecto (
      idRegistro, codigo, transecto, subtransecto, distanciaMt,
      especie, grupo, sexo, edad, comportamiento,
      observaciones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      idRegistro, codigo, transecto, subtransecto, distanciaMt,
      especie, grupo, sexo, edad, comportamiento,
      observacionesValor
    ]
  );
}

// ----------- Fauna Punto de Conteo -----------
async function getFaunaPuntoConteo() {
  const [rows] = await pool.promise().query("SELECT * FROM fauna_punto_conteo");
  return rows;
}

async function insertFaunaPuntoConteo(idRegistro, body) {
  const {
    codigo, transecto, subtransecto, distanciaMt, especie, grupo,
    sexo, edad, comportamiento, observaciones
  } = body;

  const observacionesValor = observaciones ? observaciones : null;

  await pool.promise().query(
    `INSERT INTO fauna_punto_conteo (
      idRegistro, codigo, transecto, subtransecto, distanciaMt,
      especie, grupo, sexo, edad, comportamiento,
      observaciones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      idRegistro, codigo, transecto, subtransecto, distanciaMt,
      especie, grupo, sexo, edad, comportamiento,
      observacionesValor
    ]
  );
}

// ----------- Fauna Transecto -----------
async function getFaunaTransecto() {
  const [rows] = await pool.promise().query("SELECT * FROM fauna_transecto");
  return rows;
}

async function insertFaunaTransecto(idRegistro, body) {
  const {
    codigo, transecto, subtransecto, distanciaMt, especie, grupo,
    sexo, edad, comportamiento, observaciones
  } = body;

  const observacionesValor = observaciones ? observaciones : null;

  await pool.promise().query(
    `INSERT INTO fauna_transecto (
      idRegistro, codigo, transecto, subtransecto, distanciaMt,
      especie, grupo, sexo, edad, comportamiento,
      observaciones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      idRegistro, codigo, transecto, subtransecto, distanciaMt,
      especie, grupo, sexo, edad, comportamiento,
      observacionesValor
    ]
  );
}

// ----------- Punto de Conteo -----------
async function getPuntoConteo() {
  const [rows] = await pool.promise().query("SELECT * FROM fauna_punto_conteo");
  return rows;
}

async function insertPuntoConteo(idRegistro, body) {
  const {
    codigo, transecto, subtransecto, distanciaMt, especie, grupo,
    sexo, edad, comportamiento, observaciones
  } = body;

  const observacionesValor = observaciones ? observaciones : null;

  await pool.promise().query(
    `INSERT INTO fauna_punto_conteo (
      idRegistro, codigo, transecto, subtransecto, distanciaMt,
      especie, grupo, sexo, edad, comportamiento,
      observaciones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      idRegistro, codigo, transecto, subtransecto, distanciaMt,
      especie, grupo, sexo, edad, comportamiento,
      observacionesValor
    ]
  );
}

// ----------- Busqueda Libre -----------
async function getBusquedaLibre() {
  const [rows] = await pool.promise().query("SELECT * FROM fauna_busqueda_libre");
  return rows;
}

async function insertBusquedaLibre(idRegistro, body) {
  const {
    codigo, transecto, subtransecto, distanciaMt, especie, grupo,
    sexo, edad, comportamiento, observaciones
  } = body;

  const observacionesValor = observaciones ? observaciones : null;

  await pool.promise().query(
    `INSERT INTO fauna_busqueda_libre (
      idRegistro, codigo, transecto, subtransecto, distanciaMt,
      especie, grupo, sexo, edad, comportamiento,
      observaciones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      idRegistro, codigo, transecto, subtransecto, distanciaMt,
      especie, grupo, sexo, edad, comportamiento,
      observacionesValor
    ]
  );
}


// Exporta todos los métodos que necesites en controllers
module.exports = {
  getRegistros,
  insertRegistro,
  getVariablesClimatica,
  insertVariableClimatica,
  getParcelaVegetacion,
  insertParcelaVegetacion,
  getCamarasTrampa,
  insertCamarasTrampa,
  getValidacionCobertura,
  insertValidacionCobertura,
  getFaunaTransecto,
  insertFaunaTransecto,
  getFaunaPuntoConteo,
  insertFaunaPuntoConteo,
  getPuntoConteo,
  insertPuntoConteo,
  getBusquedaLibre,
  insertBusquedaLibre
};
