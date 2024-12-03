"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const port = process.env.SERVER1_PORT ? +process.env.SERVER1_PORT : 3000;
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send(`Hello From Backend Server (${port})`);
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
