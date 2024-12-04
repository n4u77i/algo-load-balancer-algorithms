import axios from "axios";

import { 
    NUMBER_OF_REQUESTS, 
    LOAD_BALANCER_URL,
    HEALTH_PATH,
    METRICS_PATH,
} from "./constants";

async function validUrl(): Promise<boolean> {
    if (LOAD_BALANCER_URL) {
        try {
            const response = await axios.get(LOAD_BALANCER_URL + HEALTH_PATH);

            if (response.status === 200) {
                return true;
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios Error:", error.message);
          
                if (error.code === "ECONNREFUSED") {
                    return false;
                } else if (error.response) {
                    return false;
                } else {
                    return false;
                }
            } else {
                // Handle non-Axios errors
                console.error("Unknown Error:", error);
                return false;
            }
        }
    }
    return false;
}

async function getMetrics() {
    try {
        const response = await axios.get(LOAD_BALANCER_URL + METRICS_PATH);

        if (!response.data) {
            console.log("Internal Server Error");
        }

        console.log(response.data.trim());
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios Error:", error.message);
      
            if (error.code === "ECONNREFUSED") {
                console.log("Server is unavailable (connection refused)\n");
            } else if (error.response) {
                // The server responded with a status code outside the 2xx range
                console.log(`${error.response.data}\n` || "Error from server\n");
            } else {
                console.log("Internal Server Error\n");
            }
        } else {
            // Handle non-Axios errors
            console.log("Unexpected error occurred\n");
        }
    }
}

async function sendRequests() {
    if (!await validUrl()) {
        console.log('Invalid URL or Load Balancer not reachable');
    }

    for (let i = 0; i < NUMBER_OF_REQUESTS; i++) {
        try {
            const response = await axios.get(LOAD_BALANCER_URL);

            if (!response.data) {
                console.log("Internal Server Error");
            }

            console.log(response.data.trim());
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios Error:", error.message);
          
                if (error.code === "ECONNREFUSED") {
                    console.log("Server is unavailable (connection refused)\n");
                } else if (error.response) {
                    // The server responded with a status code outside the 2xx range
                    console.log(`${error.response.data}\n` || "Error from server\n");
                } else {
                    console.log("Internal Server Error\n");
                }
            } else {
                // Handle non-Axios errors
                console.log("Unexpected error occurred\n");
            }
        }
    }

    await getMetrics();
}

sendRequests();