import { Router, Request, Response } from 'express';

const mainRouter = Router();

mainRouter.get('/welcome', (req: Request, res: Response) => {
  try {
    res.status(200).send('codeGPT says: is all good man?');
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

mainRouter.get('/instances', (req: Request, res: Response) => {
  try {
    const keys = Object.keys("a");
    const response = {
      'number of instances': keys.length,
      keys,
    };
    res.status(200).send(response);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

export default mainRouter;