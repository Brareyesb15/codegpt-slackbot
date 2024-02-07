import axios from 'axios';
import { Router, Request, Response } from 'express';
import { auth0Callback } from '../slack/auth0';



const mainRouter = Router();

mainRouter.get('/welcome', (req: Request, res: Response) => {
  try {
    res.status(200).send('codeGPT says: is all good man?');
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

  mainRouter.get('/oauth/callback', async (req: Request, res: Response) => {
    console.log("Se usó callback")
    const { code } = req.query;

    if (!code) {
      return res.status(400).send('Código de autorización no proporcionado.');
    }

    try {
      auth0Callback(code)
      res.status(200).send('Autenticación exitosa. Puedes cerrar esta ventana.');
    } catch (error: any) {
      console.error('Error en el intercambio de código de OAuth:', error);
      res.status(500).send('Error en la autenticación de OAuth.');
    }
  });

export default mainRouter;