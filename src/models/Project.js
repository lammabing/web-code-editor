import { promises as fs } from 'fs';
import path from 'path';

export class Project {
    static uploadsDir = 'uploads';

    static async initialize() {
        await fs.mkdir(this.uploadsDir, { recursive: true });
    }

    static async list() {
        const files = await fs.readdir(this.uploadsDir);
        return files.filter(file => file.endsWith('.json'));
    }

    static async save(filename, content) {
        const filePath = path.join(this.uploadsDir, `${filename}.json`);
        await fs.writeFile(filePath, JSON.stringify(content));
        return { filename, saved: true };
    }

    static async load(filename) {
        const filePath = path.join(this.uploadsDir, filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    }
}
