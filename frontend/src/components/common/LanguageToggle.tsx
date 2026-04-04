import { useAppContext } from '../../context/AppContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useAppContext();

  return (
    <div className="flex font-headline font-bold text-lg uppercase tracking-tight">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 transition-colors duration-200 ${
          language === 'en' ? 'text-primary' : 'text-on-surface-variant/50 hover:text-primary/70'
        }`}
      >
        EN
      </button>
      <span className="text-on-surface-variant/30">|</span>
      <button
        onClick={() => setLanguage('es')}
        className={`px-2 transition-colors duration-200 ${
          language === 'es' ? 'text-primary' : 'text-on-surface-variant/50 hover:text-primary/70'
        }`}
      >
        ES
      </button>
    </div>
  );
}
