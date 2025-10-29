import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
// import dotenv from 'dotenv';
import { tasks } from '../drizzle/schema';
import 'dotenv/config';

// Load environment variables

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);

const client = postgres(process.env.SUPABASE_URL!);
const db = drizzle(client);

const seedData = async () => {
    try {
        // Clear existing data
        // await db.delete(tasks);


        // Create sample tasks
        await db.insert(tasks).values([
            {
                title: 'Comprar comestibles',
                description: 'Leche, Pan, Huevos, Frutas',
                priority: 'Alta',
            },
            {  
                title: 'Limpiar la casa',
                description: 'Aspirar y trapear todos los pisos',
                priority: 'Media',
            },
            {
                title: 'Hacer la colada',
                description: 'Lavar y secar la ropa',
                priority: 'Baja',
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
