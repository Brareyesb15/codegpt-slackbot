import { createClient, Client } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

const token: string | undefined = process.env.TURSO_TOKEN_API;
const tursoDatabaseUrl: string | undefined = process.env.TURSO_DATABASE_URL;

if (!token || !tursoDatabaseUrl) {
  throw new Error("Missing TURSO_TOKEN_API or TURSO_DATABASE_URL in environment variables");
}

// Inicializar el cliente de Turso DB
const client: Client = createClient({
  url: tursoDatabaseUrl,
  // authToken es necesario si se conecta a una base de datos remota de Turso DB
  authToken: token,
});


async function insertWorkspace(
  workspace_id: string,
  access_token: string,
  workspace_name: string,
  scope: string
): Promise<void> {
  try {
    console.log("Entró a Turso?");
    const insertSQL: string = `
      INSERT INTO workspace (workspace_id, access_token, workspace_name, scope)
      VALUES (?, ?, ?, ?)
    `;
    await client.execute({
      sql: insertSQL,
      args: [workspace_id, access_token, workspace_name, scope],
    });
  } catch (error: any) {
    console.error("An error occurred while inserting a workspace:", error);
  }
}

// // Función para leer los últimos 20 mensajes de la base de datos para un chatbot y agente específicos
// async function readMessages(apiKey: string, agentId: string, number: string): Promise<any[]> {
//   try {
//     const readSQL: string = `
//       SELECT * FROM messages
//       WHERE botId = ? AND agentId = ? AND phoneNumber = ?
//       ORDER BY timestamp DESC
//       LIMIT 20
//     `;
//     const result = await client.execute({
//       sql: readSQL,
//       args: [apiKey, agentId, number],
//     });

//     return result.rows.reverse();
//   } catch (error: any) {
//     console.error("An error occurred while reading messages:", error);
//     return [];
//   }
// }

export { insertWorkspace };
