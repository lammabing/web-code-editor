# Web Code Editor

A web-based html, css, javascript and json data with realtime preview developed in node.js and express.

## Features

- Real-time code editing with preview
- Separation of html, css, javascript
- Supports the use of templates through data tags and json data source.
- Project saving and loading
- Image and file uploads 
- Static file serving
- Modern MVC architecture

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd web-code-editor
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3200`

## Project Structure

```
web-code-editor/
├── public/              # Static frontend files
│   ├── index.html      # Main HTML file
│   ├── script.js       # Frontend JavaScript
│   └── styles.css      # CSS styles
├── src/                # Backend source code
│   ├── models/         # Data models
│   ├── controllers/    # Request handlers
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   └── services/       # Business logic services
├── uploads/            # Project storage directory
├── server.js           # Main application file
└── package.json        # Project configuration
```

## API Documentation

### Project Management

#### List Projects
- **Endpoint**: `GET /api/projects`
- **Description**: Retrieves a list of all saved projects
- **Response**:
  ```json
  [
    "project1.json",
    "project2.json"
  ]
  ```

#### Save Project
- **Endpoint**: `POST /api/save`
- **Description**: Saves a project to the server
- **Request Body**:
  ```json
  {
    "filename": "myproject",
    "content": {
      // Project content
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true
  }
  ```

#### Load Project
- **Endpoint**: `GET /api/load/:filename`
- **Description**: Loads a specific project
- **Parameters**:
  - `filename`: Name of the project file to load
- **Response**: Project content in JSON format

#### File Upload
- **Endpoint**: `POST /api/upload`
- **Description**: Uploads a file to the server
- **Request**: Multipart form data with file
- **Response**:
  ```json
  {
    "filename": "uploaded-file-name"
  }
  ```

### Error Responses

All API endpoints return appropriate HTTP status codes:

- `200 OK`: Successful operation
- `400 Bad Request`: Invalid input
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error response format:
```json
{
  "error": "Error message description"
}
```

## Development

### Running in Development Mode

```bash
npm run dev
```

This starts the server with nodemon for auto-reloading during development.

### Environment Variables

The application uses the following environment variables:

- `PORT`: Server port (default: 3200)
- `NODE_ENV`: Environment mode ('development' or 'production')

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
