import express from "express";

import { routes } from "./routes";
import { healthChecks } from "./healthCheck";
import { HEALTH_CHECK_INTERVAL } from "./constants";
import { requestsCounter } from "./middlewares/counter";
import { addIpAddrHeader } from "./middlewares/ip";

const PORT = 8080;
const app = express();

app.use(requestsCounter);
app.use(addIpAddrHeader);
app.use(routes);

const timer = setInterval(async () => {
  await healthChecks();
}, 1000 * HEALTH_CHECK_INTERVAL);
timer.unref();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});