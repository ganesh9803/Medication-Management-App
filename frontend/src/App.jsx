//src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginRegister from './pages/LoginRegister';
import PatientDashboard from './pages/PatientDashboard';
import CaretakerDashboard from './pages/CaretakerDashboard';
import ProtectedLayout from './components/ProtectedLayout';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRegister />} />

        <Route element={<ProtectedLayout allowedRole="PATIENT" />}>
          <Route path="/patient" element={<PatientDashboard />} />
        </Route>

        <Route element={<ProtectedLayout allowedRole="CARETAKER" />}>
          <Route path="/caretaker" element={<CaretakerDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
