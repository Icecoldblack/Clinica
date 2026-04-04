import { Routes, Route } from 'react-router-dom';
import OnboardingPage from './pages/OnboardingPage';
import ChatPage from './pages/ChatPage';
import MapPage from './pages/MapPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/clinics" element={<MapPage />} />
    </Routes>
  );
}

export default App;
