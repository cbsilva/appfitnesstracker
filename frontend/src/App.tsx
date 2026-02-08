import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TrainingPlan from './pages/TrainingPlan';
import Students from './pages/Students';
import StudentTracking from './pages/StudentTracking';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/training-plan/:id" element={<TrainingPlan />} />
        <Route path="/student/:id" element={<StudentTracking />} />
      </Routes>
    </Router>
  );
}

export default App;
