import { createClient, Client } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();
import { dbWorkspace } from "../slack/interfaces";

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


async function readWorkspaces(workspace_id: string): Promise<dbWorkspace| null> {
  try {
    const readSQL: string = `
      SELECT * FROM workspace
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
