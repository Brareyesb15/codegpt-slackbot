// import { WebClient } from '@slack/web-api';
// import { SlackCommandEvent } from '../interfaces';
// import { completions } from '../../codegpt/codegpt';

// // Esta función maneja los eventos de mensaje de Slack
// export async function handleMessageEvent(slackEvent: SlackCommandEvent, access_token: string) {
  

//   // Crea una instancia del cliente de Slack con tu token de bot
//   const slackClient = new WebClient(access_token);

//   try {
//     let message = [
//       {
//         role: "user",
//         content : slackEvent.text
//       }
//     ]
//     // Suponiendo que completions es una función que procesa el texto y devuelve una respuesta
//     const codeGPTResponse = await completions(message);
//     const responseText = codeGPTResponse;

//     // Prepara los parámetros para enviar la respuesta de CodeGPT al canal de Slack
//     const postMessageParams = {
//       channel: slackEvent.channel_id,
//       text: `<@${slackEvent.user_id}> ${responseText}`,
//       // Si el mensaje es parte de un hilo, incluye el 'thread_ts' para responder en el hilo
//       thread_ts: slackEvent.event.thread_ts || undefined
//     };

//     // Envía la respuesta al canal de Slack usando la API de Slack
//     await slackClient.chat.postMessage(postMessageParams);
//   } catch (error) {
//     console.error('Error al obtener respuesta de CodeGPT o al enviar mensaje a Slack:', error);
//     // Devuelve una respuesta indicando que hubo un error
//     return {
//       statusCode: 500,
//       body: 'Error al procesar el evento de mensaje'
//     };
//   }

//   // Devuelve una respuesta para indicar que el evento fue procesado con éxito
//   return {
//     statusCode: 200,
//     body: 'Evento de mensaje procesado'
//   };
// }