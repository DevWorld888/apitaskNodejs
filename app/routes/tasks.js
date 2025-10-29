import express from 'express';
// Router de Express maneja las rutas
const router = express.Router();

import { getAllTasks,createTask,getTaskById,updateTaskById,deleteTaskById } from '../controllers/tasks.js';

// Ruta para obtener todas las tareas
router.get('/', getAllTasks);
router.post('/', createTask);

// Ruta para obtener una tarea por ID
router.get('/:id', getTaskById);

// Ruta para actualizar una tarea por ID
router.put('/:id', updateTaskById);

// Ruta para eliminar una tarea por ID
router.delete('/:id', deleteTaskById);

export default router;