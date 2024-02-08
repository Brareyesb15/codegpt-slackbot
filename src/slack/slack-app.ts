// slackBot.ts
import { App, MessageEvent, SayFn } from '@slack/bolt';
import dotenv from 'dotenv';
import { completions } from '../codegpt/codegpt';
import { processCodeGPTResponse } from '../codegpt/process-codegpt';
import { CustomApp, SlackEvent} from './interfaces'; // Asegúrate de que la ruta sea correcta
import { dbWorkspace } from '../turso/interfaces';
dotenv.config();

// Define la propiedad startWithId en la interfaz App<StringIndexed>
declare module '@slack/bolt' {
  interface App {
    startWithId(id: string): Promise<void>;
  }
}

// Configuración de la aplicación Slack
const slackApp: CustomApp = new App({
  token: process.env.SLACK_WORKSPACE_ACCESS_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
});

slackApp.startWithId = async (workspace_id: string) => {
  try {
    await slackApp.start();
    console.log(`⚡️ Slackbot with ID ${workspace_id} is running!`);
  } catch (error) {
    console.error('Failed to start the Slack app:', error);
  }
};

slackApp.message(async ({ message, say }: { message: MessageEvent, say: SayFn }) => {
  console.log("Message", message)
  if ('text' in message) {
    try {
      const response = await completions(message.text);
      const reply = processCodeGPTResponse(response);
      await say(reply);
    } catch (error) {
      console.error('Error processing message:', error);
      await say('Sorry, I encountered an error while processing your message.');
    }
  }
});

slackApp.command('/ask', async ({ command, ack, say }) => {
  // Debes llamar a ack() para reconocer el comando slash inmediatamente
  await ack();

  try {
    // Envía el texto del comando a la función completions y obtén la respuesta
    console.log("cOMMANDT TEXT", command.text)
    const response = await completions(command.text);
    // Procesa la respuesta y envía el texto generado de vuelta al canal
    const reply = processCodeGPTResponse(response);
    await say(reply);
  } catch (error) {
    console.error('Error processing command:', error);
    await say('Sorry, I encountered an error while processing your command.');
  }
});

export { slackApp };
