import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { useClinics } from '../hooks/useClinics';
import Navbar from '../components/common/Navbar';
import InfoCallout from '../components/common/InfoCallout';
import FilterPanel from '../components/map/FilterPanel';
import ClinicCard from '../components/map/ClinicCard';
import ClinicMap from '../components/map/ClinicMap';

export default function MapPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { situation, userLocation, setUserLocation } = useAppContext();
  const { clinics, isLoading, error } = useClinics();
  const [activeClinicId, setActiveClinicId] = useState<string | null>(null);

  // Route guard
  useEffect(() => {
    if (!situation) {
      navigate('/', { replace: true });
    }
  }, [situation, navigate]);

  // Geolocation (once)
  useEffect(() => {
    if (!userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // Silently use Atlanta default
        },
        { enableHighAccuracy: false, timeout: 5000 }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!situation) return null;

  const mapCenter: [number, number] = [
    userLocation?.lat ?? 33.749,
    userLocation?.lng ?? -84.388,
  ];

  return (
    <div className="bg-surface min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      <main className="flex flex-col md:flex-row flex-1 overflow-hidden" style={{ height: 'calc(100vh - 73px)' }}>
        {/* Sidebar */}
        <aside className="w-full md:w-[380px] bg-surface flex flex-col border-r border-outline-variant/15 overflow-y-auto custom-scrollbar flex-shrink-0">
          {/* Info Callout */}
          <InfoCallout
            title={t('map.callout_title')}
            body={t('map.callout_body')}
          />

          {/* Filters */}
          <FilterPanel />

          {/* Clinic List */}
          <div className="px-6 pb-24 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">
              {clinics.length} {t('map.clinics_nearby')}
            </p>

            {isLoading && (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {error && (
              <div className="text-center py-4">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            {!isLoading && clinics.map((clinic) => (
              <ClinicCard
                key={clinic.id}
                clinic={clinic}
                isActive={activeClinicId === clinic.id}
                onClick={() => setActiveClinicId(clinic.id)}
              />
            ))}

            {!isLoading && clinics.length === 0 && !error && (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">location_off</span>
                <p className="text-sm text-on-surface-variant mt-2">No clinics found with current filters.</p>
              </div>
            )}
          </div>
        </aside>

        {/* Map */}
        <section className="flex-1 relative">
          <ClinicMap
            clinics={clinics}
            center={mapCenter}
            activeClinicId={activeClinicId}
            onMarkerClick={(id) => setActiveClinicId(id)}
          />
        </section>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav active="map" />
    </div>
  );
}

function MobileBottomNav({ active }: { active: 'home' | 'chat' | 'map' | 'support' }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const items = [
    { key: 'home', icon: 'home', label: t('nav.home'), path: '/' },
    { key: 'chat', icon: 'medical_services', label: t('nav.triage'), path: '/chat' },
    { key: 'map', icon: 'location_on', label: t('nav.map'), path: '/clinics' },
    { key: 'support', icon: 'contact_support', label: t('nav.support'), path: '#' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-surface/80 backdrop-blur-xl border-t border-primary/10 shadow-[0_-4px_24px_rgba(154,64,40,0.08)]">
      {items.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => item.path !== '#' && navigate(item.path)}
            className={`flex flex-col items-center justify-center transition-all ${
              isActive
                ? 'bg-primary text-white rounded-full p-3 mb-2 scale-110'
                : 'text-secondary opacity-60'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="text-[11px] font-semibold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
