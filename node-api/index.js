const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.NODE_PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS current_time');
    res.json({
      servicio: "API Juan Manuel Polania Navarro - 2477452",
      base_datos: "PostgreSQL conectada correctamente",
      timestamp: result.rows[0].current_time,
      mensaje: "Entorno Docker con Nginx, Node.js, PostgreSQL, pgAdmin y Jupyter Lab operativo"
    });
  } catch (err) {
    res.status(500).json({
      servicio: "API Juan Manuel Polania Navarro - 2477452",
      estado: "Error de conexion a la base de datos",
      error: err.message
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: "OK", uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`[NodeApp] Servidor iniciado en el puerto ${PORT}`);
});
