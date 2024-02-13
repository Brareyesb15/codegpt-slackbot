import { WebClient } from '@slack/web-api';
import { SlackEvent } from './interfaces';
import { completions } from '../codegpt/codegpt';


// Esta función maneja los eventos de mensaje de Slack
export async function handleMessageEvent(slackEvent: SlackEvent, access_token: string) {
  console.log("Entro a handle", slackEvent);
  // Descarta el evento si no tiene client_msg_id o si fue enviado por un bot
  if (!slackEvent.event.client_msg_id || slackEvent.event.bot_id) {
    return {
      statusCode: 200,
      body: 'Evento descartado'
    };
  }

  // Crea una instancia del cliente de Slack con tu token de bot
  const slackClient = new WebClient(access_token);

  try {
    let message = [
      {
        role: "user",
        content: slackEvent.event.text
      }
    ];
    // Suponiendo que completions es una función que procesa el texto y devuelve una respuesta
    const codeGPTResponse = await completions(message);
    const responseText = codeGPTResponse;

    // Prepara los parámetros para enviar la respuesta de CodeGPT al canal de Slack
    const postMessageParams = {
      channel: slackEvent.event.channel,
      text: `<@${slackEvent.event.user}> ${responseText}`,
      // Si el mensaje es parte de un hilo, incluye el 'thread_ts' para responder en el hilo
      // Si no, usa el 'ts' del mensaje original para iniciar un nuevo hilo
      thread_ts: slackEvent.event.thread_ts || slackEvent.event.ts
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

export async function directMessageEvent(slackEvent: SlackEvent, access_token: string) {
  console.log("Entro a DM", slackEvent);
  // Descarta el evento si no tiene client_msg_id o si fue enviado por un bot
  if (!slackEvent.event.client_msg_id || slackEvent.event.bot_id) {
    return {
      statusCode: 200,
      body: 'Evento descartado'
    };
  }

  // Crea una instancia del cliente de Slack con tu token de bot
  const slackClient = new WebClient(access_token);

    try {
      const history : any = await slackClient.conversations.history({
        channel: slackEvent.event.channel // Asegúrate de que este es el ID de la conversación directa
    });
    console.log("history", history)

    const messages : any[] = history.messages.slice(0, 10).reverse(); // Invertir el orden de los últimos 10 mensajes
    const messageArray = messages.map(message => {
        let role = 'user';
        if (message.bot_id) {
            role = 'assistant';
        }
        return { role, content: message.text };
    });

    messageArray.push({
        role: "user",
        content : slackEvent.event.text
    });

    const codeGPTResponse = await completions(messageArray);
    const responseText = codeGPTResponse;

    // Prepara los parámetros para enviar la respuesta de CodeGPT al canal de Slack
    const postMessageParams = {
      channel: slackEvent.event.channel,
      text: ` ${responseText}`
    }

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