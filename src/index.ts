
import {app as expressApp  } from './router/app';
import { slackApp } from './slack/slack-app';

(async () => {
  try {
    await slackApp.start(); // Inicia la aplicación Slack
    console.log('⚡️ Slackbot is running!');
  } catch (error) {
    console.error('Failed to start the Slack app:', error);
  }
})();

// Iniciar el servidor Express
const port = process.env.PORT || 3010;
expressApp.listen(port, () => {
  console.log(`⚡️ Express server is running on port ${port}!`);
});
