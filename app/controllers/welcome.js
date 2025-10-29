
export const welcome = (req, res) => {
    res.status(200).json({ message: 'Welcome to the Task Manager API',
        environment: process.env.NODE_ENV || 'development' });
}
