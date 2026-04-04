import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import SidebarLayout from '../components/layout/SidebarLayout';

export default function HomePage() {
  const navigate = useNavigate();
  const { situation } = useAppContext();

  useEffect(() => {
    if (!situation) navigate('/', { replace: true });
  }, [situation, navigate]);

  if (!situation) return null;

  const situationLabel: Record<string, string> = {
    no_insurance: 'No Insurance',
    undocumented: 'Immigration Concerns',
    mental_health: 'Mental Health Support',
    insured: 'Insured – Needs Help',
  };

  return (
    <SidebarLayout activeNav="home">
      <main className="px-6 lg:px-12 max-w-7xl mx-auto py-8">
        {/* Hero Welcome */}
        <section className="relative overflow-hidden rounded-xl mb-12 group">
          <div className="absolute inset-0 bg-primary-container opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
          <div className="relative z-10 p-8 lg:p-16 flex flex-col items-start max-w-2xl">
            <h2 className="font-headline text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
              Welcome to Clínica.<br />
              Your Health, Your Language.
            </h2>
            <p className="text-white/90 text-lg mb-8 font-medium">
              Access community clinics and medical resources tailored for your needs.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="bg-surface-container-lowest text-primary px-8 py-3 rounded-lg font-bold shadow-xl shadow-black/10 hover:bg-surface-bright transition-all active:scale-95"
            >
              View Records
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
                Priority Tool
              </div>
              <h3 className="font-headline text-3xl font-extrabold text-on-surface">Start AI Triage</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Check your symptoms in under 2 minutes. We'll guide you to the right care based on your situation.
              </p>
              <button
                onClick={() => navigate('/chat')}
                className="mt-4 flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-container transition-all active:scale-95"
              >
                Begin Assessment
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
              <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Situation Profile</h4>
              <p className="text-xl font-headline font-bold text-error">
                Current Situation:<br />
                {situationLabel[situation] || situation}
              </p>
            </div>
            <div className="mt-8 space-y-3">
              <p className="text-sm text-on-surface-variant">
                Don't worry. You can still access care at FQHC clinics.
              </p>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-primary font-bold text-sm group"
              >
                Update Status
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">edit</span>
              </button>
            </div>
          </div>

          {/* Nearby Clinics Preview */}
          <div className="md:col-span-6 bg-surface-container-low rounded-xl overflow-hidden shadow-sm border border-outline-variant/15">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline text-xl font-bold">Nearby Clinics</h3>
                <button onClick={() => navigate('/clinics')} className="text-secondary font-bold text-sm">
                  View on Map
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-lg">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-on-surface">Community Health East</p>
                    <p className="text-xs text-on-surface-variant">1.2 miles • FQHC Certified</p>
                  </div>
                  <span className="text-xs font-bold text-secondary">Open</span>
                </div>
                <div className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-lg">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-on-surface">Mission District Medical</p>
                    <p className="text-xs text-on-surface-variant">2.8 miles • Sliding Scale</p>
                  </div>
                  <span className="text-xs font-bold text-tertiary">Closing soon</span>
                </div>
              </div>
            </div>
            <div className="h-32 bg-surface-container-highest relative overflow-hidden">
              <div className="absolute inset-0 bg-surface-dim/30" />
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
                <h4 className="font-headline font-bold text-lg text-primary mb-1">Know Your Rights</h4>
                <p className="text-sm text-on-surface-variant mb-3">
                  Understand healthcare privacy and access laws for everyone.
                </p>
                <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1 group">
                  Read Guide <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
              <div className="w-24 h-24 bg-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  gavel
                </span>
              </div>
            </button>

            <button
              onClick={() => navigate('/resources')}
              className="bg-surface rounded-xl p-6 border border-outline-variant/20 shadow-sm flex gap-6 items-center text-left hover:shadow-lg transition-all"
            >
              <div className="flex-1">
                <h4 className="font-headline font-bold text-lg text-primary mb-1">How FQHCs Protect You</h4>
                <p className="text-sm text-on-surface-variant mb-3">
                  Federally Qualified Health Centers provide safe care regardless of status.
                </p>
                <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1 group">
                  Learn More <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
              <div className="w-24 h-24 bg-secondary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-4xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  security
                </span>
              </div>
            </button>
          </div>

          {/* Safety Callout */}
          <div className="md:col-span-12 bg-tertiary-fixed/30 rounded-xl p-8 border border-tertiary/10 flex items-center gap-6">
            <div className="w-16 h-16 bg-tertiary/20 rounded-full flex items-center justify-center text-tertiary shrink-0">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
            </div>
            <div>
              <h5 className="font-headline font-bold text-xl text-on-tertiary-fixed-variant">Your Privacy is Our Priority</h5>
              <p className="text-on-tertiary-fixed-variant opacity-80">
                Federal law prohibits health centers from sharing your personal information with authorities. Your health data is encrypted and protected under HIPAA.
              </p>
            </div>
          </div>
        </div>
      </main>
    </SidebarLayout>
  );
}
