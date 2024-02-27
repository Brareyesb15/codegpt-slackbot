import axios from "axios";
import { Router, Request, Response } from "express";
import { auth0Callback } from "../slack/auth0";
import initializeDatabase from "../turso/create";
import { SlackEvent } from "../slack/interfaces";
import { selectWorkspace } from "../app-flow/init-bot";
const mainRouter = Router();

mainRouter.get("/welcome", (req: Request, res: Response) => {
  try {
    res.status(200).send("slack bot running");
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

mainRouter.get("/oauth/callback", async (req: Request, res: Response) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send("Código de autorización no proporcionado.");
  }

  try {
    const organization_id = state;
    console.log(organization_id);
    auth0Callback(code);
    res.status(200).send("Autenticación exitosa. Puedes cerrar esta ventana.");
  } catch (error: any) {
    console.error("Error en el intercambio de código de OAuth:", error);
    res.status(500).send("Error en la autenticación de OAuth.");
  }
});

mainRouter.post("/slack/events", async (req: Request, res: Response) => {
  const { challenge } = req.body; // Extraer el valor de challenge del cuerpo de la solicitud
  const slackEvent = req.body;

  try {
    selectWorkspace(slackEvent);
    // Enviar una respuesta con el valor de challenge (slack verification)
    res.set("Content-Type", "text/plain");
    challenge ? res.status(200).send(challenge) : res.status(200).send(); // Enviar el valor de challenge como cuerpo de la respuesta
  } catch (error) {
    console.error("Error processing Slack message:", error);
    res.sendStatus(500);
  }
});

mainRouter.get("/createTable", async (req, res) => {
  try {
    const response = await initializeDatabase();
    res.status(200).send(response);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});
export default mainRouter;
