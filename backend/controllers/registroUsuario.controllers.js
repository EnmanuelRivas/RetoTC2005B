import { pool } from "../db/db.js";

// Ver usuarios registrados
export const getUsuarios = (req, res) => {
    const query = "SELECT * FROM usuarios"; // Consulta para obtener todos los registros

    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener usuarios:", err.message);
            return res.status(500).json({ message: "Error al obtener usuarios" });
        }
        res.status(200).json(results); // Devuelve los registros
    });
}

// Registrar nuevo usuario
export const postUsuario = (req, res) => {
    const { correoUsuario, nombreUsuario, contraseñaUsuario } = req.body; // Datos capturados

    const query = "INSERT INTO usuarios (correoUsuario, nombreUsuario, contraseñaUsuario) VALUES (?, ?, ?)"; 

    pool.query(query, [correoUsuario, nombreUsuario, contraseñaUsuario], (err, result) => {
        if (err) {
            console.error("Error al insertar datos:", err.message);
            return res.status(500).json({ message: "Error al insertar datos en la base de datos" });
        }
        // Respuesta que indica que el registro fue recibido
        res.status(201).json({ message: "Usuario creado exitosamente", id: result.insertId });
    });
}

