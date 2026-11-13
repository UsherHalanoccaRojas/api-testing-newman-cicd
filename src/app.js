const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint de verificación de salud (Health Check)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'task-management-api',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`
  });
});

// Rutas de recursos de la API
app.use('/api/tasks', taskRoutes);

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

module.exports = app;

