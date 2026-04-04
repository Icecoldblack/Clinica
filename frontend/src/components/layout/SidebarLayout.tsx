import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import type { ReactNode } from 'react';

interface SidebarLayoutProps {
  children: ReactNode;
  activeNav?: 'home' | 'chat' | 'hospitals' | 'resources' | 'profile';
}

const NAV_ITEMS = [
  { key: 'home', icon: 'home', path: '/home' },
  { key: 'chat', icon: 'chat_bubble', path: '/chat' },
  { key: 'hospitals', icon: 'local_hospital', path: '/hospitals' },
  { key: 'resources', icon: 'library_books', path: '/resources' },
];

const MOBILE_ITEMS = [
  { key: 'home', icon: 'home', path: '/home' },
  { key: 'chat', icon: 'medical_services', path: '/chat' },
  { key: 'hospitals', icon: 'local_hospital', path: '/hospitals' },
  { key: 'resources', icon: 'contact_support', path: '/resources' },
];

export default function SidebarLayout({ children, activeNav }: SidebarLayoutProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useAppContext();

  const currentNav = activeNav || (() => {
    if (location.pathname === '/home') return 'home';
    if (location.pathname === '/chat') return 'chat';
    if (location.pathname.startsWith('/hospitals')) return 'hospitals';
    if (location.pathname === '/resources') return 'resources';
    if (location.pathname === '/profile') return 'profile';
    return 'home';
  })();

  return (
    <div className="bg-surface min-h-screen flex">
      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full z-40 py-8 flex-col w-64 rounded-r-2xl bg-surface shadow-xl shadow-primary/5 border-r border-outline-variant/10">
        {/* Brand */}
        <div className="px-8 mb-12">
          <h1 className="text-xl font-black text-primary font-headline">Clínica</h1>
          <p className="font-body font-medium text-xs text-secondary opacity-70">Your Health Navigator</p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-2 px-4">
          {NAV_ITEMS.map((item) => {
            const isActive = currentNav === item.key;
            const labelMap: Record<string, string> = {
              home: t('nav.home'),
              chat: t('nav.chat'),
              hospitals: t('nav.hospitals'),
              resources: t('nav.resources'),
            };
            return (
              <NavLink
                key={item.key}
                to={item.path}
                className={`flex items-center gap-3 py-3 pl-4 rounded-lg transition-all ${
                  isActive
                    ? 'text-primary font-bold border-l-4 border-primary'
                    : 'text-secondary opacity-70 hover:bg-surface-container-high'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="font-body font-medium text-sm">{labelMap[item.key]}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Links */}
        <div className="px-4 mt-auto space-y-2 border-t border-outline-variant/10 pt-4">
          <button
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="flex items-center gap-3 py-3 pl-4 text-secondary opacity-70 hover:bg-surface-container-high rounded-lg transition-all w-full text-left"
          >
            <span className="material-symbols-outlined">language</span>
            <span className="font-body font-medium text-sm">
              {language === 'en' ? 'Español' : 'English'}
            </span>
          </button>

          <NavLink
            to="/profile"
            className={`flex items-center gap-3 py-3 pl-4 rounded-lg transition-all ${
              currentNav === 'profile'
                ? 'text-primary font-bold border-l-4 border-primary'
                : 'text-secondary opacity-70 hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined">person</span>
            <span className="font-body font-medium text-sm">{t('nav.profile')}</span>
          </NavLink>
        </div>
      </aside>

      {/* ─── Desktop Top Bar ─── */}
      <header className="fixed top-0 left-0 md:left-64 right-0 z-30 bg-surface/90 backdrop-blur-xl">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          <div className="md:hidden">
            <span className="text-2xl font-black text-primary font-headline">Clínica</span>
          </div>
        </div>
        <div className="bg-outline-variant/20 h-[1px] w-full" />
      </header>

      {/* ─── Main Content ─── */}
      <div className="md:ml-64 pt-[73px] pb-24 md:pb-0 w-full">
        {children}
      </div>

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-surface/80 backdrop-blur-xl border-t border-primary/10 shadow-[0_-4px_24px_rgba(154,64,40,0.08)] rounded-t-3xl">
        {MOBILE_ITEMS.map((item) => {
          const isActive = currentNav === item.key;
          const labelMap: Record<string, string> = {
            home: t('nav.home'),
            chat: t('nav.triage'),
            hospitals: t('nav.hospitals'),
            resources: t('nav.support'),
          };
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center transition-all active:scale-90 ${
                isActive
                  ? 'bg-primary text-white rounded-full p-3 mb-2 scale-110'
                  : 'text-secondary opacity-60 hover:opacity-100'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="font-body text-[11px] font-semibold">{labelMap[item.key]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
