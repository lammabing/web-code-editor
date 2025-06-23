# Codebase Overview

## Key Components

### API Layer
- **Routes**: Express routers in src/routes/
- **Controllers**: Business logic in src/controllers/
- **Middleware**: Error handling in src/middleware/

### Data Layer
- **Mongoose Models**: Defined in src/models/
- **File Storage**: uploads/ directory with images/ subfolder

### Frontend
- Static assets in public/ directory
- Vanilla JS implementation (script.js)

## Data Flow
1. Client → Express Route → Controller → Model → Database
2. File uploads → Multer middleware → uploads/ storage
3. Static assets served directly from public/

## External Dependencies
- **Express**: Core web framework
- **Mongoose**: MongoDB interactions
- **Multer**: File upload handling
- **NPM**: Package management

## Recent Changes
- Implemented basic project documentation system
- Established MVC architecture pattern
- Configured file upload directory structure
- Enhanced file upload security in uploads/ directory
- Developed authentication middleware
- Validated file types in upload handler
- Implemented rate limiting
- Secured image serving from uploads/images
- Documented current tech stack decisions
- Mapped key codebase relationships
- Updated roadmap with security tasks

## User Feedback Integration
*No user feedback implemented yet - system designed for future integration*