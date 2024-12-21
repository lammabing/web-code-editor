import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import projectRoutes from './src/routes/projectRoutes.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { Project } from './src/models/Project.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3200;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Initialize uploads directory
await Project.initialize();

// API Routes
app.use('/api', projectRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});