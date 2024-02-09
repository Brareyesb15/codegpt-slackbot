// slackBot.ts
import { App, MessageEvent, SayFn } from '@slack/bolt';
import { completions } from '../codegpt/codegpt';
import { processCodeGPTResponse } from '../codegpt/process-codegpt';
import { SlackEvent } from './interfaces';

/// Configuración de la aplicación Slack como función
const createSlackApp = (token: string, appToken: string,signingSecret: string,slackEvent : SlackEvent) => {
  console.log("token",token,"appToken", appToken)
  const slackApp = new App({
    token: token,
    appToken: appToken,
    signingSecret: signingSecret, 
    socketMode: false,
  });
   slackApp.start()
   console.log("SE inició el app", slackEvent)

   const result = slackApp.client.chat.postMessage({
    channel: slackEvent.event.channel,
    text: '¡Hola! Este es un mensaje de respuesta.',
    token: token // Asegúrate de que este es el token correcto para el espacio de trabajo
  });
  slackApp.stop()
};

export { createSlackApp };