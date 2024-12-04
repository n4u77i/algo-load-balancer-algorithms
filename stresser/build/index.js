"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
async function validUrl() {
    if (constants_1.LOAD_BALANCER_URL) {
        try {
            const response = await axios_1.default.get(constants_1.LOAD_BALANCER_URL);
            if (response.status === 200) {
                return true;
            }
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error("Axios Error:", error.message);
                if (error.code === "ECONNREFUSED") {
                    return false;
                }
                else if (error.response) {
                    return false;
                }
                else {
                    return false;
                }
            }
            else {
                // Handle non-Axios errors
                console.error("Unknown Error:", error);
                return false;
            }
        }
    }
    return false;
}
async function sendRequest() {
    if (!await validUrl()) {
        console.log('Invalid URL or Load Balancer not reachable');
    }
    for (let i = 0; i < constants_1.NUMBER_OF_REQUESTS; i++) {
        try {
            const response = await axios_1.default.get(constants_1.LOAD_BALANCER_URL);
            if (!response.data) {
                console.log("Internal Server Error");
            }
            console.log(response.data);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error("Axios Error:", error.message);
                if (error.code === "ECONNREFUSED") {
                    console.log("Server is unavailable (connection refused)\n");
                }
                else if (error.response) {
                    // The server responded with a status code outside the 2xx range
                    console.log(`${error.response.data}\n` || "Error from server\n");
                }
                else {
                    console.log("Internal Server Error\n");
                }
            }
            else {
                // Handle non-Axios errors
                console.log("Unexpected error occurred\n");
            }
        }
    }
}
