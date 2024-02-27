import axios from "axios";
import dotenv from "dotenv";
import { insertWorkspace } from "../turso/workspaces-repository";
import { AuthResponse } from "./interfaces";
dotenv.config();

const auth0Callback = async (code: any): Promise<void> => {
  // any hasta que descubras qué viene. Tiparlo con el evento.
  try {
    // Realiza la solicitud al endpoint de Slack para obtener el token de acceso
    const response = await axios.post(
      "https://slack.com/api/oauth.v2.access",
      null,
      {
        params: {
          client_id: process.env.SLACK_CLIENT_ID,
          client_secret: process.env.SLACK_CLIENT_SECRET,
          code: code,
          redirect_uri: process.env.SLACK_REDIRECT_URI,
        },
      }
    );

    // Verifica si la solicitud fue exitosa
    if (!response.data.ok) {
      throw new Error(response.data.error);
    }
  } catch (error) {
    console.error("An error occurred during authentication callback:", error);
    // Aquí puedes manejar el error de la manera que desees, como enviar una respuesta de error al cliente o registrar el error
  }
};

export { auth0Callback };
