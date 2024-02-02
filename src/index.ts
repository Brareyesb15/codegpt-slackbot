import { App, MessageEvent, SayFn } from '@slack/bolt';
import dotenv from 'dotenv';
import { completions } from './codegpt/codegpt';

dotenv.config();

// Validar que las variables de entorno necesarias estén configuradas
if (!process.env.SLACK_BOT_TOKEN || !process.env.SLACK_APP_TOKEN) {
  throw new Error('Missing environment variables');
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

app.message(async ({ message, say }: { message: MessageEvent, say: SayFn }) => {
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

(async () => {
  try {
    const port = process.env.PORT || 3000;
    await app.start(port);
    console.log(`⚡️ Slackbot is running on port ${port}!`);
  } catch (error) {
    console.error('Failed to start the Slack app:', error);
  }
})();