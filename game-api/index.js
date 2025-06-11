const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// 🔍 Middleware de logging para Unity
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n🎮 [${timestamp}] ${req.method} ${req.url}`);
  console.log(`🌐 User-Agent: ${req.headers['user-agent'] || 'No especificado'}`);
  console.log(`📡 Origin: ${req.headers.origin || 'No especificado'}`);
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`📦 Body:`, req.body);
  }
  
  if (req.query && Object.keys(req.query).length > 0) {
    console.log(`🔗 Query:`, req.query);
  }
  
  next();
});

// 🩺 Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('✅ Health check solicitado desde Unity');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'AWAQ Game API funcionando correctamente',
    endpoints: [
      'GET /api/preguntas',
      'GET /pregunta/aleatoria',
      'GET /pregunta/:id',
      'POST /api/leaderboard',
      'GET /api/leaderboard'
    ]
  });
});

// 🔁 Obtener todas las preguntas (para Unity)
app.get('/api/preguntas', (req, res) => {
  console.log('📚 Unity solicitando TODAS las preguntas');
  
  const query = `
    SELECT p.id, c.texto_contexto, p.texto_pregunta, p.respuesta_correcta
    FROM Preguntas p
    JOIN Contextos c ON p.contexto_id = c.id
    ORDER BY p.id
  `;

  db.query(query, (err, preguntas) => {
    if (err) {
      console.error('❌ Error BD en /api/preguntas:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    
    console.log(`📊 Encontradas ${preguntas.length} preguntas en BD`);
    
    if (preguntas.length === 0) {
      console.log('⚠️  No hay preguntas en la base de datos');
      return res.json([]);
    }

    let preguntasCompletas = [];
    let processedCount = 0;

    preguntas.forEach((pregunta, index) => {
      db.query(
        'SELECT texto_incorrecto FROM RespuestasIncorrectas WHERE pregunta_id = ?',
        [pregunta.id],
        (err2, incorrectas) => {
          if (!err2) {
            const respuestasIncorrectas = incorrectas.map(r => r.texto_incorrecto);
            preguntasCompletas[index] = {
              id: pregunta.id,
              contexto: pregunta.texto_contexto,
              pregunta: pregunta.texto_pregunta,
              respuesta_correcta: pregunta.respuesta_correcta,
              respuestas_incorrectas: respuestasIncorrectas
            };
          }
          
          processedCount++;
          if (processedCount === preguntas.length) {
            const resultadoFinal = preguntasCompletas.filter(p => p);
            console.log(`✅ Enviando ${resultadoFinal.length} preguntas completas a Unity`);
            res.json(resultadoFinal);
          }
        }
      );
    });
  });
});

// 🎲 Obtener una pregunta aleatoria
app.get('/pregunta/aleatoria', (req, res) => {
  console.log('🎲 Unity solicitando pregunta ALEATORIA');
  console.log('🔢 IDs usados recibidos:', req.query.usados);
  
  let usados = [];

  try {
    if (req.query.usados) {
      if (req.query.usados.startsWith('[')) {
        usados = JSON.parse(req.query.usados);
      } else {
        usados = req.query.usados
          .split(',')
          .map((id) => parseInt(id))
          .filter((id) => !isNaN(id));
      }
    }
    console.log('🔢 IDs procesados:', usados);
  } catch (error) {
    console.error('❌ Error parseando IDs usados:', error);
    return res.status(400).json({ error: 'Formato incorrecto de lista de usados' });
  }

  const condicion = usados.length > 0 ? `WHERE p.id NOT IN (${usados.join(",")})` : "";
  console.log('🔍 Condición SQL:', condicion);

  const query = `
    SELECT p.id, c.texto_contexto, p.texto_pregunta, p.respuesta_correcta
    FROM Preguntas p
    JOIN Contextos c ON p.contexto_id = c.id
    ${condicion}
    ORDER BY RAND()
    LIMIT 1;
  `;

  db.query(query, (err, preguntaResult) => {
    if (err) {
      console.error('❌ Error BD en pregunta aleatoria:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    
    if (preguntaResult.length === 0) {
      console.log('⚠️  No hay más preguntas disponibles');
      return res.status(204).send();
    }

    const pregunta = preguntaResult[0];
    console.log(`🎯 Pregunta seleccionada: ID ${pregunta.id}`);

    db.query(
      'SELECT texto_incorrecto FROM RespuestasIncorrectas WHERE pregunta_id = ?',
      [pregunta.id],
      (err2, incorrectas) => {
        if (err2) {
          console.error('❌ Error obteniendo respuestas incorrectas:', err2);
          return res.status(500).json({ error: 'Error al obtener respuestas incorrectas' });
        }

        const respuestas = incorrectas.map(r => r.texto_incorrecto);
        respuestas.push(pregunta.respuesta_correcta);

        const mezcladas = respuestas.sort(() => Math.random() - 0.5);
        const indexCorrecta = mezcladas.indexOf(pregunta.respuesta_correcta);

        console.log(`✅ Enviando pregunta ID ${pregunta.id} con ${mezcladas.length} respuestas`);
        console.log(`🎯 Índice respuesta correcta: ${indexCorrecta}`);

        res.json({
          pregunta: {
            id: pregunta.id,
            contexto: pregunta.texto_contexto,
            pregunta: pregunta.texto_pregunta,
            respuestas: mezcladas,
            respuesta_correcta_index: indexCorrecta
          }
        });
      }
    );
  });
});

// 🔍 Obtener pregunta específica por ID
app.get('/pregunta/:id', (req, res) => {
  const id = req.params.id;
  console.log(`🔍 Unity solicitando pregunta específica ID: ${id}`);

  const query = `
    SELECT p.id, c.texto_contexto, p.texto_pregunta, p.respuesta_correcta
    FROM Preguntas p
    JOIN Contextos c ON p.contexto_id = c.id
    WHERE p.id = ?;
  `;

  db.query(query, [id], (err, preguntaResult) => {
    if (err || preguntaResult.length === 0) {
      console.error(`❌ Pregunta ID ${id} no encontrada`);
      return res.status(500).json({ error: 'Pregunta no encontrada' });
    }

    const pregunta = preguntaResult[0];
    console.log(`✅ Pregunta ID ${id} encontrada`);

    db.query(
      'SELECT texto_incorrecto FROM RespuestasIncorrectas WHERE pregunta_id = ?',
      [id],
      (err2, incorrectas) => {
        if (err2) {
          console.error('❌ Error obteniendo respuestas incorrectas:', err2);
          return res.status(500).json({ error: 'Error al obtener respuestas incorrectas' });
        }

        const respuestas = incorrectas.map(r => r.texto_incorrecto);
        respuestas.push(pregunta.respuesta_correcta);

        const mezcladas = respuestas.sort(() => Math.random() - 0.5);
        const indexCorrecta = mezcladas.indexOf(pregunta.respuesta_correcta);

        console.log(`✅ Enviando pregunta ID ${id} con ${mezcladas.length} respuestas`);

        res.json({
          pregunta: {
            id: pregunta.id,
            contexto: pregunta.texto_contexto,
            pregunta: pregunta.texto_pregunta,
            respuestas: mezcladas,
            respuesta_correcta_index: indexCorrecta
          }
        });
      }
    );
  });
});

// 🏆 POST Guardar tiempo en leaderboard
app.post('/api/leaderboard', (req, res) => {
  const { nombre, tiempo } = req.body;
  console.log(`🏆 Unity enviando score - Jugador: ${nombre}, Tiempo: ${tiempo}`);

  if (!nombre || isNaN(tiempo)) {
    console.error('❌ Datos inválidos:', { nombre, tiempo });
    return res.status(400).json({ error: 'Nombre o tiempo inválido' });
  }

  const query = `INSERT INTO leaderboard (nombre, tiempo) VALUES (?, ?)`;
  db.query(query, [nombre, tiempo], (err) => {
    if (err) {
      console.error('❌ Error insertando en leaderboard:', err);
      return res.status(500).json({ error: 'Error al insertar en leaderboard' });
    }
    console.log(`✅ Score guardado correctamente: ${nombre} - ${tiempo}s`);
    res.json({ mensaje: 'Tiempo registrado correctamente' });
  });
});

// 🏆 GET Obtener leaderboard
app.get('/api/leaderboard', (req, res) => {
  console.log('🏆 Unity solicitando leaderboard top 10');
  
  const query = `
    SELECT nombre, tiempo, fecha
    FROM leaderboard
    ORDER BY tiempo ASC
    LIMIT 10
  `;

  db.query(query, (err, resultados) => {
    if (err) {
      console.error('❌ Error obteniendo leaderboard:', err);
      return res.status(500).json({ error: 'Error al obtener leaderboard' });
    }
    console.log(`✅ Enviando top ${resultados.length} scores a Unity`);
    res.json(resultados);
  });
});

// Rutas de compatibilidad (mantener las originales)
app.post('/leaderboard', (req, res) => {
  console.log('🔄 Request a ruta legacy /leaderboard');
  const { nombre, tiempo } = req.body;

  if (!nombre || isNaN(tiempo)) {
    return res.status(400).json({ error: 'Nombre o tiempo inválido' });
  }

  const query = `INSERT INTO leaderboard (nombre, tiempo) VALUES (?, ?)`;
  db.query(query, [nombre, tiempo], (err) => {
    if (err) return res.status(500).json({ error: 'Error al insertar en leaderboard' });
    res.json({ mensaje: 'Tiempo registrado correctamente' });
  });
});

app.post('/leaderboard/guardar', (req, res) => {
  console.log('🔄 Request a ruta legacy /leaderboard/guardar');
  const { nombre, tiempo } = req.body;

  if (!nombre || isNaN(tiempo)) {
    return res.status(400).json({ error: 'Nombre o tiempo inválido' });
  }

  const query = `INSERT INTO leaderboard (nombre, tiempo) VALUES (?, ?)`;
  db.query(query, [nombre, tiempo], (err) => {
    if (err) return res.status(500).json({ error: 'Error al insertar en leaderboard' });
    res.json({ mensaje: 'Tiempo registrado correctamente (por /guardar)' });
  });
});

app.get('/leaderboard/top', (req, res) => {
  console.log('🔄 Request a ruta legacy /leaderboard/top');
  
  const query = `
    SELECT nombre, tiempo, fecha
    FROM leaderboard
    ORDER BY tiempo ASC
    LIMIT 10
  `;

  db.query(query, (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error al obtener leaderboard' });
    res.json({ top: resultados });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 AWAQ Game API corriendo en http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log('📡 Endpoints disponibles:');
  console.log('   GET  /api/health');
  console.log('   GET  /api/preguntas');
  console.log('   GET  /pregunta/aleatoria');
  console.log('   GET  /pregunta/:id');
  console.log('   POST /api/leaderboard');
  console.log('   GET  /api/leaderboard');
});