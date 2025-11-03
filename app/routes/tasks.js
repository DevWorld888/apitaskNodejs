import express from 'express';
// Router de Express maneja las rutas
const router = express.Router();
import { authenticateToken } from "../middleware/auth.js";
import { getAllTasks,createTask,getTaskById,updateTaskById,deleteTaskById } from '../controllers/tasks.js';

// Ruta para obtener todas las tareas
router.get('/', authenticateToken, getAllTasks);
router.post('/', authenticateToken, createTask);

// Ruta para obtener una tarea por ID
router.get('/:id', authenticateToken, getTaskById);

// Ruta para actualizar una tarea por ID
router.put('/:id', authenticateToken, updateTaskById);

// Ruta para eliminar una tarea por ID
router.delete('/:id', authenticateToken, deleteTaskById);

export default router;