import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './LanguageToggle';
import { useAppContext } from '../../context/AppContext';

interface NavbarProps {
  showFindClinics?: boolean;
  clinicsActive?: boolean;
  suggestPulse?: boolean;
}

export default function Navbar({ showFindClinics = false, clinicsActive = false, suggestPulse = false }: NavbarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { chatHistory } = useAppContext();

  const isMapPage = location.pathname === '/clinics';

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15">
      <nav className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
        {/* Brand */}
        <Link to="/" className="text-2xl font-black text-primary font-headline tracking-tight">
          Clínica
        </Link>

        {/* Desktop Nav Actions */}
        <div className="hidden md:flex items-center gap-6">
          <LanguageToggle />

          {showFindClinics && (
            <Link
              to="/clinics"
              className={`px-6 py-2.5 rounded-lg font-headline font-bold text-lg uppercase tracking-tight transition-all ${
                clinicsActive || isMapPage
                  ? `bg-primary text-on-primary shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-95 ${
                      suggestPulse ? 'animate-pulse-glow' : ''
                    }`
                  : 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed pointer-events-none'
              }`}
            >
              {t('chat.btn_find_clinics')}
            </Link>
          )}
        </div>

        {/* Mobile language toggle */}
        <div className="md:hidden">
          <LanguageToggle />
        </div>
      </nav>
    </header>
  );
}
