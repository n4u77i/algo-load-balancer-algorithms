import { servers } from "../constants";

let iterator = generator();

function* generator(): Generator<string | undefined> {
    for (const server of servers.backends) {
        yield server;
    }
}

export const nextServer = (): string | undefined => {
    const { value, done } = iterator.next();

    if (done) {
        // Restart the generator when it reaches the end
        iterator = generator();
        return iterator.next().value;
    }
    return value;
};