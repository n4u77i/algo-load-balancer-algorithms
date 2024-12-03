import { Request, Response, Router } from "express";
import axios from 'axios';

import { nextBackend } from "../algorithms/roundRobin";
import { servers } from "../contants";

export const backendRoutes = Router();

const serverStats: Record<string, Record<string, number>> = {};
servers.backends.forEach((server) => {
    if (server) {
        serverStats[server] = {
            totalRequests: 0, // Counter for total requests served
            totalProcessingTime: 0, // Total processing time in milliseconds
        };
    }
});

backendRoutes.get('/', async (req: Request, res: Response) => {
    try {
        const start = Date.now();
        const server: string | undefined = nextBackend();

        if (!server) {
            res.status(503).send('No backend found');
            throw new Error("Invalid server URL");
        }
        
        const response = await axios.get(server, {
            headers: req.headers
        });

        const end = Date.now();
        const executionTimeInSecs = (end - start) / 1000;

        console.log(`>>> ${String(response.data).trimEnd()} in ${executionTimeInSecs} secs`)
        serverStats[server].totalRequests += 1;
        serverStats[server].totalProcessingTime += executionTimeInSecs;

        if (!response.data) {
            console.log("Invalid response");
            res.status(500).send('Internal Server Error');
        }

        res.send(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios Error:", error.message);
      
            if (error.code === "ECONNREFUSED") {
                res.status(502).send("Server is unavailable (connection refused)\n");
            } else if (error.response) {
                // The server responded with a status code outside the 2xx range
                res.status(error.response.status).send(`${error.response.data}\n` || "Error from server\n");
            } else {
                res.status(500).send("Internal Server Error\n");
            }
        } else {
            // Handle non-Axios errors
            console.error("Unknown Error:", error);
            res.status(500).send("Unexpected error occurred\n");
        }
    }
});

backendRoutes.get('/metrics', async (req: Request, res: Response) => {
    let message = '';
    for (const [server, metrics] of Object.entries(serverStats)) {
        const requests = metrics.totalRequests;
        const avgResponseTime = metrics.totalProcessingTime / metrics.totalRequests;
        const serverName = server.slice(-1);

        console.log(
            `Server ${serverName} served ${requests} request(s) with an average response time of ${avgResponseTime.toFixed(3)} secs`
        );
        message += `Server ${serverName} served ${requests} request(s) with an average response time of ${avgResponseTime.toFixed(3)} secs\n`;
    }
    res.status(200).send(message);
})