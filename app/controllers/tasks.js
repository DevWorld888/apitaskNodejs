import { db } from '../config/db.js';
import { eq, sql } from 'drizzle-orm'; // Operadores para WHERE
import {tasks} from '../../drizzle/schema.ts';

// Obtener todas las tareas
// Ruta: GET /api/tasks
export const getAllTasks = async (req, res) => {
    try {
        const results = await db.select().from(tasks);
        res.status(200).json({ tasks: results });
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
// Crear una nueva tarea
// Ruta: POST /api/tasks
export const createTask = async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTask = await db.insert(tasks).values({ title, description });
        res.status(201).json({ task: newTask });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
// Obtener una tarea por ID 
// Ruta: GET /api/tasks/:id
// example: /api/tasks/1
export const getTaskById = async (req, res) => {
    const { id } = req.params;
    console.log('Fetching task with ID:', id);
    try {
        const task = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
        if (task.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ task: task[0] });
    } catch (error) {
        console.error('Error retrieving task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Actualizar una tarea por ID
// Ruta: PUT /api/tasks/:id
export const updateTaskById = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const updatedTask = await db.update(tasks).set({ title, description }).where(eq(tasks.id, id));
        console.log('Updated task:', updatedTask);
        const task = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
        if (task.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ task: task[0], message: 'Task updated successfully' });
        
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
// Eliminar una tarea por ID
// Ruta: DELETE /api/tasks/:id
export const deleteTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTask = await db.delete(tasks).where(eq(tasks.id, id));
        console.log('Deleted task:', deletedTask);
        if (deletedTask.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(204).send().json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}