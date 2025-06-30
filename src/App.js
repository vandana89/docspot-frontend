
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PatientDashboard from './pages/PatientDashboard'; // 👈 create this file

import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookAppointment from './pages/BookAppointment';
import DoctorProfile from './pages/DoctorProfile';
import PatientAppointments from "./pages/PatientAppointments";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/my-appointments" element={<PatientAppointments />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />


        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
