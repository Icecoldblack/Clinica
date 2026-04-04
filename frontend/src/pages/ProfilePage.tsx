import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import SidebarLayout from '../components/layout/SidebarLayout';

// Image URLs from original HTML design
const IMG_CLINIC_1 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD16ZdkDxYxqOI2bDCEnXhLvBr9K168AKkeZKtYTMIfl2Vrlg3PvARUxgJ4UIhGNLFI3i-hR_Z6b2LoT_9Jt7MA3NgN8iiIyAHiX5lyT6FvwBI45Rm4qeQgHpancCHU_Tp0J-usrqvUQ32l7ZdnydDNghfTnkhwFCmKV4rGntNxSKhdFKoqWI_rXuye5vbauaTdTy-ekGsUt0kaFcqvmnfiqHCp79Gf53IkGzhcAIfeGwrFvW88nx3gibfF1D4m7cER2Zw8qlmJCgA';
const IMG_CLINIC_2 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCi9mtOBk1q-wB-zAwR5L0fzvbRbohvkyf5onq7YzNGwtmDGXowFooRyzrrwtST6eEsc3HEv50CAV7MhdeFTEn1LrNdN7ojdG2Ga9quIEC_qj4DxurnJhaWBgdDysWKzVirlw2rom2w8OIsCkfrSEHqoQidkUCgToBWZ2tkBPGuoC0ZdEOAfurpmYUW6KAlAaqhcVIKUxso0bT9mIKJqA2W8muPZ5PlPr-9qDJHdJ3Ln4wv1iWguo8WhdezlPpniUemZGErDAsG0hg';
const IMG_USER_HEADER = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbA43Lr49rXFOtIzhFFr0Wle479BX6PwyBJpAHQb6b6lf_8fT2Lb6tSHxenfxJExOLZq6aIw_VQosWMki4r3OwxqJaFvMO6fTRCPiXjZZDJgMsrKHToFt_Rrq_YsEgNDwr3jCatmEJIxheH-hrpuRBCqQ7Pd3cd3CgIpsWphMJublncLXL1oua-637d0flUpRoOA7QDaW_1JGTRXSh2Fh8clsMV8GOp59UtMx6yHz5SwWCCwUSB9c0v-Su3QFmYpG8p18BEfBSeHs';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { situation, chatHistory } = useAppContext();

  useEffect(() => {
    if (!situation) navigate('/', { replace: true });
  }, [situation, navigate]);

  if (!situation) return null;

  const situationLabel: Record<string, string> = {
    no_insurance: 'No Insurance',
    undocumented: 'Immigration Concerns',
    mental_health: 'Mental Health Support',
    insured: 'Insured',
  };

  return (
    <SidebarLayout activeNav="profile">
      <main className="px-6 lg:px-12 max-w-7xl mx-auto py-8">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8">
            {/* Header */}
            <div className="mb-12">
              <span className="text-tertiary font-bold tracking-widest uppercase text-xs mb-2 block">Welcome Back</span>
              <h2 className="text-5xl font-extrabold text-primary tracking-tight leading-none mb-4">Your Health Journey</h2>
              <p className="text-on-surface-variant text-lg max-w-xl">
                Review your previous triage sessions and find saved care locations near you.
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
                  <h3 className="text-2xl font-bold">Current Situation</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-surface-container-lowest p-5 rounded-lg border-b-2 border-secondary">
                    <p className="text-sm text-on-surface-variant mb-1 font-label uppercase tracking-tighter">Insurance Status</p>
                    <p className="text-xl font-bold text-primary">{situationLabel[situation] || situation}</p>
                    <p className="text-xs text-secondary mt-2">Qualified for Sliding Scale Fees</p>
                  </div>
                  <div className="bg-surface-container-lowest p-5 rounded-lg">
                    <p className="text-sm text-on-surface-variant mb-1 font-label uppercase tracking-tighter">Primary Need</p>
                    <p className="text-xl font-bold">Community Health Triage</p>
                    <p className="text-xs text-on-surface-variant/60 mt-2">Active session</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat History */}
            <div>
              <div className="flex justify-between items-end mb-8">
                <h3 className="text-3xl font-bold text-secondary">Chat History</h3>
                <button className="text-primary font-bold text-sm hover:underline">
                  View All Sessions
                </button>
              </div>

              <div className="space-y-6">
                {chatHistory.length > 0 ? (
                  <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_32px_32px_-4px_rgba(27,28,27,0.06)] border-l-4 border-primary transition-transform hover:scale-[1.01] cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-bold text-tertiary uppercase tracking-widest mb-1">Current Session</p>
                        <h4 className="text-xl font-bold">Active Triage Session</h4>
                      </div>
                      <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">
                        Active
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                      {chatHistory.length} messages in current session.{' '}
                      {chatHistory.filter((m) => m.role === 'user').length} user messages.
                    </p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => navigate('/chat')}
                        className="flex items-center gap-2 text-sm font-bold text-secondary"
                      >
                        <span className="material-symbols-outlined text-sm">chat</span>
                        Resume Chat
                      </button>
                    </div>
                  </div>
                ) : (
                  // Sample completed session shown when no real history
                  <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_32px_32px_-4px_rgba(27,28,27,0.06)] border-l-4 border-primary transition-transform hover:scale-[1.01] cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-bold text-tertiary uppercase tracking-widest mb-1">Oct 12, 2023</p>
                        <h4 className="text-xl font-bold">Respiratory &amp; Fever Triage</h4>
                      </div>
                      <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">
                        Completed
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                      Discussion regarding moderate cough and elevated temperature. Guidance provided on low-cost urgent care clinics in the East Side area with Spanish-speaking staff.
                    </p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-sm font-bold text-primary">
                        <span className="material-symbols-outlined text-sm">description</span>
                        Download Summary
                      </button>
                      <button
                        onClick={() => navigate('/chat')}
                        className="flex items-center gap-2 text-sm font-bold text-secondary"
                      >
                        <span className="material-symbols-outlined text-sm">chat</span>
                        Resume Chat
                      </button>
                    </div>
                  </div>
                )}

                {/* Archived session */}
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_32px_32px_-4px_rgba(27,28,27,0.06)] border-l-4 border-outline-variant/30 transition-transform hover:scale-[1.01] cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest mb-1">Sep 28, 2023</p>
                      <h4 className="text-xl font-bold">Pediatric Immunization Inquiry</h4>
                    </div>
                    <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold">
                      Archived
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                    Inquiry about no-cost vaccination schedules for school enrollment. Recommended contacting the County Health Department mobile units.
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-sm font-bold text-primary/60">
                      <span className="material-symbols-outlined text-sm">description</span>
                      Download Summary
                    </button>
                  </div>
                </div>
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
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Welcome Back</p>
                <p className="font-bold text-on-surface">Verified Member</p>
              </div>
            </div>

            {/* Saved Clinics */}
            <div className="bg-surface-container-low rounded-xl p-6 shadow-[0_32px_32px_-4px_rgba(27,28,27,0.06)]">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary">bookmark</span>
                Saved Clinics
              </h3>
              <div className="space-y-4">
                <div className="group cursor-pointer" onClick={() => navigate('/clinics')}>
                  <div className="aspect-video w-full rounded-lg overflow-hidden mb-3">
                    <img
                      src={IMG_CLINIC_1}
                      alt="Modern clean exterior of a community health clinic"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="font-bold text-lg group-hover:text-primary transition-colors">St. Jude Community Care</h4>
                  <p className="text-sm text-on-surface-variant mb-2">1.2 miles away • Open Now</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-secondary/10 text-secondary text-[10px] font-bold uppercase px-2 py-0.5 rounded">Sliding Scale</span>
                    <span className="bg-secondary/10 text-secondary text-[10px] font-bold uppercase px-2 py-0.5 rounded">Walk-in</span>
                  </div>
                </div>

                <div className="bg-[#f2ede9] h-[1px] w-full my-6" />

                <div className="group cursor-pointer" onClick={() => navigate('/clinics')}>
                  <div className="aspect-video w-full rounded-lg overflow-hidden mb-3">
                    <img
                      src={IMG_CLINIC_2}
                      alt="Medical professional consulting with a patient"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="font-bold text-lg group-hover:text-primary transition-colors">La Familia Medical Center</h4>
                  <p className="text-sm text-on-surface-variant mb-2">2.5 miles away • Closes 5PM</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-secondary/10 text-secondary text-[10px] font-bold uppercase px-2 py-0.5 rounded">Spanish Speaking</span>
                    <span className="bg-secondary/10 text-secondary text-[10px] font-bold uppercase px-2 py-0.5 rounded">Pharmacy</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/clinics')}
                  className="w-full mt-6 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-container transition-colors shadow-lg shadow-primary/20 active:scale-95"
                >
                  Explore More Clinics
                </button>
              </div>
            </div>

            {/* Need Help CTA */}
            <div className="p-6 bg-secondary text-white rounded-xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-2">Need immediate help?</h4>
                <p className="text-sm opacity-80 mb-4">
                  Start a new triage session and get personalized clinic recommendations in minutes.
                </p>
                <button
                  onClick={() => navigate('/chat')}
                  className="bg-tertiary text-on-tertiary-fixed font-bold px-6 py-2 rounded-lg active:scale-95 transition-transform"
                >
                  New Triage
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
