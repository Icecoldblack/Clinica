import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RouteGuard from './components/RouteGuard';
import WelcomePage from './pages/WelcomePage';
import IntakePage from './pages/IntakePage';
import SymptomsPage from './pages/SymptomsPage';
import AnalysisPage from './pages/AnalysisPage';
import ResultsPage from './pages/ResultsPage';
import ChatPage from './pages/ChatPage';
import './App.css';

function App() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/intake" element={<IntakePage />} />
        <Route path="/symptoms" element={<RouteGuard requires="session"><SymptomsPage /></RouteGuard>} />
        <Route path="/analysis" element={<RouteGuard requires="session"><AnalysisPage /></RouteGuard>} />
        <Route path="/results" element={<RouteGuard requires="session"><ResultsPage /></RouteGuard>} />
        <Route path="/chat" element={<RouteGuard requires="session"><ChatPage /></RouteGuard>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
