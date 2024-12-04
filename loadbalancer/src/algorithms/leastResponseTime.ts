import { servers } from "../contants";

const serversResponseTimes: Array<Record<string, any> | undefined> = servers.backends.map(s => {
    if (s) {
        return {
            serverName: s,
            avgResponseTime: 0
        }
    }
});

export function updateServerAvgResponseTime(server: string, time: number) {
    for (const s of serversResponseTimes) {
        if (s) {
            if (s.serverName === server) {
                s.avgResponseTime = time;
            }
        }
    }
    
}

export function nextServer(): string | undefined {
    let leastResponseTimeServer = serversResponseTimes[0];

    if (!leastResponseTimeServer) {
        return undefined
    }

    for (const s of serversResponseTimes) {
        if (s) {
            if (s.avgResponseTime < leastResponseTimeServer.avgResponseTime) {
                leastResponseTimeServer = s;
            }
        }
    }
    return leastResponseTimeServer.serverName;
}