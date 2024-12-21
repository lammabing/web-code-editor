import express from 'express';
import { ProjectController } from '../controllers/ProjectController.js';

const router = express.Router();

router.get('/projects', ProjectController.listProjects);
router.post('/save', ProjectController.saveProject);
router.get('/load/:filename', ProjectController.loadProject);

export default router;
