import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import SidebarLayout from '../components/layout/SidebarLayout';

// Image URLs from original HTML design
const IMG_HERO_TEXTURE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZNwWdC3qH5dVEQ1yCtbxdlxxnTqdjD12ApbfYuUsy7PC9ii9EDfw9F_3WeTY8L0pChXcS8IHoQFQwO03tYao3pbarafLZct8w3LMN5YGf26HhGsSXU3N3Lna5Y5hR0jgomWorIuX2pDqeSHbdiUzxQmxM3Nsac-LX1lO01WVAIEHKgE2bVudjlDSlhDLVla5pazi9mpxoxLZabpJCiXmsjQopCu7dTC9AA5ZEWJD8Y2Eu9N4ZPvOxKbfSvxg66CXPbsD4cExjViA';
const IMG_MAP_SNIPPET = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAU3TZWZ7Mw53QlCm_U8S9IxSqkfUJ4eRp8G018ajZmWJEf8N_JWdwm0qWnlxrwcxS2JjebAQQ6xEx3ol065TXHsRqGMjOWnqLwIKBOxOotmxMm7iPTtUCvYTYD9SrvZD-q6gewVfSH6Lf1CDGaZ1MpLnbpA9eorPmn-mlnTqLMf0QlaLki6IrMJDc79LDVCw4l76fvOcSAGx_V3RPI6gOIG6GFotfcJOi9ifRGrtd_1IcZBEa-_ahWV17xsZU1KdWaHXRDFYmRzZw';
const IMG_USER_SIDEBAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFnPhk_y19TebKbyGQbAm4YkbiOBm5GfD0iC85-Jz_CQXVXRDLFYs_SCbIQDCN_IiweWJKyGmE7iTFPoLkmtSGU1EUKd2qcWfcgx1mbrMPW6Dq7kFoXSe3IPKFeHTmfzzZmivn_t9Lfk465jIrDCYoeltdcRnXUPReVeRetruOYHfZkZ3s07A2m9s2hRjwxtTQn1bwsiebClkyQNVbwiPdGPSE3FsRbc8X5iChNLmUbPzGOOpVicq0xicv_RYijb_RxHuFQpaBp0o';

export default function ClinicDetailsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { situation } = useAppContext();

  useEffect(() => {
    if (!situation) navigate('/', { replace: true });
  }, [situation, navigate]);

  if (!situation) return null;

  return (
    <SidebarLayout activeNav="clinics">
      <main className="px-4 md:px-8 max-w-7xl mx-auto py-8">
        {/* Hero Section */}
        <section className="mb-12 relative overflow-hidden rounded-xl bg-primary-container text-on-primary-container p-8 md:p-16 flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-primary/10">
          {/* Background texture */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <img
              src={IMG_HERO_TEXTURE}
              alt=""
              aria-hidden
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-tertiary text-on-tertiary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{t('clinicDetails.badge_fqhc')}</span>
              <span className="text-sm font-semibold opacity-90 uppercase tracking-tight">{t('clinicDetails.badge_desc')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-headline font-extrabold mb-4 leading-none tracking-tight">
              Good Samaritan Health Center
            </h1>
            <p className="text-lg md:text-xl font-body opacity-90 max-w-xl">
              {t('clinicDetails.subtitle')}
            </p>
          </div>
          <div className="relative z-10 flex flex-col gap-4 w-full md:w-auto">
            <button className="bg-surface-container-lowest text-primary px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-95">
              <span className="material-symbols-outlined">call</span>
              {t('clinicDetails.btn_call')}
            </button>
            <button className="border border-white/30 text-white px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined">calendar_today</span>
              {t('clinicDetails.btn_schedule')}
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address */}
              <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="text-secondary font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {t('clinicDetails.location')}
                  </div>
                  <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">123 Community Way</h3>
                  <p className="text-on-surface-variant leading-relaxed">
                    Central District, Plaza Suite 400<br />San Antonio, TX 78205
                  </p>
                </div>
                <div className="mt-8">
                  <button className="text-primary font-bold flex items-center gap-2 group">
                    {t('clinicDetails.open_maps')}
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-surface-container-low p-8 rounded-xl">
                <div className="text-secondary font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {t('clinicDetails.hours')}
                </div>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm border-b border-outline-variant/20 pb-2">
                    <span className="text-on-surface-variant">{t('clinicDetails.mon_fri')}</span>
                    <span className="font-bold text-on-surface">8:00 AM – 7:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center text-sm border-b border-outline-variant/20 pb-2">
                    <span className="text-on-surface-variant">{t('clinicDetails.sat')}</span>
                    <span className="font-bold text-on-surface">9:00 AM – 2:00 PM</span>
                  </li>
                  <li className="flex justify-between items-center text-sm italic">
                    <span className="text-on-surface-variant">{t('clinicDetails.sun')}</span>
                    <span className="text-error font-medium">{t('clinicDetails.closed')}</span>
                  </li>
                </ul>
              </div>

              {/* Safety Callout */}
              <div className="bg-secondary text-on-secondary p-8 rounded-xl relative overflow-hidden group md:col-span-2">
                <div className="absolute -right-8 -top-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <span className="material-symbols-outlined text-[160px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
                </div>
                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                    </div>
                    <h2 className="text-3xl font-headline font-extrabold tracking-tight">{t('clinicDetails.safety_title')}</h2>
                  </div>
                  <p className="text-lg opacity-90 leading-relaxed">
                    {t('clinicDetails.safety_desc')}
                  </p>
                </div>
              </div>

              {/* Services Grid */}
              <div className="bg-surface-container-lowest p-8 rounded-xl md:col-span-2">
                <h3 className="text-2xl font-headline font-bold text-on-surface mb-8">{t('clinicDetails.services_title')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { icon: 'child_care', label: t('clinicDetails.srv_pediatrics'), desc: t('clinicDetails.srv_pediatrics_desc') },
                    { icon: 'dentistry', label: t('clinicDetails.srv_dental'), desc: t('clinicDetails.srv_dental_desc') },
                    { icon: 'psychology', label: t('clinicDetails.srv_mental'), desc: t('clinicDetails.srv_mental_desc') },
                    { icon: 'medication', label: t('clinicDetails.srv_pharmacy'), desc: t('clinicDetails.srv_pharmacy_desc') },
                    { icon: 'female', label: t('clinicDetails.srv_womens'), desc: t('clinicDetails.srv_womens_desc') },
                    { icon: 'biotech', label: t('clinicDetails.srv_lab'), desc: t('clinicDetails.srv_lab_desc') },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col gap-4 p-6 rounded-lg bg-surface hover:bg-surface-container-high transition-colors">
                      <span className="material-symbols-outlined text-primary text-3xl">{s.icon}</span>
                      <div className="font-bold text-on-surface">{s.label}</div>
                      <p className="text-xs text-on-surface-variant">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-8">
            {/* Map snippet */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-lg">
              <div className="h-64 w-full relative">
                <img
                  src={IMG_MAP_SNIPPET}
                  alt="Map showing clinic location in San Antonio"
                  className="w-full h-full object-cover grayscale opacity-80"
                />
                <div className="absolute inset-0 bg-primary/5" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs text-on-surface-variant mb-4 italic">{t('clinicDetails.travel_est')}</p>
                <button className="w-full py-4 bg-surface-container-high rounded-lg text-secondary font-bold hover:bg-secondary-container hover:text-on-secondary-container transition-all">
                  {t('clinicDetails.get_directions')}
                </button>
              </div>
            </div>

            {/* Community Trust */}
            <div className="p-8 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed-variant">
              <span className="material-symbols-outlined text-4xl mb-4 block">volunteer_activism</span>
              <h4 className="text-xl font-headline font-bold mb-2">{t('clinicDetails.community_title')}</h4>
              <p className="text-sm opacity-90 leading-relaxed mb-6">
                {t('clinicDetails.community_desc')}
              </p>
              <div className="flex -space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full border-2 border-tertiary-fixed bg-secondary flex items-center justify-center text-[10px] text-white font-bold">SJ</div>
                <div className="w-10 h-10 rounded-full border-2 border-tertiary-fixed bg-primary flex items-center justify-center text-[10px] text-white font-bold">MR</div>
                <div className="w-10 h-10 rounded-full border-2 border-tertiary-fixed bg-tertiary flex items-center justify-center text-[10px] text-white font-bold">AL</div>
                <div className="w-10 h-10 rounded-full border-2 border-tertiary-fixed bg-surface-container flex items-center justify-center text-[10px] text-on-surface font-bold">+4k</div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest">{t('clinicDetails.trusted_by')}</p>
            </div>

            {/* Contact Card */}
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low mb-6">
                <div className="w-10 h-10 rounded-full bg-primary-fixed overflow-hidden">
                  <img
                    src={IMG_USER_SIDEBAR}
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface">{t('clinicDetails.user_profile')}</div>
                  <div className="text-[10px] text-on-surface-variant">{t('clinicDetails.manage_health')}</div>
                </div>
              </div>
              <h4 className="font-headline font-bold text-lg mb-4">{t('clinicDetails.direct_lines')}</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-secondary">phone</span>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-on-surface-variant">{t('clinicDetails.general_inq')}</div>
                    <div className="font-bold">(210) 555-0123</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-secondary">emergency</span>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-on-surface-variant">{t('clinicDetails.after_hours')}</div>
                    <div className="font-bold">(210) 555-0199</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/clinics')}
              className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              {t('clinicDetails.back_map')}
            </button>
          </div>
        </div>
      </main>
    </SidebarLayout>
  );
}
