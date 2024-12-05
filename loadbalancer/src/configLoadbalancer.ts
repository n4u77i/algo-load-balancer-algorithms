import { nextServer as rr } from "./algorithms/roundRobin"
import { nextServer as sih } from "./algorithms/sourceIpHash";
import { nextServer as lc } from "./algorithms/leastConnection";
import { nextServer as lrt } from "./algorithms/leastResponseTime";
import { Algorithms } from "./constants";

export const nextBackend = (lbAlgorithm: string, ip: string | any = null) => {
    let server: string | undefined;

    if (lbAlgorithm === Algorithms.RoundRobin) {
        server = rr();
    } else if (lbAlgorithm === Algorithms.SourceIpHash) {
        if (ip) server = sih(ip);
    } else if (lbAlgorithm === Algorithms.LeastConnection) {
        server = lc();
    } else if (lbAlgorithm === Algorithms.LeastResponseTime) {
        server = lrt();
    } else {
        return undefined;
    }

    return server;
}