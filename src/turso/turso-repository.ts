import { createClient, Client } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();
import { dbWorkspace } from "./interfaces";
import { AuthResponse } from "../slack/interfaces";

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

async function insertWorkspace(authResponse: AuthResponse): Promise<void> {
  try {
    // Verificar si el registro ya existe
    const checkSQL: string = `
      SELECT COUNT(*) AS count FROM workspaces WHERE workspace_id = ?
    `;
    const checkResult = await client.execute({
      sql: checkSQL,
      args: [authResponse.team.id],
    });
    const verify: any = checkResult.rows[0].count;

    if (verify > 0) {
      const currentDate = new Date().toISOString().slice(0, 10); // Obtener la fecha actual en formato ISO YYYY-MM-DD
      // Si el registro existe, actualizarlo
      const updateSQL: string = `
        UPDATE workspaces 
        SET access_token = ?, workspace_name = ?, scope = ?, date = ?
        WHERE workspace_id = ?
      `;
      await client.execute({
        sql: updateSQL,
        args: [
          authResponse.access_token,
          authResponse.team.name,
          authResponse.scope,
          currentDate,
          authResponse.team.id,
        ],
      });
    } else {
      const currentDate = new Date().toISOString().slice(0, 10);
      // Si el registro no existe, insertarlo
      const insertSQL: string = `
        INSERT INTO workspaces (workspace_id, access_token, workspace_name, scope, date, organization_id)
        VALUES (?, ?, ?, ?, ?, NULL)
      `;
      await client.execute({
        sql: insertSQL,
        args: [
          authResponse.team.id,
          authResponse.access_token,
          authResponse.team.name,
          authResponse.scope,
          currentDate,
        ],
      });
    }
  } catch (error: any) {
    console.error("An error occurred while inserting/updating a workspace:", error);
  }

}



async function readWorkspaces(workspace_id: string): Promise<dbWorkspace| null> {

  try {
    const readSQL: string = `
      SELECT * FROM workspaces
      WHERE workspace_id = ? 
    `;
    const result = await client.execute({
      sql: readSQL,
      args: [workspace_id],
    });

    if (result.rows.length > 0) {
      const response : any = result.rows[0]
      console.log("Response db", response)
      return response; // Devolver solo el primer elemento del array
    } else {
      return null; // Devolver null si no se encontró ningún resultado
    }
  } catch (error: any) {
    console.error("An error occurred while reading messages:", error);
    return null;
  }
}


export { insertWorkspace,readWorkspaces };
