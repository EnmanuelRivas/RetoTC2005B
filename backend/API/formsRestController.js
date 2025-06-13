// formsRestController.js

const formsService = require("../Service/formsService.js");

// ------------ REGISTROS GENERALES ------------

async function getRegistros(req, res) {
  try {
    const rows = await formsService.getRegistros();
    res.status(200).json({
      status: "success",
      total: rows.length,
      records: rows,
    });
  } catch (error) {
    console.error("Error al obtener registros:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

async function postRegistros(req, res) {
  try {
    const { estadoTiempo, estacion, tipoRegistro } = req.body;
    const idRegistro = await formsService.insertRegistro({ estadoTiempo, estacion, tipoRegistro });
    res.status(201).json({
      status: "success",
      message: "Registro creado exitosamente",
      idRegistro,
    });
  } catch (error) {
    console.error("Error al insertar registro:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

// ------------ VARIABLES CLIMÁTICAS ------------

async function getVariablesClimatica(req, res) {
  try {
    const rows = await formsService.getVariablesClimatica();
    res.status(200).json({
      status: "success",
      total: rows.length,
      records: rows,
    });
  } catch (error) {
    console.error("Error al obtener variables climáticas:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

async function postVariablesClimatica(req, res) {
  try {
    const {
      estadoTiempo,
      estacion,
      tipoRegistro,
      zona,
      pluviosidadMm,
      temperaturaMaxima,
      humedadMaxima,
      temperaturaMinima,
      nivelQuebradaMt,
    } = req.body;

    const idRegistro = await formsService.insertRegistro({ estadoTiempo, estacion, tipoRegistro });

    const idVariable = await formsService.insertVariableClimatica(idRegistro, {
      zona,
      pluviosidadMm,
      temperaturaMaxima,
      humedadMaxima,
      temperaturaMinima,
      nivelQuebradaMt,
    });

    res.status(201).json({
      status: "success",
      message: "Registro climático creado exitosamente",
      idRegistro,
      idVariable,
    });
  } catch (error) {
    console.error("Error al insertar variable climática:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

// ------------ PARCELA VEGETACIÓN ------------

async function getParcelaVegetacion(req, res) {
  try {
    const rows = await formsService.getParcelaVegetacion();
    res.status(200).json({
      status: "success",
      total: rows.length,
      records: rows,
    });
  } catch (error) {
    console.error("Error al obtener parcela vegetación:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
}

async function postParcelaVegetacion(req, res) {
  try {
    const body = req.body;
    const idRegistro = await formsService.insertRegistro({
      estadoTiempo: body.estadoTiempo,
      estacion: body.estacion,
      tipoRegistro: body.tipoRegistro,
    });
    await formsService.insertParcelaVegetacion(idRegistro, body);

    res.status(201).json({
      status: "success",
      message: "Parcela de Vegetación creada exitosamente",
      idRegistro,
    });
  } catch (error) {
    console.error("Error al insertar parcela vegetación:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
}

// ------------ CAMARAS TRAMPA ------------

async function getCamarasTrampa(req, res) {
  try {
    const rows = await formsService.getCamarasTrampa();
    res.status(200).json({
      status: "success",
      total: rows.length,
      records: rows,
    });
  } catch (error) {
    console.error("Error al obtener camaras trampa:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
}

async function postCamarasTrampa(req, res) {
  try {
    const body = req.body;
    const idRegistro = await formsService.insertRegistro({
      estadoTiempo: body.estadoTiempo,
      estacion: body.estacion,
      tipoRegistro: body.tipoRegistro,
    });
    await formsService.insertCamarasTrampa(idRegistro, body);

    res.status(201).json({
      status: "success",
      message: "Cámara Trampa creada exitosamente",
      idRegistro,
    });
  } catch (error) {
    console.error("Error al insertar camaras trampa:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
}

// ------------ AGREGAR AQUÍ MÁS CONTROLLERS PARA LOS DEMÁS FORMULARIOS ------------
// Sigue este mismo patrón para fauna transecto, fauna punto de conteo, búsqueda libre, validación cobertura, etc.

// ------------ VALIDACION COBERTURA ------------
async function getValidacionCobertura(req, res) {
  try {
    const rows = await formsService.getValidacionCobertura();
    res.status(200).json({
      status: "success",
      total: rows.length,
      records: rows,
    });
  } catch (error) {
    console.error("Error al obtener validación cobertura:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
}

async function postValidacionCobertura(req, res) {
  try {
    const body = req.body;
    const idRegistro = await formsService.insertRegistro({
      estadoTiempo: body.estadoTiempo,
      estacion: body.estacion,
      tipoRegistro: body.tipoRegistro,
    });
    await formsService.insertValidacionCobertura(idRegistro, body);
    res.status(201).json({
      status: "success",
      message: "Validación Cobertura creado exitosamente",
      idRegistro,
    });
  } catch (error) {
    console.error("Error al insertar validación cobertura:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
}

// ------------ FAUNA TRANSECTO ------------
async function getFaunaTransecto(req, res) {
  try {
    const rows = await formsService.getFaunaTransecto();
    res.status(200).json({
      status: "success",
      total: rows.length,
      records: rows,
    });
  } catch (error) {
    console.error("Error al obtener fauna transecto:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
}

async function postFaunaTransecto(req, res) {
  try {
    const body = req.body;
    const idRegistro = await formsService.insertRegistro({
      estadoTiempo: body.estadoTiempo,
      estacion: body.estacion,
      tipoRegistro: body.tipoRegistro,
    });
    await formsService.insertFaunaTransecto(idRegistro, body);

    res.status(201).json({
      status: "success",
      message: "Fauna Transecto creado exitosamente",
      idRegistro,
    });
  } catch (error) {
    console.error("Error al insertar fauna transecto:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
}

// ------------ FAUNA PUNTO DE CONTEO ------------
async function getFaunaPuntoConteo(req, res) {
  try {
    const rows = await formsService.getFaunaPuntoConteo();
    res.status(200).json({
      status: "success",
      total: rows.length,
      records: rows,
    });
  } catch (error) {
    console.error("Error al obtener fauna punto de conteo:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
}

async function postFaunaPuntoConteo(req, res) {
  try {
    const body = req.body;
    const idRegistro = await formsService.insertRegistro({
      estadoTiempo: body.estadoTiempo,
      estacion: body.estacion,
      tipoRegistro: body.tipoRegistro,
    });
    await formsService.insertFaunaPuntoConteo(idRegistro, body);

    res.status(201).json({
      status: "success",
      message: "Fauna Punto de Conteo creado exitosamente",
      idRegistro,
    });
  } catch (error) {
    console.error("Error al insertar fauna punto de conteo:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
}

// ------------ BUSQUEDA LIBRE ------------
async function getBusquedaLibre(req, res) {
  try {
    const rows = await formsService.getBusquedaLibre();
    res.status(200).json({
      status: "success",
      total: rows.length,
      records: rows,
    });
  } catch (error) {
    console.error("Error al obtener búsqueda libre:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
}

async function postBusquedaLibre(req, res) {
  try {
    const body = req.body;
    const idRegistro = await formsService.insertRegistro({
      estadoTiempo: body.estadoTiempo,
      estacion: body.estacion,
      tipoRegistro: body.tipoRegistro,
    });
    await formsService.insertBusquedaLibre(idRegistro, body);

    res.status(201).json({
      status: "success",
      message: "Búsqueda Libre creado exitosamente",
      idRegistro,
    });
  } catch (error) {
    console.error("Error al insertar búsqueda libre:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
}

module.exports = {
  getRegistros,
  postRegistros,
  getVariablesClimatica,
  postVariablesClimatica,
  getParcelaVegetacion,
  postParcelaVegetacion,
  getCamarasTrampa,
  postCamarasTrampa,
  getFaunaTransecto,
  postFaunaTransecto,
  getFaunaPuntoConteo,
  postFaunaPuntoConteo,
  getBusquedaLibre,
  postBusquedaLibre,
  getValidacionCobertura,
  postValidacionCobertura
};
