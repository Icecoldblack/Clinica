import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <main className="flex-grow">
      {/* ─── Hero & Welcome ─── */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-fixed text-on-primary-fixed-variant mb-8">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase font-label">
                Clinical Intelligence System
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-on-surface leading-[1.1] mb-6 tracking-tight">
              Welcome to <span className="text-primary">MedaPath</span>
            </h1>

            <p className="text-xl text-on-surface-variant font-body leading-relaxed max-w-2xl mb-10">
              Experience a new standard in preliminary health assessment. Our clinical sanctuary provides a structured
              pathway to understanding your symptoms through advanced tonal architecture and patient-centric data modeling.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button
                onClick={() => navigate('/intake')}
                className="primary-gradient-btn text-white px-10 py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-95 transition-all flex items-center gap-3"
              >
                Get Started
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button className="px-10 py-5 rounded-xl border border-outline-variant bg-surface-container-low font-semibold text-on-surface hover:bg-surface-container transition-colors">
                Learn more
              </button>
            </div>
          </div>

          {/* Right Content — Hero Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcF50XYQxxKJaSvCkE1pY0jgFJmzFDKu53n5AobNEzrrL9EEo68cCoLK5MEZLkEQBuW3OZSF-qWLqAsKLuWyLdTMYREZSu4kvZyHgAOWpmrAru-hF4U6k5bNxPXNt5_xm6ZQQHzMahikzRyP6aNXU0Hvijs_LA4NllJ9KYc2C3JgZQmpwl4WZxzJA6cJrAJIFW8svd6A2q3wDBQu7zdfVRn0e2OOcK4SfjxdKfx7mpEuWNjcRAhtRQ6TBFXIKwcYGzq3RiWYs24J9J"
                alt="Modern clinical examination room with soft blue lighting"
              />
              {/* Glass Overlay Card */}
              <div className="absolute bottom-6 left-6 right-6 glass-header p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      analytics
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Pathology Integrated</p>
                    <p className="text-xs text-on-surface-variant">Real-time symptom mapping enabled</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-fixed-dim/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-fixed/20 rounded-full blur-[100px] -z-10" />
          </div>
        </div>
      </section>

      {/* ─── Disclaimer Section ─── */}
      <section className="bg-surface-container-low py-20">
        <div className="max-w-5xl mx-auto px-8">
          <div className="bg-surface-container-lowest rounded-[2rem] p-12 shadow-[0_8px_32px_rgba(25,28,29,0.04)] relative overflow-hidden">
            {/* Accent Bar */}
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />

            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-error-container flex items-center justify-center text-error">
                  <span
                    className="material-symbols-outlined text-4xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    gavel
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-on-surface mb-6">Medical Information Disclaimer</h2>
                <div className="space-y-6 text-on-surface-variant leading-relaxed font-body text-lg">
                  <p>
                    MedaPath is designed to provide health-related information based on user-reported symptoms.
                    This tool uses clinical data models to offer insights, but it is{' '}
                    <strong>not a substitute for professional medical advice, diagnosis, or treatment.</strong>
                  </p>
                  <p>
                    The results generated by this tool are for informational and educational purposes only. Always seek
                    the advice of your physician or other qualified health providers with any questions you may have
                    regarding a medical condition.
                  </p>
                  <p className="font-semibold text-on-surface">
                    In the event of a medical emergency, call emergency services immediately or go to the nearest
                    emergency room.
                  </p>
                </div>

                <div className="mt-10 p-6 rounded-xl bg-surface-container-high border border-outline-variant/20 flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary mt-1">info</span>
                  <p className="text-sm font-medium text-on-surface">
                    By proceeding, you acknowledge that you have read and understood this disclaimer and agree to use
                    MedaPath as an informational supplement only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Grid: Bento Style ─── */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="mb-16">
          <h3 className="text-4xl font-extrabold text-on-surface mb-4">A Precision Journey</h3>
          <p className="text-on-surface-variant max-w-xl">
            Our structured intake process ensures every data point is captured with clinical accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-on-secondary-fixed-variant">assignment</span>
            </div>
            <h4 className="text-xl font-bold mb-3">Structured Intake</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Systematic data collection tailored to your demographic profile for higher precision.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-on-tertiary-fixed-variant">medical_services</span>
            </div>
            <h4 className="text-xl font-bold mb-3">Symptom Mapping</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Dynamic logic that adapts questions based on your previous responses to drill down into core issues.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-on-primary-fixed-variant">biotech</span>
            </div>
            <h4 className="text-xl font-bold mb-3">Clinical Analysis</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Peer-reviewed algorithms analyze patterns to provide comprehensive health summaries.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
