import { Request, Response, NextFunction } from "express";

let counter = 1;

export const requestsCounter = function (req: Request, res: Response, next: NextFunction) {
    const regex = /^\/.+$/;
    if (!regex.test(req.path)) {
        req.headers.count = counter.toString();
        counter += 1;
    }
    next();
}