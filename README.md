# Slack Chatbot with CodeGPT

<!-- Consider adding an image for visual appeal -->

## Project Setup

To integrate this chatbot into your workflow, you'll need to configure a Slack application (bot) and obtain CodeGPTPlus credentials.

### 1. Establish a Slack Application/Bot

- Navigate to the [Slack Developer Portal](https://api.slack.com/apps) and click on "Create New App".
- Assign your app a distinctive name.
- Construct your `.env` file within the root directory of this project, using `example.env` as a reference.
- In the settings page, under the app credentials section, copy your Client ID and Client Secret into your `.env` file.
- Proceed to the "Installed App Settings" tab and select the Bot User OAuth Token, appending it to your environment variables.

### 2. Acquire and Link Your Server's URL

- This Slack chatbot application is designed to operate serverlessly, hence it functions via interactions. You must have a URL where Slack can send these interactions to your server.
- If operating locally, consider using a tunneling service like ngrok.
- Once you have the URL, go to the Interactivity & Shortcuts tab and input your URL, concluding with `/slack/events` in the Request URL field, e.g., `https://myurl.com22/slack/events`.

### 3. Invite the Bot to Your Server/Event Subscriptions

- Input the URL from step 2 in the Event Subscriptions tab, enable events, and insert your URL in the new request URL option. This will initiate a request to your server; if it's active, it will authenticate, and the connection will be nearly complete.

### 4. Configure Your Commands

- The application code supports a command, but you must create it in your bot to utilize it. Visit the Slash Commands tab, create a command named `/configureagent`, and ensure the request URL matches the one set previously: `https://myurl.com22/slack/events`.

### 5. Create an Account on CodeGPT Plus

- Head over to the [CodeGPT Plus website](https://app.codegpt.co/es/signup) and register for an account.
- Proceed to your dashboard and retrieve your API key and Agent ID.

### 6. Clone the Repository and Install Dependencies

```bash
git clone <repository-url>
npm install
```

## Usage

To activate the chatbot, execute the following command in your terminal:

```bash
npm run watch
```

The chatbot will monitor messages in the Slack channel specified by the `SLACK_CHANNEL_ID` variable. Upon receiving a message, the chatbot will craft a response utilizing the CodeGPTPlus API and relay it back to the user in the same channel.
