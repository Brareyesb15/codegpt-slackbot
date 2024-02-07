import axios from 'axios';
import { Router, Request, Response } from 'express';


const mainRouter = Router();

mainRouter.get('/welcome', (req: Request, res: Response) => {
  try {
    res.status(200).send('codeGPT says: is all good man?');
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

mainRouter.get('/oauth/callback', async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Código de autorización no proporcionado.');
  }

  try {
    // Realiza la solicitud para intercambiar el código por un token de acceso
    const response = await axios.post('https://slack.com/api/oauth.v2.access', null, {
      params: {
        code,
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        redirect_uri: process.env.SLACK_REDIRECT_URI,
      },
    });

    // Aquí deberías almacenar el token de acceso y el ID del workspace de forma segura
    // Por ejemplo, en una base de datos

    // Envía una respuesta al navegador del usuario
    res.status(200).send('Autenticación exitosa. Puedes cerrar esta ventana.');
  } catch (error: any) {
    console.error('Error en el intercambio de código de OAuth:', error);
    res.status(500).send('Error en la autenticación de OAuth.');
  }
});

export default mainRouter;