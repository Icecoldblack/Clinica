import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import SidebarLayout from '../components/layout/SidebarLayout';

// Image URLs from original HTML design
const IMG_HERO = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnMNX5F7Jkp6Z2umlp3zGHrjiU5rey2lA-n8aoUMV1edpMSCRQ-m8oJy9L3-vYJd5oJgzYNKUp4jNY9vVITDWN7F2fQ1lNUeVW0h8IsKavCHvBYpoy1mA-owfRBNQvFLhro2-sQloqYtZdFjhz6IzKnlLXp0Cp_v7sxDjOPvTZSs9pBD2oJCes22WqrVkUe_sS3Guxxvyk3213zrI8lPUKZ3JklX8HcTVOZqqout4qRIhgSU8JEly4Xe0e9tt8Y645HwBboD8TEqo';
const IMG_MAP_PREVIEW = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBS8ziPQBRDnXY61ku6JZdDM3MHJ9B5xgd2t6FdQVKBiAJ6aXYZhg0KPUtcyhH81yaWGO2HfzvSRM1HiCJvwXRu3x7zCxNx8hJCsbobSjc5CZ5Jry3c_Mu0chAOjKQql1iBlzP6NVH5T8bxOqCUwAj5LMs2wzvbdzzOPER7XXVi2v-ssv_juG7xfYUeyC2T5e9COnh1auOnXmEn0sUoWZp9c4xyvrZpoLeTYHoG691yjUTK6JIcofINuU-p-HCzuuxJ86mXX3YcTic';
const IMG_RIGHTS = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlYvPVOndm2cGKq7E2uF8hBdp6AZ-BDJdt_5jQ-UXGffuATWulPhIJXqLc85KIGn4mcmMkn_S4xwD7CVwlnK4bJ-qfruWz7H3naAGi7sWl8mvQfGK6ZBZ4Bl3_GDLh9fjIDEqR7bULNL2dPyI6rLHUXrAMTGb6L2SJg4Frymow01lWlFTlz9_O4zEshu9VA66SkX_kMoU6wytIGkkTmNyll3SlCWJY6W_jchHQBmHyP-4QFS5x_o9Apal7gJg69kv6wUD2L3wvqNk';
const IMG_FQHC = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqnI7kRUfMZ0zFq7l2VRRILW2HxH45b0KawY7QapgqBt7WppzCK9yI30OcL1fLuKhP3YMp40_BDzWTwAGLXoH4e4XEFI3hdLX4HXeIZxu8m0G0QWklKCjgt5SCDYBx6ykz6SvSHSH17j074XUJLvO2A-qdOz-iLCZpx1gbjT6FtRUPWmKE_k6Rw3OquN7mCT7ZwA1gA7Pyv_7XJxEYLXlvYh2ES3wd1Tccp5dGwlkiC1lcUQbZGAF36yzxcNlg-qUqPScROxWywO4';
const IMG_USER_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvdoHPz2sRUrB-D9AaKIIeXD1c-HZs4s9mjJ4gzykvWzIGAg8ueRCx-ePOhw8vmJ3Me_WRK0Lxad2_evG4JAGA5kOxlatGHFw3Wa0ONHvEpNKOfk0L-PXHRGMlTP_miXYDADOICf1foenJjXJ18GpxzDhqZCAI_6y9WMjXFgENI5Ub0D2YUwEeikCcrueDRfbEMTz-MiZXirXgAozwrg6WoB-iKRHO_LxvobUexlJOSZx1rau5m2kEY1CkqgT2EHzBrDW2jZU9pvc';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { situation } = useAppContext();

  useEffect(() => {
    if (!situation) navigate('/', { replace: true });
  }, [situation, navigate]);

  if (!situation) return null;

  const situationLabel: Record<string, string> = {
    no_insurance: Object.keys(t('home', { returnObjects: true }) as object).includes('sit_no_insurance') ? t('home.sit_no_insurance') : 'No Insurance',
    undocumented: Object.keys(t('home', { returnObjects: true }) as object).includes('sit_undocumented') ? t('home.sit_undocumented') : 'Immigration Concerns',
    mental_health: Object.keys(t('home', { returnObjects: true }) as object).includes('sit_mental_health') ? t('home.sit_mental_health') : 'Mental Health Support',
    insured: Object.keys(t('home', { returnObjects: true }) as object).includes('sit_insured') ? t('home.sit_insured') : 'Insured – Needs Help',
  };

  return (
    <SidebarLayout activeNav="home">
      <main className="px-6 lg:px-12 max-w-7xl mx-auto py-8">
        {/* Hero Welcome */}
        <section className="relative overflow-hidden rounded-xl mb-12 group">
          <img
            src={IMG_HERO}
            alt="Warm interior of a community health center"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary-container opacity-90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
          <div className="relative z-10 p-8 lg:p-16 flex flex-col items-start max-w-2xl">
            <h2 className="font-headline text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
              {t('home.welcome_title')}<br />
              {t('home.welcome_subtitle')}
            </h2>
            <p className="text-white/90 text-lg mb-8 font-medium">
              {t('home.welcome_text')}
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="bg-surface-container-lowest text-primary px-8 py-3 rounded-lg font-bold shadow-xl shadow-black/10 hover:bg-surface-bright transition-all active:scale-95"
            >
              {t('home.btn_view_records')}
            </button>
          </div>
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Start AI Triage - Primary Action */}
          <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/15 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  medical_services
                </span>
                {t('home.bento_ai_badge')}
              </div>
              <h3 className="font-headline text-3xl font-extrabold text-on-surface">{t('home.bento_ai_title')}</h3>
              <p className="text-on-surface-variant leading-relaxed">
                {t('home.bento_ai_desc')}
              </p>
              <button
                onClick={() => navigate('/chat')}
                className="mt-4 flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-container transition-all active:scale-95"
              >
                {t('home.bento_ai_btn')}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="absolute inset-0 bg-tertiary/10 rounded-full scale-110 blur-xl" />
              <div className="relative bg-surface-container rounded-3xl p-6 shadow-inner">
                <span className="material-symbols-outlined text-7xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  chat_bubble
                </span>
                <span className="material-symbols-outlined absolute -top-2 -right-2 text-4xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
              </div>
            </div>
          </div>

          {/* Insurance Status */}
          <div className="md:col-span-4 bg-error-container/20 rounded-xl p-8 border border-error/10 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">{t('home.bento_profile_title')}</h4>
              <p className="text-xl font-headline font-bold text-error">
                {t('home.bento_profile_current')}<br />
                {situationLabel[situation] || situation}
              </p>
            </div>
            <div className="mt-8 space-y-3">
              <p className="text-sm text-on-surface-variant">
                {t('home.bento_profile_desc')}
              </p>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-primary font-bold text-sm group"
              >
                {t('home.bento_profile_update')}
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">edit</span>
              </button>
            </div>
          </div>

          {/* Nearby Clinics Preview */}
          <div className="md:col-span-6 bg-surface-container-low rounded-xl overflow-hidden shadow-sm border border-outline-variant/15">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline text-xl font-bold">{t('home.bento_clinics_title')}</h3>
                <button onClick={() => navigate('/clinics')} className="text-secondary font-bold text-sm">
                  {t('home.bento_clinics_view')}
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-lg">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-on-surface">Community Health East</p>
                    <p className="text-xs text-on-surface-variant">{t('home.bento_clinics_dist1')}</p>
                  </div>
                  <span className="text-xs font-bold text-secondary">{t('home.bento_clinics_open')}</span>
                </div>
                <div className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-lg">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-on-surface">Mission District Medical</p>
                    <p className="text-xs text-on-surface-variant">{t('home.bento_clinics_dist2')}</p>
                  </div>
                  <span className="text-xs font-bold text-tertiary">{t('home.bento_clinics_closing')}</span>
                </div>
              </div>
            </div>
            {/* Map thumbnail image */}
            <div className="h-32 relative overflow-hidden">
              <img
                src={IMG_MAP_PREVIEW}
                alt="Map preview"
                className="w-full h-full object-cover opacity-50 grayscale"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary text-white p-2 rounded-full shadow-lg">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Resources */}
          <div className="md:col-span-6 grid grid-cols-1 gap-6">
            <button
              onClick={() => navigate('/resources')}
              className="bg-surface rounded-xl p-6 border border-outline-variant/20 shadow-sm flex gap-6 items-center text-left hover:shadow-lg transition-all"
            >
              <div className="flex-1">
                <h4 className="font-headline font-bold text-lg text-primary mb-1">{t('home.bento_rights_title')}</h4>
                <p className="text-sm text-on-surface-variant mb-3">
                  {t('home.bento_rights_desc')}
                </p>
                <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1">
                  {t('home.bento_rights_btn')} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
              <div className="w-24 h-24 bg-primary/5 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={IMG_RIGHTS}
                  alt="Legal rights guide"
                  className="w-full h-full object-cover mix-blend-multiply opacity-80"
                />
              </div>
            </button>

            <button
              onClick={() => navigate('/resources')}
              className="bg-surface rounded-xl p-6 border border-outline-variant/20 shadow-sm flex gap-6 items-center text-left hover:shadow-lg transition-all"
            >
              <div className="flex-1">
                <h4 className="font-headline font-bold text-lg text-primary mb-1">{t('home.bento_fqhc_title')}</h4>
                <p className="text-sm text-on-surface-variant mb-3">
                  {t('home.bento_fqhc_desc')}
                </p>
                <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1">
                  {t('home.bento_fqhc_btn')} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
              <div className="w-24 h-24 bg-secondary/5 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={IMG_FQHC}
                  alt="FQHC protection"
                  className="w-full h-full object-cover mix-blend-multiply opacity-80"
                />
              </div>
            </button>
          </div>

          {/* Safety Callout */}
          <div className="md:col-span-12 bg-tertiary-fixed/30 rounded-xl p-8 border border-tertiary/10 flex items-center gap-6">
            <div className="w-16 h-16 bg-tertiary/20 rounded-full flex items-center justify-center text-tertiary shrink-0">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            </div>
            <div>
              <h5 className="font-headline font-bold text-xl text-on-tertiary-fixed-variant">{t('home.safety_title')}</h5>
              <p className="text-on-tertiary-fixed-variant opacity-80">
                {t('home.safety_desc')}
              </p>
            </div>
          </div>
        </div>

        {/* User profile Easter egg in sidebar is handled by SidebarLayout */}
        {/* Hidden avatar image preload */}
        <img src={IMG_USER_AVATAR} alt="" className="hidden" aria-hidden />
      </main>
    </SidebarLayout>
  );
}
