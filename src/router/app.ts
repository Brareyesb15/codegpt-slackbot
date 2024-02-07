import express, { Express, Request, Response, NextFunction } from 'express';
import cors from "cors";
import mainRouter from './router';



const app: Express = express();

app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(express.json());

app.use(mainRouter);

export { app };
