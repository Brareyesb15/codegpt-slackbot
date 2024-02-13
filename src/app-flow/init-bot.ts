import axios from "axios";
import { SlackEvent } from "../slack/interfaces";
import { readWorkspaces } from "../turso/turso-repository";
import { dbWorkspace } from "../turso/interfaces";
import dotenv from 'dotenv';
import { directMessageEvent, handleMessageEvent } from "../slack/message-event";
import { handleCommand } from "../slack/command-event";
import { handleModalSubmission } from "../slack/modal-event";


dotenv.config();

const selectWorkspace = async (slackEvent: any): Promise<void> => {
  // Selecciona el espacio de trabajo del evento de Slack
  let app_id: string = "";
  if (slackEvent.payload) { 
    const payloadObject = JSON.parse(slackEvent.payload); // Convertir la cadena JSON a un objeto JSON
    slackEvent = JSON.parse(slackEvent.payload)
    app_id = payloadObject.api_app_id;
  } else {
    app_id = slackEvent.api_app_id;
  }
  
  // Encuentra el espacio de trabajo en la base de datos 
  const workspace: dbWorkspace | null = await readWorkspaces(app_id);
  
  if (workspace) {
    // Utiliza el token de acceso del espacio de trabajo para iniciar la aplicación Slack
    const accessToken = workspace.access_token;

    dispatchEvent(slackEvent,accessToken)
    
  //   if (slackEvent.event.type === 'message' &&
  //   slackEvent.event.client_msg_id && // Verifica que el mensaje tenga un client_msg_id
  //   !slackEvent.event.bot_id) // Verifica que el mensaje no haya sido enviado por un bot

  // // Si pasa las comprobaciones, inicia la aplicación Slack con el accessToken
  // handleMessageEvent(slackEvent,accessToken)
  }
};

// Función que redirige a la función correspondiente basada en el tipo de evento
export async function dispatchEvent(event: any, accessToken: string) {
  console.log("on dispatch", event)
  // Verifica el tipo de evento y redirige a la función correspondiente
  if (event?.event?.type === 'message') {
    return directMessageEvent(event, accessToken); } // Ya el bot no escucha mensajes normales, funciona para DM con bot
    if (event?.event?.type === 'app_mention') {
    // Aquí asumimos que 'event.view' contiene la información del modal enviado por el usuario
    return handleMessageEvent(event, accessToken);
  }
   else if (event?.command) {
    return handleCommand(event, accessToken);
  } else if (event.type === 'view_submission') {
    // Aquí asumimos que 'event.view' contiene la información del modal enviado por el usuario
    return handleModalSubmission(event, accessToken);
  }

  // Si el tipo de evento no es reconocido, devuelve un error
  return {
    statusCode: 400,
    body: 'Tipo de evento no reconocido'
  };
} 

export { selectWorkspace };