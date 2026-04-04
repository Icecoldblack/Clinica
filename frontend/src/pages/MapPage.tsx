import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { useClinics } from '../hooks/useClinics';
import SidebarLayout from '../components/layout/SidebarLayout';
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
    if (!situation) navigate('/', { replace: true });
  }, [situation, navigate]);

  // Geolocation
  useEffect(() => {
    if (!userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { enableHighAccuracy: false, timeout: 5000 }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!situation) return null;

  const mapCenter: [number, number] = [userLocation?.lat ?? 33.749, userLocation?.lng ?? -84.388];

  return (
    <SidebarLayout activeNav="clinics">
      <main className="flex flex-col md:flex-row flex-1 overflow-hidden" style={{ height: 'calc(100vh - 73px)' }}>
        {/* Sidebar */}
        <aside className="w-full md:w-[380px] bg-surface flex flex-col border-r border-outline-variant/15 overflow-y-auto custom-scrollbar flex-shrink-0">
          <InfoCallout title={t('map.callout_title')} body={t('map.callout_body')} />
          <FilterPanel />

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

            {!isLoading &&
              clinics.map((clinic) => (
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
    </SidebarLayout>
  );
}
