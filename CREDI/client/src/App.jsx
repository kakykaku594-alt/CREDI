import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register.jsx';
import VerifyOtp from './pages/VerifyOtp.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import RequireAuth from './components/RequireAuth.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
    </Routes>
  );
}
