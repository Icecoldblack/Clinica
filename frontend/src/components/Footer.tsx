export default function Footer() {
  return (
    <footer className="bg-slate-100 mt-20">
      <div className="w-full px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left max-w-7xl mx-auto">
        <div className="max-w-md">
          <p className="text-xs font-body leading-relaxed text-slate-500">
            © 2025 MedaPath Clinical Systems. Medical Disclaimer: This tool is for informational purposes only and does not constitute professional medical advice.
          </p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-6">
          <a href="#" className="text-xs font-body text-slate-500 hover:text-slate-900 opacity-80 hover:opacity-100 transition-all">
            Privacy Policy
          </a>
          <a href="#" className="text-xs font-body text-slate-500 hover:text-slate-900 opacity-80 hover:opacity-100 transition-all">
            Terms of Service
          </a>
          <a href="#" className="text-xs font-body text-blue-700 underline opacity-80 hover:opacity-100 transition-all">
            Emergency Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
