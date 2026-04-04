import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { useHospitalSearch } from '../hooks/useHospitalSearch';
import SidebarLayout from '../components/layout/SidebarLayout';
import ClinicMap from '../components/map/ClinicMap';
import HospitalCard from '../components/hospitals/HospitalCard';
import InsuranceModal from '../components/hospitals/InsuranceModal';

export default function HospitalsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { situation, insuranceInfo, userLocation, setUserLocation } = useAppContext();
  const { results, isLoading, error, search } = useHospitalSearch();

  const [zipCode, setZipCode] = useState(searchParams.get('zip') || '');
  const [radius, setRadius] = useState<number>(10);
  const [activeHospitalId, setActiveHospitalId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Route guard
  useEffect(() => {
    if (!situation) navigate('/', { replace: true });
  }, [situation, navigate]);

  // Initial search if zip is provided in URL and we have insurance config
  useEffect(() => {
    if (zipCode && insuranceInfo && insuranceInfo.provider) {
      handleSearch();
    }
  }, []);

  const handleSearch = () => {
    if (!insuranceInfo?.provider) {
      setShowModal(true);
      return;
    }
    setSearchParams(zipCode ? { zip: zipCode } : {});
    search({
      zipCode: zipCode || undefined,
      lat: zipCode ? undefined : userLocation?.lat,
      lng: zipCode ? undefined : userLocation?.lng,
      insuranceProvider: insuranceInfo.provider,
      planName: insuranceInfo.planName,
      radiusMiles: radius,
    });
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setZipCode('');
        },
        () => {},
        { enableHighAccuracy: false, timeout: 5000 }
      );
    }
  };

  if (!situation) return null;

  const mapCenter = results && results.hospitals.length > 0
    ? { lat: results.hospitals[0].lat, lng: results.hospitals[0].lng }
    : { lat: userLocation?.lat ?? 33.749, lng: userLocation?.lng ?? -84.388 };

  // Transform hospitals for ClinicMap compatibility
  const mapItems = results?.hospitals.map(h => ({
    id: h.id,
    lat: h.lat,
    lng: h.lng,
    isHospital: true,
    acceptsInsurance: h.acceptsInsurance
  })) || [];

  return (
    <SidebarLayout activeNav="hospitals">
      <main className="flex flex-col md:flex-row flex-1 overflow-hidden" style={{ height: 'calc(100vh - 73px)' }}>
        
        {/* Left Panel */}
        <aside className="w-full md:w-[450px] bg-surface flex flex-col border-r border-outline-variant/15 overflow-y-auto custom-scrollbar flex-shrink-0">
          <div className="p-6 pb-24 space-y-6">
            <h1 className="font-headline text-3xl font-bold text-on-surface">
              {t('hospitals.page_title')}
            </h1>

            {/* Insurance Context Card */}
            {insuranceInfo ? (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Tu Seguro</p>
                  <p className="font-bold text-on-surface leading-tight">{insuranceInfo.provider}</p>
                  {insuranceInfo.planName && <p className="text-sm text-on-surface-variant">{insuranceInfo.planName}</p>}
                </div>
                <button onClick={() => setShowModal(true)} className="text-sm font-bold text-secondary hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-outline-variant/30 bg-surface">
                  {t('hospitals.edit_insurance')}
                </button>
              </div>
            ) : (
              <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl p-5 text-center">
                <span className="material-symbols-outlined text-warning text-3xl mb-2">info</span>
                <p className="text-sm text-on-surface-variant mb-4">{t('hospitals.add_insurance_prompt')}</p>
                <button onClick={() => setShowModal(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-container transition-colors">
                  {t('hospitals.add_insurance_cta')}
                </button>
              </div>
            )}

            {/* Search Controls */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder={t('hospitals.search_placeholder')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant/30 bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50">pin_drop</span>
                </div>
                <button 
                  onClick={handleUseLocation}
                  disabled={!!zipCode}
                  className="px-4 bg-surface border border-outline-variant/30 rounded-xl hover:bg-surface-container transition-colors text-secondary disabled:opacity-40"
                  title={t('hospitals.use_location')}
                >
                  <span className="material-symbols-outlined mt-1">my_location</span>
                </button>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm font-bold text-on-surface-variant whitespace-nowrap">
                  {t('hospitals.radius_label')}: {radius} mi
                </label>
                <input
                  type="range"
                  min="5" max="50" step="5"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <button 
                onClick={handleSearch}
                disabled={isLoading || (!zipCode && !userLocation)}
                className="w-full py-3.5 rounded-xl font-headline font-bold text-lg bg-surface-container-highest text-on-surface hover:bg-primary hover:text-white transition-all shadow-md disabled:opacity-50"
              >
                {isLoading ? <span className="material-symbols-outlined animate-spin font-bold">progress_activity</span> : t('hospitals.search_button')}
              </button>
            </div>

            <hr className="border-outline-variant/15 border-dashed" />

            {/* Loading / Results / Empty States */}
            {isLoading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 animate-pulse h-[200px]" />
                ))}
              </div>
            )}

            {error && !isLoading && (
               <div className="text-center py-6 bg-error/5 border border-error/20 rounded-xl">
                 <p className="text-sm font-bold text-error">{error}</p>
               </div>
            )}

            {results && !isLoading && results.hospitals.length === 0 && (
              <div className="text-center py-10 bg-surface-container-low rounded-xl">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3">explore_off</span>
                <p className="text-sm font-medium text-on-surface-variant px-6">{t('hospitals.no_results')}</p>
              </div>
            )}

            {results && !isLoading && (
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">
                   {results.totalFound} Hospitals Found
                </p>
                {results.hospitals.map((h) => (
                  <HospitalCard 
                    key={h.id} 
                    hospital={h} 
                    isActive={activeHospitalId === h.id}
                    onClick={() => setActiveHospitalId(h.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Right Panel: Map */}
        <section className="flex-1 relative">
          <ClinicMap
            // @ts-ignore mapping generic coordinates for the map
            clinics={mapItems}
            center={mapCenter}
            activeClinicId={activeHospitalId}
            onMarkerClick={(id) => setActiveHospitalId(id)}
          />
        </section>

      </main>

      {showModal && <InsuranceModal onClose={() => setShowModal(false)} onSave={() => { setShowModal(false); handleSearch(); }} />}
    </SidebarLayout>
  );
}
