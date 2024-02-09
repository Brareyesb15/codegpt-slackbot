import { createClient } from "@libsql/client";
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.TURSO_TOKEN_API;
const tursoDatabaseUrl: any = process.env.TURSO_DATABASE_URL;

// Inicializar el cliente de Turso DB
const client = createClient({
  url: tursoDatabaseUrl,
  // authToken es necesario si se conecta a una base de datos remota de Turso DB
  authToken: token,
});

// Función para crear la tabla workspaces con la columna 'date'
async function initializeDatabase() {
  try {

    // Crear la nueva tabla con la columna 'date'
    await client.execute(`
      CREATE TABLE workspaces (
        app_id TEXT NOT NULL PRIMARY KEY,
        workspace_id TEXT NOT NULL,
        access_token TEXT NOT NULL,
        workspace_name TEXT NOT NULL,
        scope TEXT NOT NULL,
        date DATE
      )
    `);
    console.log('New table "workspaces" has been created');
  } catch (error: any) {
    console.error('An error occurred while initializing the database:', error);
  }
}

export default initializeDatabase;
