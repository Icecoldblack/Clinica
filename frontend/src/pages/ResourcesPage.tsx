import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import SidebarLayout from '../components/layout/SidebarLayout';

// Image URLs from original HTML design
const IMG_HERO_MAIN = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0VY8fRT2pR_RuSo0ow5giBYbjVajvPWKPnBOTzpVYifOLPps1Jb9qzvPU8tw5BV1kUqoYeDqYOVEawUsFeX71tVNRaTFbQbUDMT9DTnrPH8QzhkbJKTb8jXtMIgjCMMO_YknuA9usXcgaWjiPfPiaWM1m2pf8tYSmTUESO3wQsSrUQAOsQtRIb2cmgP7WeGf768XIT6H22apCuG-oiP9_AEC1l9L72IUMIKqWftp60WzVqDeZOJO4u5NU3mzpVIswxmYR-i5RHio';
const IMG_HERO_PORTRAIT = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGnxclSCSfg3ydHcIY1i9_-j_MDqvAFqiRn90wjN4RjleZpQ3AoON6b62--iTALpZynInF2iE401gnU9fWwkbtjLcHIB0GZ9TqJla7RgSUYuT9Q_YgdRWJUvqPspCZQyhaw5yn-tCkcWLRszR2ZiNjnsyOkK7NMn62JZGl3p_IXZnQruaeCaFFCs_KmfE1mFNRP3UhUPDUQ8aVBFzLgsi7AlmhENLuhuNWskguMOo60i92eKrp_mQDe4suHKIwu9s1HXqI3DQp_84';

export default function ResourcesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { situation } = useAppContext();

  useEffect(() => {
    if (!situation) navigate('/', { replace: true });
  }, [situation, navigate]);

  if (!situation) return null;

  return (
    <SidebarLayout activeNav="resources">
      <main className="px-6 lg:px-12 max-w-screen-2xl mx-auto py-8">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest rounded-full mb-6">
                {t('resources.badge')}
              </span>
              <h2 className="text-5xl md:text-7xl font-headline font-extrabold text-primary leading-tight mb-8">
                {t('resources.title')} <br />
                <span className="text-secondary italic">{t('resources.subtitle')}</span>
              </h2>
              <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed">
                {t('resources.desc')}
              </p>
            </div>

            {/* Hero image stack — main photo + portrait overlay */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-3 bg-surface-container-high">
                <img
                  src={IMG_HERO_MAIN}
                  alt="Modern healthcare interior with warm wood tones and natural light"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 aspect-square w-48 rounded-2xl overflow-hidden shadow-xl -rotate-6 border-4 border-surface">
                <img
                  src={IMG_HERO_PORTRAIT}
                  alt="Empowered diverse woman professional smiling"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid: Legal & FQHC */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {/* Legal Rights */}
          <div className="md:col-span-2 bg-surface-container-lowest p-10 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-primary opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">gavel</span>
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">balance</span>
              </div>
              <h3 className="text-3xl font-headline font-bold mb-6 text-on-surface">{t('resources.legal_title')}</h3>
              <ul className="space-y-4 mb-8">
                {[
                  {
                    title: t('resources.legal_1_title'),
                    desc: t('resources.legal_1_desc'),
                  },
                  {
                    title: t('resources.legal_2_title'),
                    desc: t('resources.legal_2_desc'),
                  },
                  {
                    title: t('resources.legal_3_title'),
                    desc: t('resources.legal_3_desc'),
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-secondary mt-1">check_circle</span>
                    <div>
                      <p className="font-bold text-on-surface">{item.title}</p>
                      <p className="text-sm text-on-surface-variant">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="text-primary font-bold flex items-center gap-2 hover:underline">
                {t('resources.download_guide')}
                <span className="material-symbols-outlined text-sm">download</span>
              </button>
            </div>
          </div>

          {/* FQHC Card */}
          <div className="bg-secondary text-on-secondary p-10 rounded-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">security</span>
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4">{t('resources.fqhc_title')}</h3>
              <p className="text-on-secondary/80 text-sm leading-relaxed mb-6">
                {t('resources.fqhc_desc')}
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs font-bold tracking-widest uppercase mb-2 opacity-60">{t('resources.did_you_know')}</p>
              <p className="text-sm">{t('resources.fqhc_fact')}</p>
            </div>
          </div>
        </section>

        {/* Resource Library */}
        <section className="mb-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h3 className="text-4xl font-headline font-extrabold text-on-surface mb-2">{t('resources.library_title')}</h3>
              <p className="text-on-surface-variant">{t('resources.library_subtitle')}</p>
            </div>
            <div className="hidden md:flex gap-2">
              <button className="p-2 border border-outline-variant rounded-full text-outline hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="p-2 border border-outline-variant rounded-full text-outline hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: t('resources.lib_1_title'),
                type: t('resources.lib_1_type'),
                desc: t('resources.lib_1_desc'),
                icon: 'description',
                gradient: 'from-primary to-primary-container',
                action: t('resources.btn_download'),
                actionIcon: 'arrow_forward',
              },
              {
                title: t('resources.lib_2_title'),
                type: t('resources.lib_2_type'),
                desc: t('resources.lib_2_desc'),
                icon: 'translate',
                gradient: 'from-secondary to-on-secondary-container',
                action: t('resources.btn_download'),
                actionIcon: 'arrow_forward',
              },
              {
                title: t('resources.lib_3_title'),
                type: t('resources.lib_3_type'),
                desc: t('resources.lib_3_desc'),
                icon: 'medical_information',
                gradient: 'from-tertiary to-tertiary-container',
                action: t('resources.btn_download'),
                actionIcon: 'arrow_forward',
              },
              {
                title: t('resources.lib_4_title'),
                type: t('resources.lib_4_type'),
                desc: t('resources.lib_4_desc'),
                icon: 'record_voice_over',
                gradient: 'from-inverse-surface to-on-surface',
                action: t('resources.btn_watch'),
                actionIcon: 'play_circle',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-surface-container-low p-6 rounded-xl group cursor-pointer hover:shadow-2xl hover:shadow-primary/5 transition-all"
              >
                <div className="aspect-[3/4] rounded-lg overflow-hidden mb-6 border border-outline-variant/10">
                  <div className={`w-full h-full bg-gradient-to-br ${card.gradient} p-6 flex flex-col justify-between`}>
                    <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {card.icon}
                    </span>
                    <h4 className="text-white font-bold text-xl leading-tight">{card.title}</h4>
                  </div>
                </div>
                <p className="text-xs font-bold text-tertiary mb-2 uppercase">{card.type}</p>
                <p className="text-sm text-on-surface-variant mb-4">{card.desc}</p>
                <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                  <span>{card.action}</span>
                  <span className="material-symbols-outlined">{card.actionIcon}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Help Section */}
        <section className="bg-primary-fixed text-on-primary-fixed p-12 rounded-3xl text-center relative overflow-hidden mb-12">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl font-headline font-bold mb-4">{t('resources.help_title')}</h3>
            <p className="mb-8 opacity-90">
              {t('resources.help_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/chat')}
                className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">chat</span>
                {t('resources.chat_navigator')}
              </button>
              <button className="bg-white text-primary px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-surface-container transition-all">
                <span className="material-symbols-outlined">call</span>
                1-800-CLINICA
              </button>
            </div>
          </div>
        </section>
      </main>
    </SidebarLayout>
  );
}
