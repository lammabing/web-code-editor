import { Project } from '../models/Project.js';

export class ProjectController {
    static async listProjects(req, res, next) {
        try {
            const projects = await Project.list();
            res.json(projects);
        } catch (error) {
            next(error);
        }
    }

    static async saveProject(req, res, next) {
        try {
            const { filename, content } = req.body;
            const result = await Project.save(filename, content);
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    static async loadProject(req, res, next) {
        try {
            const { filename } = req.params;
            const project = await Project.load(filename);
            res.json(project);
        } catch (error) {
            next(error);
        }
    }
}
