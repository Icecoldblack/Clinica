import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext, type Situation, type InsuranceInfo } from '../context/AppContext';
import { getInsuranceProviders, type InsuranceProvider } from '../services/insuranceService';

const SITUATIONS: { key: Situation; icon: string; labelKey: string; descKey: string }[] = [
  { key: 'no_insurance', icon: 'favorite', labelKey: 'onboarding.situation_no_insurance', descKey: 'onboarding.situation_no_insurance_desc' },
  { key: 'undocumented', icon: 'shield_person', labelKey: 'onboarding.situation_undocumented', descKey: 'onboarding.situation_undocumented_desc' },
  { key: 'mental_health', icon: 'psychology', labelKey: 'onboarding.situation_mental_health', descKey: 'onboarding.situation_mental_health_desc' },
  { key: 'insured', icon: 'description', labelKey: 'onboarding.situation_insured', descKey: 'onboarding.situation_insured_desc' },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setSituation, setInsuranceInfo, setAge, language, setLanguage, triggerRouteTransition } = useAppContext();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedSituation, setSelectedSituation] = useState<Situation | null>(null);

  // Insurance State
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [customProvider, setCustomProvider] = useState<string>('');
  const [customPlan, setCustomPlan] = useState<string>('');
  const [ageInput, setAgeInput] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    getInsuranceProviders()
      .then((data) => {
        if (mounted) {
          setProviders(data);
        }
      })
      .catch(() => {
        // Handle error silently
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleNextStep = () => {
    if (!selectedSituation) return;
    setStep(2);
  };

  const finishOnboarding = (insurance: InsuranceInfo | null) => {
    if (selectedSituation) {
      setSituation(selectedSituation);
    }
    setInsuranceInfo(insurance);
    const parsedAge = ageInput.trim() !== '' ? parseInt(ageInput, 10) : null;
    setAge(!isNaN(parsedAge as number) && parsedAge !== null ? parsedAge : null);
    triggerRouteTransition(() => navigate('/home'));
  };

  const handleSkipInsurance = () => {
    finishOnboarding(null);
  };

  const handleContinueInsurance = () => {
    if (selectedProvider === 'none') {
      finishOnboarding(null);
      return;
    }
    const isCustom = selectedProvider === 'other' || selectedPlan === 'other';
    const finalProvider = selectedProvider === 'other' ? customProvider : selectedProvider;
    const finalPlan = selectedPlan === 'other' ? customPlan : selectedPlan;
    
    if (!finalProvider) return; // Prevent empty continuation

    finishOnboarding({
      provider: finalProvider,
      planName: finalPlan,
      isCustom,
    });
  };

  const availablePlans = selectedProvider !== 'other' 
    ? providers.find(p => p.name === selectedProvider)?.plans || [] 
    : [];

  return (
    <div className="bg-surface min-h-screen flex flex-col overflow-x-hidden">
      {/* Top Nav */}
      <header className="w-full top-0 z-50">
        <nav className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          <div className="text-2xl font-black text-primary font-headline tracking-tight">
            Clínica
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Decorative blurs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl w-full relative z-10">
          {/* Brand Intro - Only on step 1 */}
          <div className={`text-center mb-12 transition-all duration-500 ${step === 1 ? 'opacity-100' : 'opacity-0 h-0 mb-0 overflow-hidden'}`}>
            <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-primary mb-4 tracking-tight">
              Clínica
            </h1>
            <p className="font-headline text-xl md:text-2xl text-on-surface-variant font-medium">
              {t('onboarding.tagline').split('.')[0]}.{' '}
              <span className="text-secondary font-bold italic">
                {t('onboarding.tagline').split('.')[1]?.trim() || 'In your language.'}
              </span>
            </p>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className="bg-surface border border-outline-variant/30 text-primary font-bold px-5 py-2.5 rounded-full hover:bg-surface-container hover:shadow-md transition-all active:scale-95 shadow-sm inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">language</span>
                {language === 'en' ? 'Ver en Español' : 'View in English'}
              </button>
            </div>
          </div>

          <div className="relative">
            {/* Step 1: Situation */}
            <div className={`glass-card bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(154,64,40,0.08)] transition-all duration-500 absolute w-full top-0 ${step === 1 ? 'opacity-100 translate-x-0 relative' : 'opacity-0 -translate-x-full pointer-events-none'}`}>
              <div className="mb-8">
                <h2 className="font-headline text-2xl font-bold text-on-surface text-center">
                  {t('onboarding.situation_title')}
                </h2>
                <p className="text-on-surface-variant text-center mt-2 font-medium">
                  {t('onboarding.situation_subtitle')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SITUATIONS.map((s) => {
                  const isActive = selectedSituation === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setSelectedSituation(s.key)}
                      className={`flex flex-col items-start p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                        isActive
                          ? 'border-primary bg-primary/5 scale-[1.02] ring-4 ring-primary/10'
                          : 'border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-low'
                      }`}
                    >
                      <div className={`mb-4 ${isActive ? 'text-primary' : 'text-secondary'}`}>
                        <span className="material-symbols-outlined text-4xl" style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                          {s.icon}
                        </span>
                      </div>
                      <h3 className={`font-headline font-bold text-lg leading-tight ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                        {t(s.labelKey)}
                      </h3>
                      <p className="text-sm text-on-surface-variant mt-2">{t(s.descKey)}</p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-10">
                <button
                  onClick={handleNextStep}
                  disabled={!selectedSituation}
                  className={`w-full py-5 rounded-xl font-headline font-extrabold text-xl shadow-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                    selectedSituation
                      ? 'bg-primary hover:bg-primary-container text-white shadow-primary/20 hover:-translate-y-1 active:scale-95'
                      : 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed shadow-none'
                  }`}
                >
                  {t('onboarding.insurance_continue') || 'Continue'}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <p className="text-center mt-6 text-on-surface-variant text-xs font-medium uppercase tracking-widest opacity-60">
                  {t('onboarding.disclaimer')}
                </p>
              </div>
            </div>

            {/* Step 2: Insurance Info */}
            <div className={`glass-card bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(154,64,40,0.08)] transition-all duration-500 absolute w-full top-0 ${step === 2 ? 'opacity-100 translate-x-0 relative' : 'opacity-0 translate-x-full pointer-events-none'}`}>
              <button 
                onClick={() => setStep(1)}
                className="absolute top-6 left-6 text-secondary hover:text-primary transition-colors flex items-center text-sm font-bold"
              >
                <span className="material-symbols-outlined mr-1">arrow_back</span>
                {t('onboarding.back')}
              </button>

              <div className="mb-8 mt-4">
                <h2 className="font-headline text-2xl font-bold text-on-surface text-center">
                  {t('onboarding.insurance_title')}
                </h2>
              </div>

              <div className="space-y-6">
                {/* Age field */}
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">cake</span>
                      {t('onboarding.age_label') || 'Your Age'}
                      <span className="text-on-surface-variant/50 font-normal">({t('common.optional') || 'optional'})</span>
                    </span>
                  </label>
                  <input
                    id="onboarding-age"
                    type="number"
                    min="1"
                    max="120"
                    placeholder={t('onboarding.age_placeholder') || 'e.g. 34'}
                    value={ageInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 120)) {
                        setAgeInput(val);
                      }
                    }}
                    className="w-full p-4 rounded-xl border border-outline-variant/30 bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <p className="text-xs text-on-surface-variant/60 mt-1.5">
                    {t('onboarding.age_hint') || 'Helps us find age-appropriate clinics and hospitals for you.'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-2">
                    {t('onboarding.insurance_provider_label')}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedProvider}
                      onChange={(e) => {
                        setSelectedProvider(e.target.value);
                        setSelectedPlan('');
                      }}
                      className="w-full p-4 rounded-xl border border-outline-variant/30 bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none"
                    >
                      <option value="" disabled>{t('onboarding.insurance_provider_placeholder')}</option>
                      <option value="none">{t('onboarding.insurance_none') || 'None'}</option>
                      {providers.map((p) => (
                        <option key={p.name} value={p.name}>{p.name}</option>
                      ))}
                      <option value="other">{t('onboarding.insurance_other_provider') || 'Enter your provider'}</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
                  </div>
                </div>

                {selectedProvider === 'other' && (
                  <div>
                    <input
                      type="text"
                      placeholder={t('onboarding.insurance_custom_provider')}
                      value={customProvider}
                      onChange={(e) => setCustomProvider(e.target.value)}
                      className="w-full p-4 rounded-xl border border-outline-variant/30 bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                )}

                {(availablePlans.length > 0 || selectedProvider === 'other') && (
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-2">
                      {t('onboarding.insurance_plan_label')}
                    </label>
                    <div className="relative">
                      <select
                        value={selectedPlan}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                        className="w-full p-4 rounded-xl border border-outline-variant/30 bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none"
                      >
                        <option value="">{t('onboarding.insurance_plan_placeholder')}</option>
                        {availablePlans.map((plan) => (
                          <option key={plan} value={plan}>{plan}</option>
                        ))}
                        <option value="other">{t('onboarding.insurance_other_plan') || 'Enter your plan'}</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
                    </div>
                  </div>
                )}

                {selectedPlan === 'other' && (
                  <div>
                    <input
                      type="text"
                      placeholder={t('onboarding.insurance_custom_plan')}
                      value={customPlan}
                      onChange={(e) => setCustomPlan(e.target.value)}
                      className="w-full p-4 rounded-xl border border-outline-variant/30 bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                )}
              </div>

              <div className="mt-10 flex flex-col gap-4">
                <button
                  onClick={handleContinueInsurance}
                  disabled={!selectedProvider || (selectedProvider === 'other' && !customProvider)}
                  className={`w-full py-5 rounded-xl font-headline font-extrabold text-xl shadow-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                    selectedProvider && (selectedProvider !== 'other' || customProvider)
                      ? 'bg-primary hover:bg-primary-container text-white shadow-primary/20 hover:-translate-y-1 active:scale-95'
                      : 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed shadow-none'
                  }`}
                >
                  {t('onboarding.insurance_continue')}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button
                  onClick={handleSkipInsurance}
                  className="w-full py-4 rounded-xl font-bold text-secondary hover:bg-secondary/10 transition-colors"
                >
                  {t('onboarding.insurance_skip')}
                </button>
              </div>
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
