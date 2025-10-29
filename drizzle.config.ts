import 'dotenv/config'; // Necesario para leer .env en el CLI
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: "./drizzle/schema.ts", // Donde se definirán tus modelos/tablas
  out: "./drizzle/migrations", // Carpeta donde se guardarán los archivos de migración
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.SUPABASE_URL!, // Lee la URL del .env
  }
});