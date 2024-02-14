import dotenv from "dotenv";
import { createClient } from "@libsql/client";

dotenv.config();

const token = process.env.TURSO_TOKEN_API;
const tursoDatabaseUrl = process.env.TURSO_DATABASE_URL;

if (!token || !tursoDatabaseUrl) {
  throw new Error("Missing TURSO_TOKEN_API or TURSO_DATABASE_URL in environment variables");
}

const client = createClient({
  url: tursoDatabaseUrl,
  authToken: token,
});

async function findUserWithAgent(user_id: string): Promise<any | null> {
    try {
      const findUserSQL: string = `
        SELECT * FROM user
        WHERE user = ? AND agent IS NOT NULL
      `;
      const result = await client.execute({
        sql: findUserSQL,
        args: [user_id],
      });
  
      if (result.rows.length > 0) {
        const response: any = result.rows[0];
        console.log("User found with agent:", response);
        return response; // Devolver solo el primer elemento del array
      } else {
        return null; // Devolver null si no se encontró ningún resultado o si "agent" es nulo
      }
    } catch (error: any) {
      console.error("An error occurred while searching for the user:", error);
      return null;
    }
  }

export { findUserWithAgent };
