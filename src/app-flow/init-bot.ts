import axios from "axios";
import { SlackEvent } from "../slack/interfaces";
import { readWorkspaces } from "../turso/workspaces-repository";
import { dbWorkspace } from "../turso/interfaces";
import dotenv from "dotenv";
import { directMessageEvent, handleMessageEvent } from "../slack/message-event";
import { handleCommand } from "../slack/command-event";
import { handleModalSubmission } from "../slack/modal-event";

dotenv.config();

const selectWorkspace = async (slackEvent: any): Promise<void> => {
  try {
    // Selecciona el espacio de trabajo del evento de Slack
    let workspace_id: string = "";
    if (slackEvent.payload) {
      slackEvent = JSON.parse(slackEvent.payload);
      console.log(slackEvent);
      slackEvent.team_id
        ? (workspace_id = slackEvent.team_id)
        : (workspace_id = slackEvent.team.id);
    } else {
      workspace_id = slackEvent.team_id;
    }

    // Encuentra el espacio de trabajo en la base de datos
    const workspace: dbWorkspace | null = await readWorkspaces(workspace_id);

    if (workspace) {
      // Utiliza el token de acceso del espacio de trabajo para iniciar la aplicación Slack
      const accessToken = workspace.access_token;

      dispatchEvent(slackEvent, accessToken);
    }
  } catch (error) {
    console.error("An error occurred while selecting a workspace:", error);
    // Aquí puedes manejar el error de la manera que desees, como enviar una respuesta de error al cliente o registrar el error
  }
};

// Función que redirige a la función correspondiente basada en el tipo de evento
export async function dispatchEvent(event: any, accessToken: string) {
  try {
    console.log("on dispatch", event);

    // Verifica el tipo de evento y redirige a la función correspondiente
    if (event?.event?.type === "message") {
      return await directMessageEvent(event, accessToken);
    } else if (event?.event?.type === "app_mention") {
      // Aquí asumimos que 'event.view' contiene la información del modal enviado por el usuario
      return await handleMessageEvent(event, accessToken);
    } else if (event?.command) {
      return await handleCommand(event, accessToken);
    } else if (event?.type === "view_submission") {
      return await handleModalSubmission(event, accessToken);
    }

    // Si el tipo de evento no es reconocido, devuelve un error
    return {
      statusCode: 400,
      body: "Tipo de evento no reconocido",
    };
  } catch (error) {
    console.error("An error occurred while dispatching the event:", error);
    // Puedes manejar el error aquí de acuerdo a tus necesidades, como enviar una respuesta de error al cliente o registrar el error
    return {
      statusCode: 500,
      body: "Error interno del servidor",
    };
  }
}

export { selectWorkspace };
