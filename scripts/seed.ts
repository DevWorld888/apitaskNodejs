import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
// import dotenv from 'dotenv';
import { tasks, users } from '../drizzle/schema';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

// Load environment variables

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);

const client = postgres(process.env.SUPABASE_URL!);
const db = drizzle(client);

const seedData = async () => {
    try {

        // Crear usuarios con contraseña hasheada
        const password1 = await bcrypt.hash('password123', 10);
        const password2 = await bcrypt.hash('admin456', 10);

        const insertedUsers = await db.insert(users).values([
            {
                username: 'demo',
                email: 'demo@demo.com',
                password: password1,
            },
            {
                username: 'admin',
                email: 'admin@demo.com',
                password: password2,
            }
        ]).returning();

        // Crear tareas asociadas a los usuarios
        await db.insert(tasks).values([
            {
                title: 'Comprar comestibles',
                description: 'Leche, Pan, Huevos, Frutas',
                priority: 'Alta',
                userId: insertedUsers[0].id,
            },
            {
                title: 'Limpiar la casa',
                description: 'Aspirar y trapear todos los pisos',
                priority: 'Media',
                userId: insertedUsers[0].id,
            },
            {
                title: 'Hacer la colada',
                description: 'Lavar y secar la ropa',
                priority: 'Baja',
                userId: insertedUsers[1].id,
            }
        ]);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await client.end();
    }
};

seedData();
