import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

// Inicializa el cliente postgres
const client = postgres(process.env.SUPABASE_URL);

// Crea el cliente Drizzle
export const db = drizzle(client, { 
    // Puedes inyectar tus schemas aquí si quieres tipado avanzado
    // schema: tasksSchema // Si lo importaras
});

const connectDB = async () => {
  try {
    // Intenta hacer una consulta simple para verificar la conexión
    await db.execute('SELECT 1'); 
    console.log(`🍃 PostgreSQL/Supabase conectado con postgres-js.`);
  } catch (error) {
    console.error(`❌ Error al conectar a la DB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;