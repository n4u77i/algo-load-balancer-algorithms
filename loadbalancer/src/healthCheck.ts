import axios from "axios";
import { HEALTH_CHECK_PATH, servers } from "./contants";

const isHealthy = async (url: string): Promise<boolean> => {
    try {
        const response = axios.get(`${url}/${HEALTH_CHECK_PATH}`);
        return (await response).status === 200;
    } catch (error: any) {
        return false;
    }
};

export const healthChecks = async () => {
    for (const server of servers.backends) {
        if (server) {
            if (await isHealthy(server)) {
                console.log(`${server} is healthy`);
            } else {
                console.log(`${server} is not healthy`);
                removeBackend(server);
            }
        }
    }
};

export const removeBackend = (url: string) => {
    servers.backends = servers.backends.filter((backend) => backend != url);
};