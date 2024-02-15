import dotenv from "dotenv";
import { createClient } from "@libsql/client";

dotenv.config();

const token = process.env.TURSO_TOKEN_API;
const tursoDatabaseUrl = process.env.TURSO_DATABASE_URL;

if (!token || !tursoDatabaseUrl) {
  throw new Error(
    "Missing TURSO_TOKEN_API or TURSO_DATABASE_URL in environment variables"
  );
}

const client = createClient({
  url: tursoDatabaseUrl,
  authToken: token,
});

export async function findUserWithAgent(user_id: string): Promise<any | null> {
  try {
    const findUserSQL: string = `
          SELECT * FROM users
          WHERE user_id = ? AND agent IS NOT NULL
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
export async function assignAgentToUser(event: ViewSubmissionEvent) {
  try {
    console.log(event);
    // Primero, intentamos encontrar el usuario con el user_id dado
    const findUserSQL = `
      SELECT * FROM users
      WHERE user_id = ?
    `;
    const userResult = await client.execute({
      sql: findUserSQL,
      args: [event.user.id],
    });

    // Si no encontramos un usuario, creamos uno nuevo
    if (userResult.rows.length === 0) {
      await createUser(event);
      console.log(
        `User with user_id ${event.user.id} has been created and assigned to agent.`
      );
    } else {
      // Si el usuario existe, actualizamos el campo 'agent'
      const updateAgentSQL = `
          UPDATE users
          SET agent = ?
          WHERE user_id = ?
        `;
      await client.execute({
        sql: updateAgentSQL,
        args: [
          event.view.state.values.agent_selection_block.agent_selection
            .selected_option.text.text,
          event.user.id,
        ],
      });
      console.log(`Agent has been assigned to user ${event.user.id}.`);
    }
  } catch (error: any) {
    console.error("An error occurred:", error.message);
  }
}

async function createUser(event: ViewSubmissionEvent) {
  try {
    const date = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD
    const insertUserSQL = `
      INSERT INTO users (date, user_id, workspace_id, agent)
      VALUES (?, ?, ?, ?)
    `;
    await client.execute({
      sql: insertUserSQL,
      args: [
        date,
        event.user.id,
        event.team.id,
        event.view.state.values.agent_selection_block.agent_selection
          .selected_option.text.text,
      ],
    });
    console.log(`User  has been created.`);
  } catch (error: any) {
    console.error("An error occurred while creating the user:", error.message);
  }
}

export { createUser };
