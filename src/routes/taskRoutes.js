const express = require('express');
const router = express.Router();

// Base de datos en memoria para pruebas
let tasks = [
  {
    id: 1,
    title: 'Configurar entorno de pruebas',
    description: 'Instalar Newman y Postman para pruebas de integración',
    status: 'completed',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Crear pipeline de CI/CD',
    description: 'Automatizar ejecución de pruebas en GitHub Actions',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

let nextId = 3;

// GET /api/tasks - Obtener todas las tareas
router.get('/', (req, res) => {
  const { status } = req.query;
  let filtered = tasks;

  if (status) {
    filtered = tasks.filter(t => t.status.toLowerCase() === status.toLowerCase());
  }

  res.status(200).json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

// GET /api/tasks/:id - Obtener tarea por ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'El ID proporcionado debe ser un número entero válido'
    });
  }

  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: `Tarea con ID ${id} no encontrada`
    });
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// POST /api/tasks - Crear nueva tarea
router.post('/', (req, res) => {
  const { title, description, status } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'El campo "title" es obligatorio y debe ser una cadena no vacía'
    });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    description: description ? String(description).trim() : '',
    status: status && ['pending', 'in-progress', 'completed'].includes(status) ? status : 'pending',
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    message: 'Tarea creada exitosamente',
    data: newTask
  });
});

// PUT /api/tasks/:id - Actualizar tarea existente
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'El ID proporcionado debe ser un número entero válido'
    });
  }

  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Tarea con ID ${id} no encontrada para actualización`
    });
  }

  const { title, description, status } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El campo "title" no puede estar vacío'
      });
    }
    tasks[taskIndex].title = title.trim();
  }

  if (description !== undefined) {
    tasks[taskIndex].description = String(description).trim();
  }

  if (status !== undefined) {
    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Opciones válidas: pending, in-progress, completed'
      });
    }
    tasks[taskIndex].status = status;
  }

  tasks[taskIndex].updatedAt = new Date().toISOString();

  res.status(200).json({
    success: true,
    message: 'Tarea actualizada exitosamente',
    data: tasks[taskIndex]
  });
});

// DELETE /api/tasks/:id - Eliminar tarea
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'El ID proporcionado debe ser un número entero válido'
    });
  }

  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Tarea con ID ${id} no encontrada para eliminación`
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: `Tarea con ID ${id} eliminada correctamente`,
    data: deletedTask
  });
});

module.exports = router;

