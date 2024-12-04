import { Request, Response, Router } from "express";
import { PORT } from "../contants";

export const serverRoutes = Router();

serverRoutes.get('/', async (req: Request, res: Response) => {
    const millisecsMax = 500;
    const millisecsMin = 50;
    const delay = Math.random() * (millisecsMax - millisecsMin) + millisecsMin;

    await new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
    res.send(
        `[${new Date().toISOString()}]: Request ${req.get('count')} from address ${req.get('ipAddr')} served from server ${PORT.toString().slice(-1)}\n`
    );
});

serverRoutes.get('/health', (req: Request, res: Response) => {
    res.status(200).send(JSON.stringify({
        status: "pass",
    } + '\n'));
});