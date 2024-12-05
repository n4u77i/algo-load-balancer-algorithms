import { servers } from "../constants";

const serversConnections: Array<Record<string, any> | undefined> = servers.backends.map(s => {
    if (s) {
        return {
            serverName: s,
            activeConnections: 0
        }
    }
});

export function nextServer(): string | undefined {
    let leastConnectionServer = serversConnections[0];

    if (!leastConnectionServer) {
        return undefined
    }

    for (const s of serversConnections) {
        if (s) {
            if (s.activeConnections < leastConnectionServer.activeConnections) {
                leastConnectionServer = s;
            }
        }
    }

    leastConnectionServer.activeConnections += 1
    return leastConnectionServer.serverName;
}

export function releaseConnection(server: string) {
    for (const s of serversConnections) {
        if (s) {
            if (s.serverName === server) {
                s.activeConnections -= 1
            }
        }
    }
}