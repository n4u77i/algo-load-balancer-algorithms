import { Request, Response, NextFunction } from "express";

function generateRandomIP(): string {
    const randomOctet = Math.floor(Math.random() * 254) + 1; // Random number between 1 and 254
    return `192.168.1.${randomOctet}`;
}

export const addIpAddrHeader = function (req: Request, res: Response, next: NextFunction) {
    req.headers.ipAddr = generateRandomIP();
    next();
}