import { db } from '../config/db.js';
import { eq, and } from 'drizzle-orm'; // Operadores para WHERE
import {tasks} from '../../drizzle/schema.ts';

// Obtener todas las tareas
// Ruta: GET /api/tasks
export const getAllTasks = async (req, res) => {
    try {
        // Solo mostrar tareas del usuario autenticado
        const results = await db.select().from(tasks).where(eq(tasks.userId, req.user.id));
        res.status(200).json({ tasks: results });
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
// Crear una nueva tarea
// Ruta: POST /api/tasks
export const createTask = async (req, res) => {
    const { title, description, priority, dueDate } = req.body;
    try {
        // Asociar la tarea al usuario autenticado
        const newTask = await db.insert(tasks).values({
            title,
            description,
            priority,
            dueDate,
            userId: req.user.id
        }).returning();
        res.status(201).json({ task: newTask[0] });
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
    try {
        // Buscar la tarea por id y userId
        const task = await db.select().from(tasks)
            .where(eq(tasks.id, id))
            .where(eq(tasks.userId, req.user.id))
            .limit(1);
        if (task.length === 0) {
            return res.status(404).json({ error: 'Task not found or not authorized' });
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
        // Verificar que la tarea pertenezca al usuario
        const task = await db.select().from(tasks)
            .where(eq(tasks.id, id))
            .where(eq(tasks.userId, req.user.id))
            .limit(1);
        if (task.length === 0) {
            return res.status(404).json({ error: 'Task not found or not authorized' });
        }
        // Actualizar solo si es dueño
        await db.update(tasks).set({ title, description }).where(eq(tasks.id, id)).where(eq(tasks.userId, req.user.id));
        const updatedTask = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
        res.status(200).json({ task: updatedTask[0], message: 'Task updated successfully' });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
// Eliminar una tarea por ID
// Ruta: DELETE /api/tasks/:id
export const deleteTaskById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    console.log('Delete request - id:', id, 'userId:', userId);
    if (!id || !userId) {
        return res.status(400).json({ error: 'Invalid task id or user id' });
    }
    try {
        // Verificar que la tarea pertenezca al usuario
        const task = await db.select().from(tasks)
            .where(eq(tasks.id, id))
            .where(eq(tasks.userId, userId))
            .limit(1);
        console.log('Task found for delete:', task);
        if (task.length === 0) {
            return res.status(404).json({ error: 'Task not found or not authorized' });
        }
        // Eliminar solo si es dueño
        // await db.delete(tasks).where(eq(tasks.id, id)).where(eq(tasks.userId, userId));
        await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
        res.status(200).json({ message: 'Task deleted successfully', task: task[0] });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}