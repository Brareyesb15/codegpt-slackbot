import axios from "axios";
import dotenv from 'dotenv';
import { insertWorkspace } from "../turso/turso-repository";
dotenv.config();

const auth0Callback = async (code: any): Promise<void> => { // any hasta que descubras qué viene.
    // Realiza la solicitud al endpoint de Slack para obtener el token de acceso
    const response = await axios.post('https://slack.com/api/oauth.v2.access', null, {
      params: {
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.SLACK_REDIRECT_URI,
      },
    });
  
    // Verifica si la solicitud fue exitosa
    if (!response.data.ok) {
      throw new Error(response.data.error);
    }
    console.log("TOKENS A GUARDAR",response.data)
    insertWorkspace(response.data.team.id,response.data.access_token,response.data.team.name,response.data.scope)
    // Aquí deberías almacenar el token de acceso y el ID del workspace de forma segura
    // Por ejemplo, en una base de datos
};

export { auth0Callback };
