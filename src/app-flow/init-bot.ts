import dotenv from "dotenv";
import { directMessageEvent, handleMessageEvent } from "../slack/message-event";
import { handleCommand } from "../slack/command-event";
import { handleModalSubmission } from "../slack/modal-event";

dotenv.config();

const selectWorkspace = async (slackEvent: any): Promise<void> => {
  try {
    const accessToken = process.env.SLACK_WORKSPACE_ACCESS_TOKEN;
    dispatchEvent(slackEvent, accessToken as string);
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
      return await handleMessageEvent(event, accessToken);
    } else if (event?.command) {
      return await handleCommand(event, accessToken);
    } else if (event?.type === "view_submission") {
      return await handleModalSubmission(event, accessToken);
    }

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
