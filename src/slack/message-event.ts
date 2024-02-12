import { WebClient } from '@slack/web-api';
import { completions } from '../codegpt/codegpt';
import { SlackEvent } from './interfaces';

// Esta función maneja los eventos de mensaje de Slack
export async function handleMessageEvent(slackEvent: SlackEvent, access_token: string) {
  // Descarta el evento si no tiene client_msg_id o si fue enviado por un bot
  if (slackEvent.event.type !== 'message' ||
      !slackEvent.event.client_msg_id || // Verifica que el mensaje tenga un client_msg_id
      slackEvent.event.bot_id) { // Verifica que el mensaje no haya sido enviado por un bot
    return {
      statusCode: 200,
      body: 'Evento descartado'
    };
  }

  // Crea una instancia del cliente de Slack con tu token de bot
  const slackClient = new WebClient(access_token);

  try {
    // Suponiendo que completions es una función que procesa el texto y devuelve una respuesta
    const codeGPTResponse = await completions(slackEvent.event.text);
    const responseText = codeGPTResponse;

    // Prepara los parámetros para enviar la respuesta de CodeGPT al canal de Slack
    const postMessageParams = {
      channel: slackEvent.event.channel,
      text: `<@${slackEvent.event.user}> ${responseText}`,
      // Si el mensaje es parte de un hilo, incluye el 'thread_ts' para responder en el hilo
      thread_ts: slackEvent.event.thread_ts || undefined
    };

    // Envía la respuesta al canal de Slack usando la API de Slack
    await slackClient.chat.postMessage(postMessageParams);
  } catch (error) {
    console.error('Error al obtener respuesta de CodeGPT o al enviar mensaje a Slack:', error);
    // Devuelve una respuesta indicando que hubo un error
    return {
      statusCode: 500,
      body: 'Error al procesar el evento de mensaje'
    };
  }

  // Devuelve una respuesta para indicar que el evento fue procesado con éxito
  return {
    statusCode: 200,
    body: 'Evento de mensaje procesado'
  };
}