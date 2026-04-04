import { Navigate, useLocation } from 'react-router-dom';

interface RouteGuardProps {
  children: React.ReactNode;
  requires: 'session' | 'analysis';
}

export default function RouteGuard({ children, requires }: RouteGuardProps) {
  const location = useLocation();
  const hasSession = !!sessionStorage.getItem('sessionId');
  const hasAnalysis = !!location.state?.analysisResult;

  if (requires === 'session' && !hasSession) {
    return <Navigate to="/intake" replace />;
  }

  if (requires === 'analysis' && !hasAnalysis && !hasSession) {
    return <Navigate to="/intake" replace />;
  }

  return <>{children}</>;
}
