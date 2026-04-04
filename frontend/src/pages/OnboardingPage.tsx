import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext, type Situation } from '../context/AppContext';
import LanguageToggle from '../components/common/LanguageToggle';

const SITUATIONS: { key: Situation; icon: string; labelKey: string; descKey: string }[] = [
  { key: 'no_insurance', icon: 'favorite', labelKey: 'onboarding.situation_no_insurance', descKey: 'onboarding.situation_no_insurance_desc' },
  { key: 'undocumented', icon: 'shield_person', labelKey: 'onboarding.situation_undocumented', descKey: 'onboarding.situation_undocumented_desc' },
  { key: 'mental_health', icon: 'psychology', labelKey: 'onboarding.situation_mental_health', descKey: 'onboarding.situation_mental_health_desc' },
  { key: 'insured', icon: 'description', labelKey: 'onboarding.situation_insured', descKey: 'onboarding.situation_insured_desc' },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setSituation } = useAppContext();
  const [selected, setSelected] = useState<Situation | null>(null);

  const handleStart = () => {
    if (!selected) return;
    setSituation(selected);
    navigate('/home');
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col overflow-x-hidden">
      {/* Top Nav */}
      <header className="w-full top-0 z-50">
        <nav className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          <div className="text-2xl font-black text-primary font-headline tracking-tight">
            Clínica
          </div>
          <LanguageToggle />
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative">
        {/* Decorative blurs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl w-full relative z-10">
          {/* Brand Intro */}
          <div className="text-center mb-12">
            <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-primary mb-4 tracking-tight">
              Clínica
            </h1>
            <p className="font-headline text-xl md:text-2xl text-on-surface-variant font-medium">
              {t('onboarding.tagline').split('.')[0]}.{' '}
              <span className="text-secondary font-bold italic">
                {t('onboarding.tagline').split('.')[1]?.trim() || 'In your language.'}
              </span>
            </p>
          </div>

          {/* Onboarding Card */}
          <div className="glass-card bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(154,64,40,0.08)]">
            <div className="mb-8">
              <h2 className="font-headline text-2xl font-bold text-on-surface text-center">
                {t('onboarding.situation_title')}
              </h2>
              <p className="text-on-surface-variant text-center mt-2 font-medium">
                {t('onboarding.situation_subtitle')}
              </p>
            </div>

            {/* Situation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SITUATIONS.map((s) => {
                const isActive = selected === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => setSelected(s.key)}
                    className={`flex flex-col items-start p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                      isActive
                        ? 'border-primary bg-primary/5 scale-[1.02] ring-4 ring-primary/10'
                        : 'border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-low'
                    }`}
                  >
                    <div className={`mb-4 ${isActive ? 'text-primary' : 'text-secondary'}`}>
                      <span
                        className="material-symbols-outlined text-4xl"
                        style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {s.icon}
                      </span>
                    </div>
                    <h3
                      className={`font-headline font-bold text-lg leading-tight ${
                        isActive ? 'text-primary' : 'text-on-surface'
                      }`}
                    >
                      {t(s.labelKey)}
                    </h3>
                    <p className="text-sm text-on-surface-variant mt-2">{t(s.descKey)}</p>
                  </button>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-10">
              <button
                onClick={handleStart}
                disabled={!selected}
                className={`w-full py-5 rounded-xl font-headline font-extrabold text-xl shadow-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                  selected
                    ? 'bg-primary hover:bg-primary-container text-white shadow-primary/20 hover:-translate-y-1 active:scale-95'
                    : 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed shadow-none'
                }`}
              >
                {t('onboarding.cta_start')}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <p className="text-center mt-6 text-on-surface-variant text-xs font-medium uppercase tracking-widest opacity-60">
                {t('onboarding.disclaimer')}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant text-sm font-medium">
          <div className="flex items-center gap-6">
            <a className="hover:text-primary transition-colors" href="#">
              {t('footer.privacy')}
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              {t('footer.terms')}
            </a>
          </div>
          <div className="opacity-50">{t('footer.copyright')}</div>
        </div>
      </footer>
    </div>
  );
}
