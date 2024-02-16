import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import mainRouter from "./router";
import bodyParser from "body-parser";

const app: Express = express();

app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(mainRouter);

// Manejadores de errores globales
process.on("uncaughtException", (error) => {
  console.error("Excepción no capturada:", error);
  // Realiza la limpieza necesaria aquí
  process.exit(1); // Sale de la aplicación con un código de error
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Promesa rechazada no manejada:", promise, "razón:", reason);
  // Realiza la limpieza necesaria aquí
  process.exit(1); // Sale de la aplicación con un código de error
});

export { app };
