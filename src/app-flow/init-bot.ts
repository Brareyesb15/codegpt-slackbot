import axios from "axios";
import { SlackEvent } from "../slack/interfaces";
import { readWorkspaces } from "../turso/turso-repository";
import { dbWorkspace } from "../turso/interfaces";
import { createSlackApp } from "../slack/slack-app";
import dotenv from 'dotenv';

dotenv.config();

// Validar que las variables de entorno necesarias estén configuradas
if ( !process.env.SLACK_APP_TOKEN || !process.env.SLACK_SIGNING_SECRET) {
  throw new Error('Missing environment variables');
}


const selectWorkspace = async (slackEvent: SlackEvent): Promise<void> => {
  // Selecciona el espacio de trabajo del evento de Slack
  const app_id: string = slackEvent.api_app_id;
  
  // Encuentra el espacio de trabajo en la base de datos 
  const workspace: dbWorkspace | null = await readWorkspaces(app_id);
  
  if (workspace) {
    // Utiliza el token de acceso del espacio de trabajo para iniciar la aplicación Slack
    const accessToken = workspace.access_token;
    
    if (slackEvent.event.type === 'message' &&
    slackEvent.event.client_msg_id && // Verifica que el mensaje tenga un client_msg_id
    !slackEvent.event.bot_id) // Verifica que el mensaje no haya sido enviado por un bot

  // Si pasa las comprobaciones, inicia la aplicación Slack con el accessToken
  createSlackApp(accessToken, process.env.SLACK_APP_TOKEN || '', process.env.SLACK_SIGNING_SECRET || "", slackEvent);
  }
};

export { selectWorkspace };