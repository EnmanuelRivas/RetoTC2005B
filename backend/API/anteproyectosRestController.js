
/*
const { getData, getDataWithParams, insertData, updateData } = require('../Data/MySQLMngr');


// Obtener todos los anteproyectos
router.get('/', async (req, res) => {
    try {
        const result = await getData("SELECT * FROM anteproyectos");

        if (!result.getStatus()) {
            return res.status(500).json({
                success: false,
                message: "Error al obtener los anteproyectos",
                error: result.getErr()
            });
        }

        res.status(200).json(result.getRows());
    } catch (error) {
        console.error("Error en GET /anteproyectos:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

// Obtener un anteproyecto por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await getDataWithParams("SELECT * FROM anteproyectos WHERE id = ?", [id]);

        if (!result.getStatus()) {
            return res.status(500).json({
                success: false,
                message: "Error al obtener el anteproyecto",
                error: result.getErr()
            });
        }

        if (result.getRows().length === 0) {
            return res.status(404).json({ success: false, message: "Anteproyecto no encontrado" });
        }

        res.status(200).json(result.getRows()[0]);
    } catch (error) {
        console.error("Error en GET /anteproyectos/:id:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

// Crear un nuevo anteproyecto
router.post('/', async (req, res) => {
    const { titulo, descripcion, fecha_creacion, id_usuario } = req.body;

    if (!titulo || !descripcion || !fecha_creacion || !id_usuario) {
        return res.status(400).json({ success: false, message: "Faltan campos requeridos" });
    }

    try {
        const query = `INSERT INTO anteproyectos (titulo, descripcion, fecha_creacion, id_usuario) VALUES (?, ?, ?, ?)`;
        const params = [titulo, descripcion, fecha_creacion, id_usuario];

        const result = await insertData(query, params);

        if (!result.getStatus()) {
            return res.status(500).json({
                success: false,
                message: "Error al insertar el anteproyecto",
                error: result.getErr()
            });
        }

        res.status(201).json({ success: true, message: "Anteproyecto creado", id: result.getGenId() });
    } catch (error) {
        console.error("Error en POST /anteproyectos:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

// Actualizar un anteproyecto
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion } = req.body;

    if (!titulo || !descripcion) {
        return res.status(400).json({ success: false, message: "Faltan campos requeridos" });
    }

    try {
        const query = `UPDATE anteproyectos SET titulo = ?, descripcion = ? WHERE id = ?`;
        const params = [titulo, descripcion, id];

        const result = await updateData(query, params);

        if (!result.getStatus()) {
            return res.status(500).json({
                success: false,
                message: "Error al actualizar el anteproyecto",
                error: result.getErr()
            });
        }

        res.status(200).json({ success: true, message: "Anteproyecto actualizado", changes: result.getChanges() });
    } catch (error) {
        console.error("Error en PUT /anteproyectos/:id:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

module.exports = router;


const getAnteproyectos = async (req, res) => {
  try {
    const result = await db.getData('SELECT * FROM anteproyectos');

    if (result.getStatus()) {
      res.status(200).json(result.getRows());
    } else {
      res.status(500).json({ error: 'Error al obtener anteproyectos', detalle: result.getErr() });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error inesperado en el servidor', detalle: error.message });
  }
};

const createAnteproyecto = async (req, res) => {
  const { usuario_id, titulo, descripcion, fecha_creacion, fecha_limite, estado } = req.body;

  const sql = `
    INSERT INTO anteproyectos (usuario_id, titulo, descripcion, fecha_creacion, fecha_limite, estado)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const params = [usuario_id, titulo, descripcion, fecha_creacion, fecha_limite, estado];

  try {
    const result = await db.insertData(sql, params);

    if (result.getStatus()) {
      res.status(201).json({
        mensaje: 'Anteproyecto guardado en la base de datos',
        id: result.getGenId()
      });
    } else {
      res.status(500).json({ error: 'Error al guardar anteproyecto', detalle: result.getErr() });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error inesperado en el servidor', detalle: error.message });
  }
};

module.exports = {
  getAnteproyectos,
  createAnteproyecto
};
*/

const express = require('express');
const router = express.Router();

const { getData, insertData } = require('../Data/MySQLMngr');

// Obtener todos los anteproyectos
router.get('/', async (req, res) => {
  try {
    const query = "SELECT * FROM anteproyecto";
    const result = await getData(query);
    if (!result.getStatus()) {
      return res.status(500).json({ error: 'Error al obtener anteproyectos', detalle: result.getErr() });
    }
    res.status(200).json(result.getRows());
  } catch (error) {
    res.status(500).json({ error: 'Error inesperado', detalle: error.message });
  }
});

// Crear un nuevo anteproyecto
router.post('/', async (req, res) => {
  try {
    const { usuario_id, titulo, descripcion, fecha_creacion, fecha_limite, estado } = req.body;

    const query = `INSERT INTO anteproyecto
      (usuario_id, titulo, descripcion, fecha_creacion, fecha_limite, estado) 
      VALUES (?, ?, ?, ?, ?, ?)`;

    const params = [usuario_id, titulo, descripcion, fecha_creacion, fecha_limite, estado];

    const result = await insertData(query, params);

    if (!result.getStatus()) {
      // Aquí podrías verificar si el error es por foreign key y devolver mensaje más claro
      if (result.getErr().includes('foreign key')) {
        return res.status(400).json({ error: 'El usuario_id no existe en la tabla Usuarios' });
      }
      return res.status(500).json({ error: 'Error al guardar anteproyecto', detalle: result.getErr() });
    }

    res.status(201).json({
      mensaje: 'Anteproyecto creado',
      id: result.getGenId(),
      data: req.body
    });
  } catch (error) {
    res.status(500).json({ error: 'Error inesperado', detalle: error.message });
  }
});

module.exports = router;