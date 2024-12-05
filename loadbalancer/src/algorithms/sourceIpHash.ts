import { servers } from "../constants";

export function nextServer(ip: string) {
    const hash = Array.from(ip).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const index = hash % servers.backends.length;
    // console.log(`${hash} % ${servers.backends.length} = ${index}`)
    return servers.backends[index];
}