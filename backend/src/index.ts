import express from 'express';

import { PORT } from './contants';
import { routes } from './routes';

const app = express();

app.use(routes);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});