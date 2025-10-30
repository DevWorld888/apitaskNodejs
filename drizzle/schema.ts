import { pgTable, serial, text, boolean, timestamp, pgEnum,foreignKey } from 'drizzle-orm/pg-core';

// 1. Definir el Enum para el campo 'priority'
export const priorityEnum = pgEnum('priority', ['Baja', 'Media', 'Alta']);

// 2. Definición de la Tabla 'tasks'
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(), // ID autoincremental
  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').default(false).notNull(),
  dueDate: timestamp('due_date', { withTimezone: true }),
  
  // Usar el Enum definido
  priority: priorityEnum('priority').default('Media').notNull(), 
  userId: serial('user_id').notNull().references(() => users.id), // Relación con la tabla de usuarios (a definir más adelante)
  
  // Timestamps automáticos (estándar en la industria)
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// En el futuro, agregarás la tabla de usuarios 'users' y relaciones aquí.

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});