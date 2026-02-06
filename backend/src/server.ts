import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/init.js';
import authRoutes from './routes/auth.js';
import trainingPlansRoutes from './routes/trainingPlans.js';
import studentsRoutes from './routes/students.js';
import workoutsRoutes from './routes/workouts.js';
import exercisesRoutes from './routes/exercises.js';
import progressRoutes from './routes/progress.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/training-plans', trainingPlansRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/workouts', workoutsRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/progress', progressRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
