// slackBot.ts
import { App, MessageEvent, SayFn } from '@slack/bolt';
import { completions } from '../codegpt/codegpt';
// import { processCodeGPTResponse } from '../codegpt/process-codegpt';
import { SlackEvent} from './interfaces';
import { ChatPostMessageArguments } from '@slack/web-api';

/// Configuración de la aplicación Slack como función
const createSlackApp = async(token: string, appToken: string,signingSecret: string,slackEvent : SlackEvent) => {
  console.log("token",token,"appToken", appToken)
  const slackApp = new App({
    token: token,
    appToken: appToken,
    signingSecret: signingSecret, 
    socketMode: false,
  });
   slackApp.start()
   console.log("SE inició el app", slackEvent)

   try {
    const codeGPTResponse = await completions(slackEvent.event.text);
    const replyText = codeGPTResponse

    // Envía la respuesta de CodeGPT al canal de Slack, citando al usuario
    const postMessageParams : ChatPostMessageArguments = {
      channel: slackEvent.event.channel,
      text: `<@${slackEvent.event.user}> ${replyText}`,
      token: token // Asegúrate de que este es el token correcto para el espacio de trabajo
    };

    // Si el mensaje es parte de un hilo, agrega el thread_ts para responder en el hilo
    if (slackEvent.event.thread_ts) {
      postMessageParams.thread_ts = slackEvent.event.thread_ts;
    }

    // Envía la respuesta de CodeGPT al canal de Slack, y en el hilo si corresponde
    await slackApp.client.chat.postMessage(postMessageParams);
  } catch (error) {
    console.error('Error al obtener respuesta de CodeGPT o al enviar mensaje a Slack:', error);
  }
  slackApp.stop()
};

export { createSlackApp };