import express from 'express';
import { serverRoutes } from './main';

export const routes = express.Router();

routes.use(serverRoutes);