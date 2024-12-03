import express from "express";

import { routes } from "./routes";
import { healthChecks } from "./healthCheck";
import { HEALTH_CHECK_INTERVAL } from "./contants";
import { requestsCounter } from "./middlewares/counter";

const PORT = 8080;
const app = express();

app.use(requestsCounter);
app.use(routes);

const timer = setInterval(async () => {
  await healthChecks();
}, 1000 * HEALTH_CHECK_INTERVAL);
timer.unref();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});