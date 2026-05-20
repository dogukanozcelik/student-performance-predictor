import express from 'express';
import { predictStudentModel } from '../controllers/modelController.js';

const modelRouter = express.Router();


modelRouter.post('/predict/:studentId', predictStudentModel);

export default modelRouter;