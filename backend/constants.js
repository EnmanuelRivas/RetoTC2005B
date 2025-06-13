require('dotenv').config();

// Constantes globales para el servidor
const port = process.env.PORT || 5000;
const indexURL = '/';
const apiURL = '/api';
const contextURL = '/awaq';

// Exporta las constantes para que estén disponibles en otros módulos
module.exports = {
  port,
  indexURL,
  apiURL,
  contextURL
};
  