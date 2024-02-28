import { SlackCommandEvent, SlackEvent } from "./interfaces";
import { configureAgent } from "./command-functions/configure-agent";

// Esta función maneja el comando para configurar el agente
export async function handleCommand(
  event: SlackCommandEvent,
  accessToken: string
) {
  console.log(event.command);
  try {
    if (event.command === "/configureagent") {
      configureAgent(event, accessToken);
    }
  } catch (error) {
    console.error("Error al abrir el modal de configuración:", error);
    throw error;
  }
}
