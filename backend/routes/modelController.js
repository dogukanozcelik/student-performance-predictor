import express from 'express';
import { test  } from '../controllers/modelController.js';

const modelRouter = express.Router();

modelRouter.get('/', test);

export default modelRouter;