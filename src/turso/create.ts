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
// Función para borrar la tabla workspaces
async function dropWorkspacesTable() {
  try {
    await client.execute(`DROP TABLE IF EXISTS workspaces`);
    console.log('Table "workspaces" has been dropped');
  } catch (error) {
    console.error('An error occurred while dropping the table:', error);
  }
}

// Función para crear la tabla workspaces con la columna 'date'
async function createWorkspacesTable() {
  try {
    await client.execute(`
      CREATE TABLE workspaces (
        workspace_id TEXT NOT NULL,
        access_token TEXT NOT NULL,
        workspace_name TEXT NOT NULL,
        scope TEXT NOT NULL,
        date DATE,
        organization_id TEXT
      )
    `);
    console.log('New table "workspaces" has been created');
  } catch (error) {
    console.error('An error occurred while creating the table:', error);
  }
}

// Función para inicializar la base de datos
async function initializeDatabase() {
  await dropWorkspacesTable();
  await createWorkspacesTable();
}

export default initializeDatabase;
