import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import SidebarLayout from '../components/layout/SidebarLayout';

// Image URLs from original HTML design
const IMG_USER_HEADER = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbA43Lr49rXFOtIzhFFr0Wle479BX6PwyBJpAHQb6b6lf_8fT2Lb6tSHxenfxJExOLZq6aIw_VQosWMki4r3OwxqJaFvMO6fTRCPiXjZZDJgMsrKHToFt_Rrq_YsEgNDwr3jCatmEJIxheH-hrpuRBCqQ7Pd3cd3CgIpsWphMJublncLXL1oua-637d0flUpRoOA7QDaW_1JGTRXSh2Fh8clsMV8GOp59UtMx6yHz5SwWCCwUSB9c0v-Su3QFmYpG8p18BEfBSeHs';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { situation, sessions, savedHospitals, insuranceInfo } = useAppContext();

  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (b.status === 'active' && a.status !== 'active') return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  if (!situation) return <Navigate to="/" replace />;

  const situationLabel: Record<string, string> = {
    no_insurance: Object.keys(t('home', { returnObjects: true }) as object).includes('sit_no_insurance') ? t('home.sit_no_insurance') : 'No Insurance',
    undocumented: Object.keys(t('home', { returnObjects: true }) as object).includes('sit_undocumented') ? t('home.sit_undocumented') : 'Immigration Concerns',
    mental_health: Object.keys(t('home', { returnObjects: true }) as object).includes('sit_mental_health') ? t('home.sit_mental_health') : 'Mental Health Support',
    insured: Object.keys(t('home', { returnObjects: true }) as object).includes('sit_insured') ? t('home.sit_insured') : 'Insured – Needs Help',
  };

  return (
    <SidebarLayout activeNav="profile">
      <main className="px-6 lg:px-12 max-w-7xl mx-auto py-8">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8">
            {/* Header */}
            <div className="mb-12">
              <span className="text-tertiary font-bold tracking-widest uppercase text-xs mb-2 block">{t('profile.welcome_back')}</span>
              <h2 className="text-5xl font-extrabold text-primary tracking-tight leading-none mb-4">{t('profile.title')}</h2>
              <p className="text-on-surface-variant text-lg max-w-xl">
                {t('profile.subtitle')}
              </p>
            </div>

            {/* Current Situation Card */}
            <div className="bg-surface-container-low rounded-xl p-8 mb-12 shadow-[0_32px_32px_-4px_rgba(27,28,27,0.06)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <span className="material-symbols-outlined text-[120px]">security</span>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <span className="p-2 bg-primary/10 rounded-lg">
                    <span className="material-symbols-outlined text-primary">verified_user</span>
                  </span>
                  <h3 className="text-2xl font-bold">{t('profile.current_situation')}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-surface-container-lowest p-5 rounded-lg border-b-2 border-secondary">
                    <p className="text-sm text-on-surface-variant mb-1 font-label uppercase tracking-tighter">{t('profile.insurance_status')}</p>
                    <p className="text-xl font-bold text-primary">{situationLabel[situation] || situation}</p>
                    {(situation === 'no_insurance' || situation === 'undocumented') && (
                      <p className="text-xs text-secondary mt-2">{t('profile.qualified')}</p>
                    )}
                  </div>
                  {insuranceInfo && (
                    <div className="bg-surface-container-lowest p-5 rounded-lg border-b-2 border-tertiary">
                      <p className="text-sm text-on-surface-variant mb-1 font-label uppercase tracking-tighter">{t('profile.insurance_provider', 'Insurance Provider')}</p>
                      <p className="text-xl font-bold text-tertiary">{insuranceInfo.provider}</p>
                      <p className="text-xs text-on-surface-variant mt-2">{t('profile.insurance_plan', 'Plan')}: {insuranceInfo.planName}</p>
                    </div>
                  )}
                  <div className="bg-surface-container-lowest p-5 rounded-lg">
                    <p className="text-sm text-on-surface-variant mb-1 font-label uppercase tracking-tighter">{t('profile.primary_need')}</p>
                    <p className="text-xl font-bold">{t('profile.primary_triage')}</p>
                    <p className="text-xs text-on-surface-variant/60 mt-2">{t('profile.active_session')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat History */}
            <div>
              <div className="flex justify-between items-end mb-8">
                <h3 className="text-3xl font-bold text-secondary">{t('profile.chat_history')}</h3>
                <button className="text-primary font-bold text-sm hover:underline">
                  {t('profile.view_all')}
                </button>
              </div>

              <div className="space-y-6">
                {sortedSessions.length > 0 ? (
                  sortedSessions.map((session) => (
                    <div key={session.sessionId} className={`bg-surface-container-lowest rounded-xl p-6 shadow-[0_32px_32px_-4px_rgba(27,28,27,0.06)] border-l-4 ${session.status === 'active' ? 'border-primary' : 'border-outline-variant/30'} transition-transform hover:scale-[1.01]`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs font-bold text-tertiary uppercase tracking-widest mb-1">
                            {new Date(session.updatedAt).toLocaleDateString()}
                          </p>
                          <h4 className="text-xl font-bold">
                            {session.title || t('profile.session_title', 'Health Consultation')}
                            {session.severity && (
                              <span className="text-[10px] bg-error/10 text-error px-2 py-0.5 rounded-sm ml-3 uppercase tracking-wider align-middle">{session.severity}</span>
                            )}
                          </h4>
                        </div>
                        <span className={`${session.status === 'active' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'} px-3 py-1 rounded-full text-xs font-bold uppercase`}>
                          {session.status === 'active' ? t('profile.active_badge', 'Active') : t('profile.completed_badge', 'Completed')}
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">
                        {session.summary || `${session.messages.length} ${t('profile.messages_count', 'messages')}`}
                      </p>
                      
                      {session.tags && session.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {session.tags.map((tag, idx) => (
                            <span key={idx} className="bg-surface-container text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        {session.status === 'active' ? (
                          <button
                            onClick={() => navigate('/chat')}
                            className="flex items-center gap-2 text-sm font-bold text-secondary"
                          >
                            <span className="material-symbols-outlined text-sm">chat</span>
                            {t('profile.resume_chat')}
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(session.summary || '');
                              alert('Summary copied to clipboard!');
                            }}
                            className="flex items-center gap-2 text-sm font-bold text-primary"
                          >
                            <span className="material-symbols-outlined text-sm">content_copy</span>
                            {t('profile.download_summary', 'Copy Summary')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-surface-container-low rounded-xl p-8 text-center shadow-sm">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-3 block">forum</span>
                    <h4 className="text-xl font-bold mb-2">{t('profile.no_sessions', 'No triage sessions yet')}</h4>
                    <p className="text-on-surface-variant mb-6">{t('profile.no_sessions_desc', 'Start a health conversation to get personalized guidance.')}</p>
                    <button
                      onClick={() => navigate('/chat')}
                      className="bg-primary text-white font-bold py-2 px-6 rounded-lg inline-flex items-center gap-2 hover:bg-primary-container transition-colors active:scale-95 shadow-md"
                    >
                      <span className="material-symbols-outlined text-sm">send</span>
                      {t('profile.start_first_session', 'Start Your First Session')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <aside className="lg:col-span-4 sticky top-28 space-y-8">
            {/* User header pill */}
            <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/10 flex-shrink-0">
                <img
                  src={IMG_USER_HEADER}
                  alt="User profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{t('profile.welcome_back')}</p>
                <p className="font-bold text-on-surface">{t('profile.member_type')}</p>
              </div>
            </div>

            {/* Saved Clinics */}
            <div className="bg-surface-container-low rounded-xl p-6 shadow-[0_32px_32px_-4px_rgba(27,28,27,0.06)]">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary">bookmark</span>
                {t('profile.saved_clinics')}
              </h3>
              <div className="space-y-4">
                {savedHospitals.length > 0 ? (
                  savedHospitals.map((saved) => (
                    <div key={saved.hospital.id} className="relative">
                      <div className="group cursor-pointer pr-8" onClick={() => navigate('/hospitals')}>
                        <h4 className="font-bold text-lg group-hover:text-primary transition-colors flex items-center gap-1 leading-tight mb-1">
                          {saved.hospital.name}
                          {saved.hospital.acceptsInsurance && (
                            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          )}
                        </h4>
                        <p className="text-sm text-on-surface-variant mb-2 font-medium">
                          {saved.hospital.distanceMiles.toFixed(1)} {t('hospitals.miles_away', 'miles away')} • {saved.hospital.isOpenNow ? t('profile.open_now') : t('profile.closes')}
                        </p>
                        <p className="text-xs text-on-surface-variant/70 mb-2 truncate">{saved.hospital.address}</p>
                        <div className="flex flex-wrap gap-2">
                          {saved.hospital.rating > 0 && (
                            <span className="bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                              <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              {saved.hospital.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="bg-[#f2ede9] h-[1px] w-full my-4 last:hidden" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant/30 mb-2 block">bookmark_border</span>
                    <p className="font-bold text-on-surface-variant mb-1">{t('profile.no_saved_hospitals', 'No saved hospitals yet')}</p>
                    <p className="text-xs text-on-surface-variant/60 mb-4">{t('profile.no_saved_hospitals_desc', 'Search and bookmark hospitals for quick access.')}</p>
                  </div>
                )}

                <button
                  onClick={() => navigate('/hospitals')}
                  className="w-full mt-6 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-container transition-colors shadow-lg shadow-primary/20 active:scale-95 block text-center"
                >
                  {savedHospitals.length > 0 ? t('profile.explore_more') : t('profile.find_hospitals_cta', 'Find Hospitals')}
                </button>
              </div>
            </div>

            {/* Need Help CTA */}
            <div className="p-6 bg-secondary text-white rounded-xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-2">{t('profile.need_help')}</h4>
                <p className="text-sm opacity-80 mb-4">
                  {t('profile.need_help_desc')}
                </p>
                <button
                  onClick={() => navigate('/chat')}
                  className="bg-tertiary text-on-tertiary-fixed font-bold px-6 py-2 rounded-lg active:scale-95 transition-transform"
                >
                  {t('profile.new_triage')}
                </button>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-20">
                <span className="material-symbols-outlined text-[80px]">medical_services</span>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </SidebarLayout>
  );
}
