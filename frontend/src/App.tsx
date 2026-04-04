import { Routes, Route, Navigate } from 'react-router-dom';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import MapPage from './pages/MapPage';
import HospitalsPage from './pages/HospitalsPage';
import ResourcesPage from './pages/ResourcesPage';
import ProfilePage from './pages/ProfilePage';
import ClinicDetailsPage from './pages/ClinicDetailsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/clinics" element={<MapPage />} />
      <Route path="/clinics/:id" element={<ClinicDetailsPage />} />
      <Route path="/hospitals" element={<HospitalsPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
