import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import HospitalsPage from './pages/HospitalsPage';
import ResourcesPage from './pages/ResourcesPage';
import ProfilePage from './pages/ProfilePage';
import { useAppContext } from './context/AppContext';

// ── Global route transition overlay ──
// Rendered above <Routes> so it survives page changes.
// Phase A: overlay fades IN → logo animates (900ms)
// Phase B: navigate() fires, new page renders under the overlay
// Phase C: overlay fades OUT (500ms) revealing the new page
function RouteTransitionOverlay() {
  const { showRouteTransition, dismissRouteTransition } = useAppContext();
  const location = useLocation();
  const [fadingOut, setFadingOut] = useState(false);

  // When the route changes while overlay is showing, trigger the fade-out
  useEffect(() => {
    if (showRouteTransition) {
      setFadingOut(true);
      const timer = setTimeout(() => {
        setFadingOut(false);
        dismissRouteTransition();
      }, 550);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (!showRouteTransition && !fadingOut) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #fff8f6 0%, #fcf0eb 60%, #f5e0d8 100%)',
        animation: fadingOut
          ? 'clinica-overlay-out 0.55s cubic-bezier(0.4,0,1,1) forwards'
          : 'clinica-overlay-in 0.35s cubic-bezier(0.22,1,0.36,1) forwards',
        pointerEvents: 'all',
      }}
    >
      {/* Ripple rings */}
      {[0.2, 0.55, 0.9].map((delay) => (
        <div
          key={delay}
          style={{
            position: 'absolute',
            width: 220,
            height: 220,
            borderRadius: '50%',
            border: `2px solid rgba(185,87,62,${0.25 - delay * 0.1})`,
            animation: fadingOut ? 'none' : `clinica-ripple 1.2s cubic-bezier(0,0,0.2,1) ${delay}s infinite`,
          }}
        />
      ))}

      {/* Logo bubble */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          animation: fadingOut
            ? 'clinica-logo-out 0.4s cubic-bezier(0.4,0,1,1) forwards'
            : 'clinica-logo-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #b9573e 0%, #d4826a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 16px 48px rgba(185,87,62,0.35)',
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ color: 'white', fontSize: 40, fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
        </div>
        <span
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 900,
            fontSize: 36,
            letterSpacing: '-0.02em',
            color: '#b9573e',
            marginTop: 8,
          }}
        >
          Clínica
        </span>
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
            color: '#a07060',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 600,
            opacity: fadingOut ? 0 : 0,
            animation: fadingOut ? 'none' : 'clinica-tagline-in 0.5s ease 0.7s forwards',
          }}
        >
          Your health navigator
        </span>
      </div>

      <style>{`
        @keyframes clinica-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes clinica-overlay-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes clinica-logo-pop {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes clinica-logo-out {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(1.15); }
        }
        @keyframes clinica-ripple {
          0%   { transform: scale(1);   opacity: 1; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes clinica-tagline-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 0.7; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <>
      <RouteTransitionOverlay />
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/clinics" element={<Navigate to="/hospitals" replace />} />
        <Route path="/hospitals" element={<HospitalsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
