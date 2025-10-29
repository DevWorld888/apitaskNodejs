import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { welcome } from './controllers/welcome.js';
import tasksRouter from './routes/tasks.js';
// load enviroment variables from .env file
dotenv.config();

// Start express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

connectDB().then(() => {
    console.log('Database connected successfully');
}).catch((err) => { 
    console.error('Database connection failed:', err);
});

// Sample route
app.get('/', welcome);


// Tasks routes
app.use('/api/tasks',tasksRouter );



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});