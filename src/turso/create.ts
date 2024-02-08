import { createClient } from "@libsql/client";
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.TURSO_TOKEN_API;
const tursoDatabaseUrl : any = process.env.TURSO_DATABASE_URL;



// Inicializar el cliente de Turso DB
const client = createClient({
  url: tursoDatabaseUrl,
  // authToken es necesario si se conecta a una base de datos remota de Turso DB
  authToken: token,
});

// Función para crear la tabla si no existe
async function initializeDatabase() {
  try {
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS workspace (
        workspace_id TEXT NOT NULL PRIMARY KEY,
        access_token TEXT NOT NULL,
        workspace_name TEXT NOT NULL,
        scope TEXT NOT NULL,
      )
    `;
    await client.execute(createTableSQL);
    console.log('New table "messages2" has been created.');
  } catch (error: any) {
    console.error(
      "An error occurred while initializing the database:",
      error
    );
  }
}
export default initializeDatabase;