import { Request, Response, Router } from "express";
import axios from 'axios';

import { servers, serverStats, Algorithms } from "../constants";
import { nextBackend } from "../configLoadbalancer";
import { releaseConnection } from "../algorithms/leastConnection";
import { updateServerAvgResponseTime } from "../algorithms/leastResponseTime";

export const backendRoutes = Router();

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

        // Determine load balancing algorithm
        const LOAD_BALANCER = [
            'RoundRobin', 'LeastConnection', 'LeastResponseTime', 'SourceIpHash'
        ].includes(req.query.algo as string)
            ? req.query.algo as string
            : 'RoundRobin';

        // Select backend server
        const clientIp = req?.headers?.ipAddr || req?.socket.remoteAddress || '127.0.0.1';
        const server: string | undefined = LOAD_BALANCER === Algorithms.SourceIpHash
            ? nextBackend(LOAD_BALANCER, clientIp)
            : nextBackend(LOAD_BALANCER);

        if (!server) {
            res.status(503).send('No backend found');
            console.error('No backend server available for the given algorithm');
            return;
        }

        console.log(`Selected server: ${server}`);

        // Forward request to the backend server
        const response = await axios.get(server, {
            headers: req.headers,
        });

        // Calculate execution time
        const end = Date.now();
        const executionTimeInSecs = (end - start) / 1000;

        console.log(`Response from ${server}: ${String(response.data).trimEnd()} in ${executionTimeInSecs} secs`);

        // Update server stats
        serverStats[server].totalRequests += 1;
        serverStats[server].totalProcessingTime += executionTimeInSecs;

        if (LOAD_BALANCER === Algorithms.LeastConnection) {
            releaseConnection(server);
        }

        if (LOAD_BALANCER === Algorithms.LeastResponseTime) {
            const avgResponseTime = serverStats[server].totalProcessingTime / serverStats[server].totalRequests;
            updateServerAvgResponseTime(server, avgResponseTime);
        }

        if (!response.data) {
            console.error(`Empty response from server: ${server}`);
            res.status(500).send('Backend server returned an invalid response.');
            return;
        }

        res.send(response.data);

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios Error:", error.message);

            if (error.code === "ECONNREFUSED") {
                res.status(502).send("Server is unavailable (connection refused)\n");
            } else if (error.response) {
                res.status(error.response.status).send(`${error.response.data}\n` || "Error from server\n");
            } else {
                res.status(500).send("Internal Server Error\n");
            }
        } else {
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

backendRoutes.get('/reset-metrics', async (req: Request, res: Response) => {
    servers.backends.forEach((server) => {
        if (server) {
            serverStats[server] = {
                totalRequests: 0,
                totalProcessingTime: 0,
            };
        }
    });
    res.status(200).send("Metrics Data Cleared Successfully.");
})

backendRoutes.get('/health', async (req: Request, res: Response) => {
    res.status(200).send(JSON.stringify({
        status: "pass",
    } + '\n'));
})