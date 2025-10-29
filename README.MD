# Task Manager API

## Description
A RESTful API for managing tasks built with Node.js.

## Installation
```bash
npm install
```

## Usage
```bash
npm start
```

## API Endpoints

### Tasks
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `GET /tasks/:id` - Get a specific task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

## Request/Response Format
```json
{
    "id": "string",
    "title": "string",
    "description": "string",
    "completed": "boolean",
    "createdAt": "string"
}
```

## Technologies Used
- Node.js
- Express.js
- MongoDB/PostgreSQL (specify your database)

## License
MIT