import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import { welcome } from './controllers/welcome.js';
import tasksRouter from './routes/tasks.js';
import authRouter from './routes/auth.js';
// load enviroment variables from .env file
dotenv.config();

// Start express app
const app = express();
const port = process.env.PORT || 3000;

// Permitir todas las conexiones (desarrollo)
app.use(cors());

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
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

// Auth routes

app.use('/api/auth', authRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});