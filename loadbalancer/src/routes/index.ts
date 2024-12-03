import express from 'express';
import { backendRoutes } from './backends';

export const routes = express.Router();

routes.use(backendRoutes);