import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TrainingPlan from './pages/TrainingPlan';
import Students from './pages/Students';
import StudentPlans from './pages/StudentPlans';
import Workouts from './pages/Workouts';
import NewWorkout from './pages/NewWorkout';
import Exercises from './pages/Exercises';
import StudentTracking from './pages/StudentTracking';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/:id/plans" element={<StudentPlans />} />
        <Route path="/training-plan/new" element={<TrainingPlan />} />
        <Route path="/training-plan/:id" element={<TrainingPlan />} />
        <Route path="/workouts/:planId" element={<Workouts />} />
        <Route path="/workouts/:planId/new" element={<NewWorkout />} />
        <Route path="/exercises/:workoutId" element={<Exercises />} />
        <Route path="/student/:id" element={<StudentTracking />} />
      </Routes>
    </Router>
  );
}

export default App;
